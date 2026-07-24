import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CONFIG = {
  schemaUrl: 'https://raw.githubusercontent.com/gfargo/coco/main/schema.json',
  retryAttempts: 3,
  retryDelay: 1000, // ms
  timeout: 10000, // ms
};

// Convert URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function logSuccess(message) {
  console.log('\x1b[32m✓\x1b[0m', message);
}

function logError(message) {
  console.error('\x1b[31m❌\x1b[0m', message);
}

function logInfo(message) {
  console.log('\x1b[36mℹ\x1b[0m', message);
}

function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    logInfo(`Created directory: ${directory}`);
  }
}

function validateSchema(data) {
  try {
    const schema = JSON.parse(data);
    if (!schema || typeof schema !== 'object') {
      throw new Error('Invalid schema format');
    }
    return true;
  } catch (error) {
    throw new Error(`Schema validation failed: ${error.message}`);
  }
}

async function downloadSchema(url, outputPath, attempt = 1) {
  logInfo(`Downloading schema from: ${url}`);
  
  return /** @type {Promise<void>} */(new Promise((resolve, reject) => {
    const tempPath = `${outputPath}.temp`;
    const fileStream = fs.createWriteStream(tempPath);
    let data = '';

    const request = https.get(url, { timeout: CONFIG.timeout }, (response) => {
      const { statusCode, headers } = response;

      if (statusCode !== 200) {
        fileStream.close();
        fs.unlinkSync(tempPath);
        
        if (statusCode === 404) {
          reject(new Error('Schema not found (404)'));
        } else if (statusCode >= 500 && attempt < CONFIG.retryAttempts) {
          logInfo(`Received ${statusCode}, retrying (${attempt}/${CONFIG.retryAttempts})...`);
          setTimeout(() => {
            downloadSchema(url, outputPath, attempt + 1)
              .then(resolve)
              .catch(reject);
          }, CONFIG.retryDelay);
          return;
        } else {
          reject(new Error(`HTTP Error: ${statusCode}`));
        }
        return;
      }

      logInfo(`Content length: ${headers['content-length'] || 'unknown'} bytes`);

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        
        try {
          validateSchema(data);
          fs.renameSync(tempPath, outputPath);
          logSuccess(`Schema downloaded successfully to: ${outputPath}`);
          resolve();
        } catch (error) {
          fs.unlinkSync(tempPath);
          reject(error);
        }
      });
    });

    request.on('timeout', () => {
      request.destroy();
      fileStream.close();
      fs.unlinkSync(tempPath);
      
      if (attempt < CONFIG.retryAttempts) {
        logInfo(`Request timed out, retrying (${attempt}/${CONFIG.retryAttempts})...`);
        setTimeout(() => {
          downloadSchema(url, outputPath, attempt + 1)
            .then(resolve)
            .catch(reject);
        }, CONFIG.retryDelay);
      } else {
        reject(new Error('Request timed out'));
      }
    });

    request.on('error', (error) => {
      fileStream.close();
      fs.unlinkSync(tempPath);
      
      if (attempt < CONFIG.retryAttempts) {
        logInfo(`Network error, retrying (${attempt}/${CONFIG.retryAttempts})...`);
        setTimeout(() => {
          downloadSchema(url, outputPath, attempt + 1)
            .then(resolve)
            .catch(reject);
        }, CONFIG.retryDelay);
      } else {
        reject(error);
      }
    });

    fileStream.on('error', (error) => {
      fileStream.close();
      fs.unlinkSync(tempPath);
      reject(new Error(`File write error: ${error.message}`));
    });
  }));
}

/**
 * Derives a URL-safe kebab-case slug from a wiki filename.
 *
 * Duplicated from src/lib/wiki/slug-utils.ts because prebuild.mjs
 * is plain Node ESM and cannot import TypeScript directly.
 *
 * Steps: strip .md → lowercase → replace non-alphanumeric with hyphens →
 *        collapse consecutive hyphens → trim leading/trailing hyphens
 */
