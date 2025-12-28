#!/usr/bin/env node
/**
 * Convert markdown links to <R> notation where resources exist
 *
 * Usage:
 *   node scripts/convert-links-to-r.mjs --dry-run     # Preview changes
 *   node scripts/convert-links-to-r.mjs --apply       # Apply changes
 *   node scripts/convert-links-to-r.mjs --file path   # Single file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Parse args
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');
const singleFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
const verbose = args.includes('--verbose');

// Load resources
const resourcesPath = path.join(ROOT, 'src/data/resources.yaml');
const resourcesContent = fs.readFileSync(resourcesPath, 'utf-8');
const resources = yaml.load(resourcesContent);

// Build URL -> resource ID lookup
const urlToResource = new Map();
for (const resource of resources) {
  if (resource.url) {
    // Normalize URL (remove trailing slash, handle http/https)
    const normalizedUrl = normalizeUrl(resource.url);
    urlToResource.set(normalizedUrl, resource);
  }
}

function normalizeUrl(url) {
  return url
    .replace(/^https?:\/\//, '')  // Remove protocol
    .replace(/\/$/, '')            // Remove trailing slash
    .toLowerCase();
}

// Regex for markdown links: [text](url)
const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(ROOT, filePath);

  let modified = content;
  let changes = [];

  // Find all markdown links
  let match;
  const regex = new RegExp(markdownLinkRegex.source, 'g');

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, linkText, url] = match;
    const normalizedUrl = normalizeUrl(url);

    const resource = urlToResource.get(normalizedUrl);
    if (resource) {
      // Create replacement
      const replacement = `<R id="${resource.id}">${linkText}</R>`;

      changes.push({
        original: fullMatch,
        replacement,
        resourceTitle: resource.title,
        url
      });
    }
  }

  // Apply replacements
  for (const change of changes) {
    modified = modified.replace(change.original, change.replacement);
  }

  // Add R import if needed and there are changes
  if (changes.length > 0) {
    // Check if R is already imported
    const hasRImport = /import\s*{[^}]*\bR\b[^}]*}\s*from/.test(modified);
    if (!hasRImport) {
      // Try to add R to existing wiki import
      const wikiImportRegex = /import\s*{([^}]+)}\s*from\s*['"]([^'"]*components\/wiki)['"]/;
      const wikiMatch = modified.match(wikiImportRegex);
      if (wikiMatch) {
        const existingImports = wikiMatch[1];
        const newImports = existingImports.trim() + ', R';
        modified = modified.replace(wikiImportRegex, `import {${newImports}} from '${wikiMatch[2]}'`);
      } else {
        // Add new import after frontmatter closing ---
        const importDepth = getImportDepth(filePath);
        const importStatement = `\n\nimport {R} from '${importDepth}components/wiki';\n\n`;
        // Find the closing --- of frontmatter
        // Frontmatter must start with --- on first line, then yaml content, then --- (possibly followed by content without newline)
        if (modified.startsWith('---')) {
          // Find the second --- that ends frontmatter (must be at start of a line)
          const afterFirstLine = modified.indexOf('\n') + 1;
          // Look for \n--- followed by anything (newline, content, or EOF)
          const closingMatch = modified.slice(afterFirstLine).match(/\n---(?=\n|[^-]|$)/);
          if (closingMatch) {
            const insertPos = afterFirstLine + closingMatch.index + 4; // after the \n---
            modified = modified.slice(0, insertPos) + importStatement + modified.slice(insertPos);
          }
        }
      }
    }
  }

  return { relativePath, changes, modified, original: content };
}

function getImportDepth(filePath) {
  // Calculate relative depth from file to src/
  const fromDir = path.dirname(filePath);
  const srcDir = path.join(ROOT, 'src');
  const relativePath = path.relative(fromDir, srcDir);
  // Convert to Unix-style path
  return relativePath.split(path.sep).join('/') + '/';
}

function getEntityIdFromPath(filePath) {
  // Extract entity ID from file path
  // e.g., .../knowledge-base/models/concentration-of-power.mdx -> concentration-of-power
  const basename = path.basename(filePath, '.mdx');
  return basename === 'index' ? path.basename(path.dirname(filePath)) : basename;
}

async function main() {
  console.log('Converting markdown links to <R> notation...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (use --apply to make changes)' : 'APPLYING CHANGES'}`);
  console.log(`Resources loaded: ${urlToResource.size}\n`);

  // Get files to process
  let files;
  if (singleFile) {
    files = [path.resolve(ROOT, singleFile)];
  } else {
    const output = execSync('find src/content/docs/knowledge-base -name "*.mdx" -type f', {
      cwd: ROOT,
      encoding: 'utf-8'
    });
    files = output.trim().split('\n').filter(Boolean).map(f => path.join(ROOT, f));
  }

  let totalChanges = 0;
  let filesModified = 0;

  for (const filePath of files) {
    const result = processFile(filePath);

    if (result.changes.length > 0) {
      filesModified++;
      totalChanges += result.changes.length;

      console.log(`\n📄 ${result.relativePath}`);
      for (const change of result.changes) {
        if (verbose) {
          console.log(`   - ${change.original}`);
          console.log(`   + ${change.replacement}`);
        } else {
          console.log(`   ${change.resourceTitle || change.url}`);
        }
      }

      if (!dryRun) {
        fs.writeFileSync(filePath, result.modified);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Summary: ${totalChanges} links in ${filesModified} files`);

  if (dryRun && totalChanges > 0) {
    console.log('\nRun with --apply to make these changes.');
  }
}

main().catch(console.error);
