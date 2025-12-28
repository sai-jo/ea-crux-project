#!/usr/bin/env node

/**
 * Map URLs in MDX files to Resource IDs
 *
 * Scans MDX files for markdown links and matches them against resources.yaml
 * to identify which links can be converted to <R id="..."> components.
 *
 * Usage:
 *   node scripts/map-urls-to-resources.mjs [file]
 *   node scripts/map-urls-to-resources.mjs                    # Scan all MDX files
 *   node scripts/map-urls-to-resources.mjs expertise-atrophy  # Scan specific file
 *   node scripts/map-urls-to-resources.mjs --stats            # Show statistics only
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import yaml from 'yaml';

const RESOURCES_PATH = 'src/data/resources.yaml';
const CONTENT_PATH = 'src/content/docs';

// Parse arguments
const args = process.argv.slice(2);
const STATS_ONLY = args.includes('--stats');
const SPECIFIC_FILE = args.find(a => !a.startsWith('--'));

// Load resources and build URL map
const resourcesContent = readFileSync(RESOURCES_PATH, 'utf-8');
const resources = yaml.parse(resourcesContent);

// Build URL → resource map (normalize URLs)
const urlToResource = new Map();
for (const r of resources) {
  // Store with and without trailing slash, www prefix variations
  const normalizedUrls = normalizeUrl(r.url);
  for (const url of normalizedUrls) {
    urlToResource.set(url, r);
  }
}

function normalizeUrl(url) {
  const variations = new Set();
  try {
    const parsed = new URL(url);
    // Base normalized form
    const base = parsed.href.replace(/\/$/, '');
    variations.add(base);
    variations.add(base + '/');

    // Without www
    if (parsed.hostname.startsWith('www.')) {
      const noWww = base.replace('://www.', '://');
      variations.add(noWww);
      variations.add(noWww + '/');
    }
    // With www
    if (!parsed.hostname.startsWith('www.')) {
      const withWww = base.replace('://', '://www.');
      variations.add(withWww);
      variations.add(withWww + '/');
    }
  } catch {
    variations.add(url);
  }
  return Array.from(variations);
}

// Find all MDX files
function findMdxFiles(dir, files = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      findMdxFiles(path, files);
    } else if (entry.endsWith('.mdx')) {
      files.push(path);
    }
  }
  return files;
}

// Extract markdown links from content
function extractLinks(content) {
  const links = [];
  // Match [text](url) but not images ![text](url)
  const linkRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const [full, text, url] = match;
    // Skip internal links and anchors
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')) continue;
    links.push({ text, url, full, index: match.index });
  }
  return links;
}

// Main
const mdxFiles = SPECIFIC_FILE
  ? findMdxFiles(CONTENT_PATH).filter(f => f.includes(SPECIFIC_FILE))
  : findMdxFiles(CONTENT_PATH);

let totalLinks = 0;
let matchedLinks = 0;
let unmatchedLinks = 0;
const unmatchedUrls = new Map(); // URL → count

const results = [];

for (const file of mdxFiles) {
  const content = readFileSync(file, 'utf-8');
  const links = extractLinks(content);

  if (links.length === 0) continue;

  const fileResult = {
    file: file.replace(CONTENT_PATH + '/', ''),
    matches: [],
    unmatched: [],
  };

  for (const link of links) {
    totalLinks++;
    const resource = urlToResource.get(link.url) || urlToResource.get(link.url.replace(/\/$/, ''));

    if (resource) {
      matchedLinks++;
      fileResult.matches.push({
        text: link.text,
        url: link.url,
        resourceId: resource.id,
        resourceTitle: resource.title,
      });
    } else {
      unmatchedLinks++;
      fileResult.unmatched.push({
        text: link.text,
        url: link.url,
      });
      unmatchedUrls.set(link.url, (unmatchedUrls.get(link.url) || 0) + 1);
    }
  }

  if (fileResult.matches.length > 0 || fileResult.unmatched.length > 0) {
    results.push(fileResult);
  }
}

// Output
console.log('📊 URL to Resource Mapping\n');
console.log(`Total external links found: ${totalLinks}`);
console.log(`  ✓ Matched to resources: ${matchedLinks} (${(matchedLinks/totalLinks*100).toFixed(1)}%)`);
console.log(`  ✗ No match: ${unmatchedLinks} (${(unmatchedLinks/totalLinks*100).toFixed(1)}%)`);
console.log();

if (STATS_ONLY) {
  console.log('Top unmatched URLs:');
  const sorted = [...unmatchedUrls.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  for (const [url, count] of sorted) {
    console.log(`  ${count}x ${url}`);
  }
  process.exit(0);
}

// Detailed output per file
for (const result of results) {
  if (result.matches.length === 0) continue;

  console.log(`\n📄 ${result.file}`);
  console.log(`   ${result.matches.length} convertible, ${result.unmatched.length} unmatched\n`);

  for (const m of result.matches) {
    console.log(`   ✓ [${m.text}](${m.url})`);
    console.log(`     → <R id="${m.resourceId}">${m.text}</R>`);
  }

  if (result.unmatched.length > 0 && result.unmatched.length <= 5) {
    console.log();
    for (const u of result.unmatched) {
      console.log(`   ✗ [${u.text}](${u.url}) - no resource match`);
    }
  }
}

console.log('\n---');
console.log('To convert a file, replace markdown links with <R> components.');
console.log('Add: import {R} from \'../../../../components/wiki\';');