function deriveSlugFromFilename(filename) {
  return filename
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Derives a human-readable title from a wiki filename.
 *
 * Strips the .md extension, splits on hyphens, and joins with spaces.
 * Preserves the original casing from the filename.
 *
 * Example: "Interactive-Log-TUI.md" → "Interactive Log TUI"
 */
function deriveTitleFromFilename(filename) {
  return filename.replace(/\.md$/i, '').split('-').join(' ')
}

/**
 * Scans the .wiki/ directory for markdown files and writes
 * src/lib/wiki/discovered-pages.ts with auto-discovered WikiPage entries.
 *
 * - Missing .wiki/ directory: logs warning, skips (build continues)
 * - Malformed filenames (no .md, empty name): skipped with warnings
 * - Output is sorted alphabetically by slug for deterministic builds
 */
async function discoverWikiPages() {
  console.log('\n\x1b[1m📖 Wiki Auto-Discovery\x1b[0m\n');

  let wikiDir = path.resolve(__dirname, '..', '.wiki');
  const outputPath = path.join(__dirname, 'src', 'lib', 'wiki', 'discovered-pages.ts');

  // Local development uses the sibling wiki checkout. Isolated build
  // environments (for example Vercel) clone the public wiki so route
  // discovery never depends on an untracked directory being present.
  if (process.env.VERCEL === '1' || !fs.existsSync(wikiDir)) {
    const tempBase = process.env.RUNNER_TEMP || process.env.TMPDIR || process.env.TEMP || '/tmp';
    const temporaryWikiRoot = fs.mkdtempSync(path.join(tempBase, 'coco-wiki-'));
    wikiDir = path.join(temporaryWikiRoot, 'wiki');
    process.once('exit', () => {
      fs.rmSync(temporaryWikiRoot, { recursive: true, force: true });
    });

    logInfo('No local .wiki/ checkout found — cloning the public wiki for discovery');
    try {
      const { execFileSync } = await import('node:child_process');
      execFileSync(
        'git',
        ['clone', '--depth', '1', '--quiet', 'https://github.com/gfargo/coco.wiki.git', wikiDir],
        { stdio: 'pipe', timeout: 30000 },
      );
    } catch (error) {
      throw new Error(`Failed to clone the public wiki: ${error.message}`);
    }
  }

  // Read all files in .wiki/
  let files;
  try {
    files = fs.readdirSync(wikiDir);
  } catch (err) {
    logError(`Failed to read .wiki/ directory: ${err.message}`);
    return;
  }

  const pages = [];

  for (const file of files) {
    // Skip non-.md files
    if (!file.endsWith('.md')) {
      continue;
    }

    // Skip files that are just ".md" with no name
    const nameWithoutExt = file.replace(/\.md$/i, '');
    if (!nameWithoutExt || nameWithoutExt.trim() === '') {
      logInfo(`Skipping malformed wiki file: "${file}" (empty name)`);
      continue;
    }

    const slug = deriveSlugFromFilename(file);

    // Skip if slug derivation produced an empty string
    if (!slug) {
      logInfo(`Skipping wiki file: "${file}" (could not derive slug)`);
      continue;
    }

    const title = deriveTitleFromFilename(file);
    const wikiPath = nameWithoutExt;

    pages.push({ slug, title, wikiPath });
  }

  // Sort alphabetically by slug for deterministic output
  pages.sort((a, b) => a.slug.localeCompare(b.slug));

  // Generate the TypeScript file content
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const entries = pages
    .map(
      (p) =>
        `  {\n    slug: '${esc(p.slug)}',\n    title: '${esc(p.title)}',\n    wikiPath: '${esc(p.wikiPath)}',\n    category: 'Uncategorized',\n    order: 100,\n    isAutoDiscovered: true,\n  }`,
    )
    .join(',\n');

  const content = [
    '// This file is auto-generated by prebuild.mjs — do not edit manually.',
    '',
    "import { type WikiPage } from './wiki-manifest'",
    '',
    'export const discoveredPages: WikiPage[] = [',
    entries,
    ']',
    '',
  ].join('\n');

  ensureDirectoryExists(outputPath);
  fs.writeFileSync(outputPath, content);

  logSuccess(`Discovered ${pages.length} wiki pages → ${path.relative(__dirname, outputPath)}`);
}

/**
 * Extracts the summary from a release notes markdown body.
 *
 * Looks for the first paragraph under `## What's Changed`, or falls back
 * to the first non-heading paragraph in the body.
 */
function extractSummary(body) {
  const match = body.match(/(?:^|\n)## What's Changed[ \t]*\n([\s\S]*?)(?=\n## [^#]|$)/)
  if (match) return match[1].trim().split('\n\n')[0].trim()
  // Fallback: first paragraph that isn't a heading
  const lines = body.split('\n')
  const para = []
  for (const line of lines) {
    if (line.startsWith('#')) continue
    if (line.trim() === '' && para.length > 0) break
    if (line.trim() !== '') para.push(line.trim())
  }
  return para.join(' ').slice(0, 200)
}

/**
 * Extracts highlight headings from a release notes markdown body.
 *
 * Collects all `### ` headings that appear between `## Highlights`
 * and the next `## ` heading.
 */
function extractHighlights(body) {
  const match = body.match(/(?:^|\n)## Highlights[ \t]*\n([\s\S]*?)(?=\n## [^#]|$)/)
  if (!match) return []
  const section = match[1]
  const headings = []
  for (const line of section.split('\n')) {
    const h3 = line.match(/^### (.+)/)
    if (h3) headings.push(h3[1].trim())
  }
  return headings
}

/**
 * Detects whether a release notes body contains actual breaking changes.
 */
function hasBreakingChanges(body) {
  const match = body.match(/(?:^|\n)## Breaking Changes[ \t]*\n([\s\S]*?)(?=\n## [^#]|\n\*\*Full Changelog\*\*|$)/)
  if (!match) return false
  const section = match[1].trim()
  if (!section) return false
  if (/^none(\s+known)?\.?$/i.test(section)) return false
  return true
}

/**
 * Fetches releases from the GitHub Releases API and writes public/changelog.json.
 *
 * Pulls the most recent releases (up to 20) from the gfargo/coco repo.
 * No authentication required for public repos (rate limit: 60 req/hr).
 *
 * - Network failure: logs warning, writes empty array (build continues)
 * - No releases found: writes empty array
 */
async function generateChangelog() {
  console.log('\n\x1b[1m📋 Changelog Generation\x1b[0m\n')

  const outputPath = path.join(__dirname, 'public', 'changelog.json')
  const apiUrl = 'https://api.github.com/repos/gfargo/coco/releases?per_page=20'

  ensureDirectoryExists(outputPath)

  let releases
  try {
    releases = await fetchJson(apiUrl)
  } catch (err) {
    logInfo(`Could not fetch GitHub releases: ${err.message}`)
    logInfo('Writing empty changelog.json — build continues')
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2) + '\n')
    return
  }

  if (!Array.isArray(releases) || releases.length === 0) {
    logInfo('No releases found on GitHub — writing empty changelog.json')
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2) + '\n')
    return
  }

  const entries = releases
    .filter((r) => !r.draft)
    .map((r) => {
      const body = r.body || ''
      const version = (r.tag_name || '').replace(/^v/, '')
      const date = r.published_at ? r.published_at.split('T')[0] : ''
      const highlights = extractHighlights(body)
      const summary = extractSummary(body)
      const breakingChanges = hasBreakingChanges(body)
      const githubUrl = r.html_url || `https://github.com/gfargo/coco/releases/tag/${r.tag_name}`

      return { version, date, highlights, summary, body, githubUrl, breakingChanges }
    })
    .filter((e) => e.version) // skip entries where version couldn't be parsed

  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2) + '\n')

  logSuccess(`Generated changelog with ${entries.length} entries → ${path.relative(__dirname, outputPath)}`)
}

