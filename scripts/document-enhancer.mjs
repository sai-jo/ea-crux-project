#!/usr/bin/env node
import 'dotenv/config';

/**
 * Document Enhancer CLI
 *
 * Automated tool for managing and improving wiki content quality.
 *
 * Commands:
 *   list      List pages sorted by various criteria
 *   show      Show details about a specific page
 *   grade     Grade pages using Claude API (importance + llmSummary)
 *   enhance   Enhance low-quality pages using Claude API
 *
 * Examples:
 *   node scripts/document-enhancer.mjs list --sort gap --limit 10
 *   node scripts/document-enhancer.mjs show scheming
 *   node scripts/document-enhancer.mjs grade --limit 5 --dry-run
 *   node scripts/document-enhancer.mjs enhance --limit 3
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const CONTENT_DIR = 'src/content/docs';
const PAGES_FILE = 'src/data/pages.json';
const TEMP_DIR = '.claude/temp';

// ============ Utilities ============

function loadPages() {
  return JSON.parse(readFileSync(PAGES_FILE, 'utf-8'));
}

function getFilePath(page) {
  const urlPath = page.path.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    join(CONTENT_DIR, urlPath + '.mdx'),
    join(CONTENT_DIR, urlPath + '.md'),
    join(CONTENT_DIR, urlPath, 'index.mdx'),
    join(CONTENT_DIR, urlPath, 'index.md'),
  ];
  return candidates.find(p => existsSync(p)) || null;
}

function parseArgs(args) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        opts[key] = isNaN(next) ? next : parseFloat(next);
        i++;
      } else {
        opts[key] = true;
      }
    } else if (!opts._cmd) {
      opts._cmd = args[i];
    } else {
      opts._args = opts._args || [];
      opts._args.push(args[i]);
    }
  }
  return opts;
}

// ============ List Command ============

function cmdList(opts) {
  const pages = loadPages();

  let filtered = pages.filter(p => p.quality !== null);

  // Filters
  if (opts['min-imp']) filtered = filtered.filter(p => p.importance >= opts['min-imp']);
  if (opts['max-qual']) filtered = filtered.filter(p => p.quality <= opts['max-qual']);
  if (opts.category) filtered = filtered.filter(p => p.category === opts.category);

  // Sort
  const sortKey = opts.sort || 'importance';
  filtered.sort((a, b) => {
    if (sortKey === 'gap') {
      return (b.importance - b.quality * 20) - (a.importance - a.quality * 20);
    }
    if (sortKey === 'quality') return (a.quality || 0) - (b.quality || 0);
    return (b[sortKey] || 0) - (a[sortKey] || 0);
  });

  // Limit
  const limit = opts.limit || 20;
  filtered = filtered.slice(0, limit);

  // Output
  console.log(`\n  ${'Imp'.padEnd(5)} ${'Qual'.padEnd(5)} ${'Gap'.padEnd(5)} Title`);
  console.log(`  ${'-'.repeat(50)}`);
  filtered.forEach(p => {
    const gap = Math.round(p.importance - p.quality * 20);
    console.log(`  ${String(Math.round(p.importance)).padEnd(5)} ${String(p.quality).padEnd(5)} ${String(gap).padEnd(5)} ${p.title}`);
  });
  console.log(`\n  Showing ${filtered.length} pages (--limit to change)\n`);
}

// ============ Show Command ============

function cmdShow(opts) {
  const pageId = opts._args?.[0];
  if (!pageId) {
    console.error('Usage: document-enhancer.mjs show <page-id>');
    process.exit(1);
  }

  const pages = loadPages();
  const page = pages.find(p => p.path.includes(pageId));

  if (!page) {
    console.error(`Page not found: ${pageId}`);
    process.exit(1);
  }

  const filePath = getFilePath(page);

  console.log(`\n  Title:      ${page.title}`);
  console.log(`  Path:       ${page.path}`);
  console.log(`  File:       ${filePath || 'NOT FOUND'}`);
  console.log(`  Category:   ${page.category}`);
  console.log(`  Importance: ${page.importance}`);
  console.log(`  Quality:    ${page.quality}`);
  console.log(`  Gap:        ${Math.round(page.importance - page.quality * 20)}`);
  console.log(`  Updated:    ${page.lastUpdated || '—'}`);

  if (filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    console.log(`  Lines:      ${lines}`);
  }
  console.log();
}

// ============ Grade Command ============

const GRADE_SYSTEM = `You are an expert evaluator of AI safety content for expert AI prioritization work.

Score each page on importance (0-100, one decimal). Use the full range discriminatingly.

**Scoring:**
90-100: Essential for prioritization. Core interventions, key risk mechanisms.
70-89: High value. Concrete responses, major risks, critical capabilities.
50-69: Useful context. Supporting analysis, secondary topics.
30-49: Reference material. Historical, profiles, niche topics.
0-29: Peripheral. Internal docs, stubs.

**Category adjustments:**
- Responses/interventions: +10
- Capabilities: +5
- Core risks: +5
- Models/analysis: -5
- Arguments/debates: -10
- People/organizations: -15
- Internal: -30

Provide:
- importance: 0-100 (one decimal)
- quality: 1-5
- llmSummary: 1-2 sentences with methodology AND conclusions

Respond with JSON only.`;

async function cmdGrade(opts) {
  if (!process.env.ANTHROPIC_API_KEY && !opts['dry-run']) {
    console.error('Error: ANTHROPIC_API_KEY required');
    process.exit(1);
  }

  const pages = loadPages();
  let toGrade = pages.filter(p => !opts['skip-graded'] || p.importance === null);

  if (opts.category) toGrade = toGrade.filter(p => p.category === opts.category);
  if (opts.limit) toGrade = toGrade.slice(0, opts.limit);

  console.log(`\nGrading ${toGrade.length} pages...`);

  if (opts['dry-run']) {
    toGrade.slice(0, 10).forEach(p => console.log(`  - ${p.title}`));
    if (toGrade.length > 10) console.log(`  ... and ${toGrade.length - 10} more`);
    console.log('\nDry run - no API calls made.\n');
    return;
  }

  const client = new Anthropic();
  const results = [];

  for (let i = 0; i < toGrade.length; i++) {
    const page = toGrade[i];
    const filePath = getFilePath(page);
    if (!filePath) continue;

    process.stdout.write(`[${i + 1}/${toGrade.length}] ${page.title}... `);

    try {
      const content = readFileSync(filePath, 'utf-8');
      const truncated = content.replace(/^---[\s\S]*?---\n*/, '').split(/\s+/).slice(0, 1000).join(' ');

      const response = await client.messages.create({
        model: opts.model || 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: GRADE_SYSTEM,
        messages: [{
          role: 'user',
          content: `Grade this page:\n\nTitle: ${page.title}\nCategory: ${page.category}\n\n${truncated}`
        }]
      });

      const grades = JSON.parse(response.content[0].text);
      results.push({ ...page, grades });
      console.log(`imp=${grades.importance}, qual=${grades.quality}`);

      if (opts.apply) {
        applyGrades(filePath, grades);
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // Save results
  const outputFile = join(TEMP_DIR, 'grades.json');
  mkdirSync(TEMP_DIR, { recursive: true });
  writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${outputFile}`);
}

function applyGrades(filePath, grades) {
  let content = readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;

  const fm = parseYaml(fmMatch[1]) || {};
  fm.importance = grades.importance;
  if (grades.quality) fm.quality = grades.quality;
  if (grades.llmSummary) fm.llmSummary = grades.llmSummary;

  const newFm = stringifyYaml(fm);
  const bodyStart = content.indexOf('---', 4) + 4;
  content = `---\n${newFm}---${content.slice(bodyStart)}`;

  // Fix date quoting
  content = content.replace(/^lastEdited: (\d{4}-\d{2}-\d{2})$/gm, 'lastEdited: "$1"');

  writeFileSync(filePath, content);
}

// ============ Enhance Command ============

const ENHANCE_SYSTEM = `You are an expert technical writer improving AI safety wiki content.

Enhance this page to quality 4-5:

1. **Comprehensive Overview** (2-3 paragraphs): What is this, why it matters, key takeaways
2. **Substantive Sections**: Detailed prose paragraphs, not just bullets
3. **Evidence & Examples**: Specific research, dates, numbers
4. **Safety Implications**: Concerning and promising aspects
5. **Trajectory**: Current state, 1-2 years, 2-5 years
6. **Key Uncertainties**: What we don't know

Guidelines:
- Professional prose, not just bullet lists
- Specific evidence and examples
- Neutral, analytical tone
- Target: 150-250 lines
- Update description to include conclusions
- Preserve DataInfoBox/Backlinks components

Return ONLY the complete MDX file starting with --- frontmatter.`;

async function cmdEnhance(opts) {
  if (!process.env.ANTHROPIC_API_KEY && !opts['dry-run']) {
    console.error('Error: ANTHROPIC_API_KEY required');
    process.exit(1);
  }

  const pages = loadPages();

  // Filter candidates
  let candidates = pages.filter(p =>
    p.importance >= (opts['min-imp'] || 85) &&
    p.quality <= (opts['max-qual'] || 3) &&
    p.quality !== null
  );

  // Sort by gap
  candidates.sort((a, b) => (b.importance - b.quality * 20) - (a.importance - a.quality * 20));

  // Filter by specific page
  if (opts.page) {
    candidates = candidates.filter(p => p.path.includes(opts.page));
  }

  if (opts.limit) candidates = candidates.slice(0, opts.limit);

  console.log(`\nEnhancing ${candidates.length} pages...`);
  candidates.forEach((p, i) => {
    const gap = Math.round(p.importance - p.quality * 20);
    console.log(`  ${i + 1}. ${p.title} (imp=${p.importance}, qual=${p.quality}, gap=${gap})`);
  });

  if (opts['dry-run']) {
    console.log('\nDry run - no API calls made.\n');
    return;
  }

  const client = new Anthropic();
  const outputDir = join(TEMP_DIR, 'enhanced');
  mkdirSync(outputDir, { recursive: true });

  const concurrency = opts.parallel || 1;
  console.log(`\nProcessing with concurrency: ${concurrency}`);

  // Helper to process a single page
  async function processPage(page, index) {
    const filePath = getFilePath(page);
    if (!filePath) {
      console.log(`✗ ${page.title}: file not found`);
      return { success: false, page };
    }

    console.log(`[${index + 1}/${candidates.length}] ${page.title}...`);

    try {
      const content = readFileSync(filePath, 'utf-8');

      const response = await client.messages.create({
        model: opts.model || 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: ENHANCE_SYSTEM,
        messages: [{
          role: 'user',
          content: `Enhance this page from quality ${page.quality} to 4-5:\n\n${content}`
        }]
      });

      const enhanced = response.content[0].text;

      if (opts.apply) {
        writeFileSync(filePath, enhanced);
        console.log(`  ✓ ${page.title} → applied`);
      } else {
        const outPath = join(outputDir, basename(filePath));
        writeFileSync(outPath, enhanced);
        console.log(`  ✓ ${page.title} → saved`);
      }
      return { success: true, page };
    } catch (e) {
      console.log(`  ✗ ${page.title}: ${e.message}`);
      return { success: false, page, error: e.message };
    }
  }

  // Process in batches
  const results = [];
  for (let i = 0; i < candidates.length; i += concurrency) {
    const batch = candidates.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((page, j) => processPage(page, i + j))
    );
    results.push(...batchResults);
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`\nCompleted: ${succeeded} succeeded, ${failed} failed`);

  if (!opts.apply) {
    console.log(`Review enhanced pages in ${outputDir}/`);
    console.log('Run with --apply to apply directly.\n');
  }
}

// ============ Main ============

const opts = parseArgs(process.argv.slice(2));

const commands = {
  list: cmdList,
  show: cmdShow,
  grade: cmdGrade,
  enhance: cmdEnhance,
};

if (!opts._cmd || !commands[opts._cmd]) {
  console.log(`
Document Enhancer CLI

Commands:
  list      List pages by importance/quality/gap
  show      Show details about a page
  grade     Grade pages (importance + summary)
  enhance   Improve low-quality pages

Examples:
  node scripts/document-enhancer.mjs list --sort gap --limit 10
  node scripts/document-enhancer.mjs show scheming
  node scripts/document-enhancer.mjs grade --limit 5 --dry-run
  node scripts/document-enhancer.mjs enhance --page language-models --dry-run

Options:
  --dry-run     Preview without API calls
  --limit N     Process only N pages
  --apply       Apply changes directly
  --model X     Use specific Claude model
  --min-imp N   Minimum importance (enhance)
  --max-qual N  Maximum quality (enhance)
  --page ID     Target specific page
`);
  process.exit(0);
}

commands[opts._cmd](opts);
