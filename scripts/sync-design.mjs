/**
 * Pull the designer's latest HTML, CSS, JS and images into `html_files/`.
 *
 *   npm run sync:design              # sync everything we know about
 *   npm run sync:design -- --dry     # report what changed, write nothing
 *   npm run sync:design -- about.html   # add a page we do not have yet
 *
 * The designer's staging host is behind HTTP basic auth. Put the credentials
 * in `.env.local` (gitignored) — see `.env.example`:
 *
 *   DESIGN_BASE_URL=https://…/   (trailing slash)
 *   DESIGN_HTTP_USER=…
 *   DESIGN_HTTP_PASSWORD=…
 *
 * Nothing is printed that could leak them, and they are never passed on a
 * command line where they would land in shell history or a process list.
 *
 * `html_files/` mirrors the remote layout exactly, so a local path is also its
 * URL path. By default the script re-fetches every non-vendor file it already
 * has AND follows references out of the HTML/CSS it just downloaded, so a new
 * image the designer added shows up without anyone naming it. Unchanged files
 * are left untouched, so `git status` after a run shows exactly what moved.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';

const ROOT = 'html_files';

/** Third-party libraries — ours never diverge, and they are large. */
const VENDOR = /(^|\/)(jquery|remodal\.min|jquery\.validate|bootstrap|slick|chart\.umd|chart\.min)/i;

/** Stale duplicates designers leave lying around. */
const IGNORED = /- ?Copy\.|^_tmp|\.DS_Store$/i;

/** Fetched when we have nothing yet, so a clean checkout bootstraps itself. */
const SEED = ['main.html'];

/** Minimal .env parser — avoids a dotenv dependency for one script. */
function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

/** Every non-vendor file we already track, as paths relative to ROOT. */
function localFiles(dir = ROOT, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const rel = prefix ? posix.join(prefix, name) : name;
    if (IGNORED.test(name) || VENDOR.test(rel)) continue;
    if (statSync(join(dir, name)).isDirectory()) out.push(...localFiles(join(dir, name), rel));
    else out.push(rel);
  }
  return out;
}

/**
 * Relative asset paths referenced by an HTML or CSS file, resolved against the
 * referrer's own directory so `../images/x.svg` inside a stylesheet lands right.
 */
function references(rel, body) {
  const text = body.toString('utf8');
  const found = new Set();
  const add = (raw) => {
    let ref = raw.trim().replace(/^['"]|['"]$/g, '').split(/[?#]/)[0];
    if (!ref) return;
    // Skip absolute URLs, protocol-relative, root-relative, and data URIs.
    if (/^([a-z]+:)?\/\//i.test(ref) || /^(data|mailto|tel|javascript):/i.test(ref)) return;
    if (ref.startsWith('/')) return;
    const resolved = posix.normalize(posix.join(posix.dirname(rel), ref));
    if (resolved.startsWith('..')) return;
    if (IGNORED.test(resolved) || VENDOR.test(resolved)) return;
    found.add(resolved);
  };

  if (/\.html?$/i.test(rel)) {
    for (const m of text.matchAll(/(?:href|src|srcset|poster|data-src)\s*=\s*["']([^"']+)["']/gi)) {
      // srcset can hold a comma-separated candidate list.
      for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0]);
    }
  }
  for (const m of text.matchAll(/url\(\s*([^)]+?)\s*\)/gi)) add(m[1]);
  return [...found];
}

const sha = (b) => createHash('sha256').update(b).digest('hex').slice(0, 12);

async function main() {
  loadEnv('.env.local');
  loadEnv('.env');

  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const explicit = args.filter((a) => !a.startsWith('--'));

  const base = process.env.DESIGN_BASE_URL;
  const user = process.env.DESIGN_HTTP_USER;
  const password = process.env.DESIGN_HTTP_PASSWORD;

  if (!base || !user || !password) {
    console.error(
      'Missing config. Copy .env.example to .env.local and fill in:\n' +
        '  DESIGN_BASE_URL=https://…/   (trailing slash)\n' +
        '  DESIGN_HTTP_USER=…\n' +
        '  DESIGN_HTTP_PASSWORD=…',
    );
    process.exit(1);
  }

  const auth = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
  const baseUrl = base.endsWith('/') ? base : `${base}/`;

  const known = localFiles();
  const queue = explicit.length ? [...explicit] : [...new Set([...known, ...SEED])];
  const seen = new Set(queue);

  console.log(`${dry ? 'DRY RUN — ' : ''}syncing from ${baseUrl}`);
  console.log(`${known.length} file(s) tracked locally, ${queue.length} queued\n`);

  const changed = [];
  const added = [];
  const missing = [];
  let same = 0;

  // Follow references as they are discovered, so newly added assets come along.
  while (queue.length) {
    const rel = queue.shift();
    const dest = join(ROOT, rel);

    let res;
    try {
      res = await fetch(new URL(rel, baseUrl), { headers: { authorization: auth } });
    } catch (e) {
      console.log(`  ERROR   ${rel}  ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    if (res.status === 401) {
      console.error('\n401 Unauthorized — check DESIGN_HTTP_USER / DESIGN_HTTP_PASSWORD.');
      process.exit(1);
    }
    if (!res.ok) {
      missing.push(rel);
      console.log(`  ${String(res.status).padEnd(7)} ${rel}`);
      continue;
    }

    const body = Buffer.from(await res.arrayBuffer());
    const before = existsSync(dest) ? readFileSync(dest) : null;

    if (before && before.equals(body)) {
      same += 1;
    } else if (before) {
      changed.push(rel);
      console.log(`  CHANGED ${rel}  ${sha(before)} -> ${sha(body)}  (${before.length} -> ${body.length} bytes)`); // prettier-ignore
    } else {
      added.push(rel);
      console.log(`  NEW     ${rel}  (${body.length} bytes)`);
    }

    if (!dry && (!before || !before.equals(body))) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, body);
    }

    // Queue anything this file points at that we have not looked at yet.
    if (/\.(html?|css)$/i.test(rel) && !explicit.length) {
      for (const ref of references(rel, body)) {
        if (!seen.has(ref)) {
          seen.add(ref);
          queue.push(ref);
        }
      }
    }
  }

  console.log(
    `\n${changed.length} changed, ${added.length} new, ${same} unchanged` +
      (missing.length ? `, ${missing.length} not found` : ''),
  );
  if (missing.length) {
    console.log(`Not found: ${missing.join(', ')}`);
  }
  if (!dry && (changed.length || added.length)) {
    console.log('Review with `git diff html_files/` before relying on it.');
  }
  if (dry && (changed.length || added.length)) {
    console.log('Dry run — nothing written.');
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