/**
 * Fetches JSON from a URL using the built-in https module.
 * Returns the parsed JSON response.
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'git-coco-www-prebuild',
        'Accept': 'application/vnd.github+json',
      },
      timeout: CONFIG.timeout,
    }

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`GitHub API returned ${res.statusCode}`))
        res.resume()
        return
      }

      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`))
        }
      })
    }).on('error', reject)
  })
}

async function main() {
  const outputPath = path.join(__dirname, 'public', 'schema.json');
  
  try {
    // Step 1: Wiki auto-discovery (local operation, fast)
    await discoverWikiPages();

    // Step 2: Changelog generation (local operation, fast)
    await generateChangelog();

    // Step 3: Download schema (network operation)
    console.log('\n\x1b[1m📥 Schema Downloader\x1b[0m\n');
    
    ensureDirectoryExists(outputPath);
    
    await downloadSchema(CONFIG.schemaUrl, outputPath);
    
    console.log('\n\x1b[32m✨ Prebuild completed successfully!\x1b[0m\n');
  } catch (error) {
    logError(`Failed during prebuild: ${error.message}`);
    if (error.stack) {
      console.error('\x1b[90m' + error.stack.split('\n').slice(1).join('\n') + '\x1b[0m');
    }
    process.exit(1);
  }
}

// Execute the script
main().catch((error) => {
  logError('Unexpected error:', error);
  process.exit(1);
});