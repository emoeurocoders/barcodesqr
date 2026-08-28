/**
 * Turn the designer's `terms.html` into the data the /terms page renders.
 *
 *   node scripts/extract-terms.mjs
 *
 * WHY THIS EXISTS
 * ---------------
 * The page is thirty-one sections of legal copy. The fidelity contract says
 * to paste the designer's strings and never retype them, and at this length
 * "paste" means "have a machine do it" — a hand-transcribed clause that drops
 * a "not" is both invisible in review and legally different.
 *
 * Re-run it after any design sync that touches terms.html; the output is
 * committed so the page itself needs no build step.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('html_files/terms.html', 'utf8');

const between = (open, close, from = 0) => {
  const i = html.indexOf(open, from);
  if (i === -1) return '';
  return html.slice(i, html.indexOf(close, i));
};

/** Entities the designer's file actually uses, plus whitespace collapsing. */
const decode = (s) =>
  s
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');

/** Anything the map above misses would ship as a literal "&copy;". */
const assertDecoded = (s) => {
  const stray = s.match(/&[a-zA-Z]+;/);
  if (stray) throw new Error(`extract-terms: unhandled entity ${stray[0]} — add it to decode()`);
  return s;
};

const text = (fragment) => assertDecoded(decode(fragment.replace(/<[^>]+>/g, '')).trim());
const pick = (source, re) => {
  const m = source.match(re);
  return m ? text(m[1]) : '';
};

/**
 * Split a fragment into runs of plain text, <strong> and <a href>.
 *
 * The space either side of an inline tag is content: trimming each run
 * individually is what welds "Important:" onto the sentence that follows it.
 * So only the run's own text is trimmed, never the gaps around it.
 */
function inline(fragment) {
  const out = [];
  const re = /<strong>(.*?)<\/strong>|<a href="([^"]*)"[^>]*>(.*?)<\/a>|<br\s*\/?>/gis;
  let last = 0;
  let m;

  // A whitespace-only chunk still matters: it is the space between
  // "<strong>General Support:</strong>" and the address that follows.
  const plain = (chunk) => {
    const t = assertDecoded(decode(chunk.replace(/<[^>]+>/g, '')));
    if (t) out.push({ t });
  };

  while ((m = re.exec(fragment))) {
    plain(fragment.slice(last, m.index));
    if (m[1] !== undefined) out.push({ t: text(m[1]), strong: true });
    else if (m[2] !== undefined) out.push({ t: text(m[3]), href: m[2] });
    else out.push({ br: true });
    last = m.index + m[0].length;
  }
  plain(fragment.slice(last));

  // Tidy only the outer edges, so the sentence reads as it does on the page.
  if (out.length && out[0].t) out[0].t = out[0].t.replace(/^\s+/, '');
  const tail = out[out.length - 1];
  if (tail?.t) tail.t = tail.t.replace(/\s+$/, '');
  return out.filter((r) => r.br || r.t !== '');
}

// --- hero -----------------------------------------------------------------
const hero = between('<section id="mainTermsHero">', '</section>');
const heroData = {
  cap: pick(hero, /<p class="cap">(.*?)<\/p>/s),
  title: pick(hero, /<h2 class="ln1">(.*?)<\/h2>/s),
  lead: pick(hero, /<p class="ln2">(.*?)<\/p>/s),
  updated: pick(hero, /<p class="upd">([\s\S]*?)<\/p>/),
};

// --- sidebar --------------------------------------------------------------
const toc = [
  ...between('<aside class="toc">', '</aside>').matchAll(/<a href="#([^"]+)">([^<]*)<\/a>/g),
].map(([, id, label]) => ({ id, label: text(label) }));

const ask = between('<div class="ask">', '<!--end ask-->');
const askData = {
  title: pick(ask, /<h5 class="ln3">(.*?)<\/h5>/s),
  desc: pick(ask, /<p class="ln4">(.*?)<\/p>/s),
  email: pick(ask, /<a href="mailto:[^"]*">(.*?)<\/a>/s),
};

// --- content --------------------------------------------------------------
const cont = between('<article class="cont">', '</article>');
const intro = [...between('<div class="intro">', '<!--end intro-->').matchAll(/<p>(.*?)<\/p>/gis)].map(
  ([, p]) => inline(p),
);

/** Ordered blocks within one <section class="sec">. */
function parseSection(sec) {
  const id = (sec.match(/id="([^"]+)"/) || [])[1];
  const heading = pick(sec, /<h2>(.*?)<\/h2>/s);
  const body = sec.slice(sec.indexOf('</h2>') + 5);
  const blocks = [];

  // The page uses two list styles, ticked (`chkLst`) and plain, so both are
  // matched here and which one is recorded.
  const re =
    /<div class="duo">([\s\S]*?)<!--end duo-->|<div class="note">([\s\S]*?)<\/div>|<ul(\s+class="chkLst")?>([\s\S]*?)<\/ul>|<h3>(.*?)<\/h3>|<p>((?:(?!<\/p>)[\s\S])*)<\/p>/gi;

  let m;
  while ((m = re.exec(body))) {
    if (m[1] !== undefined) {
      blocks.push({
        kind: 'cards',
        cards: [...m[1].matchAll(/<div class="card">([\s\S]*?)<!--end card-->/g)].map(([, card]) => ({
          // Normalised to self-closing. The designer writes `<rect ...></rect>`,
          // and matching only the opening tag drops the slash — the joined
          // string then nests every later shape INSIDE the first one, where
          // SVG does not render it. One icon, one visible shape, silently.
          shapes: [...card.matchAll(/<(?:path|rect|circle|line|polyline)\b[^>]*?\/?>/g)].map((x) =>
            x[0].replace(/\s*\/?>$/, ' />'),
          ),
          title: pick(card, /<h3>(.*?)<\/h3>/s),
          paras: [...card.matchAll(/<p>(.*?)<\/p>/gis)].map(([, p]) => inline(p)),
        })),
      });
    } else if (m[2] !== undefined) {
      blocks.push({ kind: 'note', body: inline((m[2].match(/<p>([\s\S]*?)<\/p>/i) || [])[1] || '') });
    } else if (m[4] !== undefined) {
      blocks.push({
        kind: 'list',
        ticked: !!m[3],
        items: [...m[4].matchAll(/<li>([\s\S]*?)<\/li>/gi)].map(([, li]) =>
          inline(li.replace(/<svg[\s\S]*?<\/svg>/g, '')),
        ),
      });
    } else if (m[5] !== undefined) {
      blocks.push({ kind: 'h3', text: text(m[5]) });
    } else if (m[6] !== undefined) {
      blocks.push({ kind: 'p', body: inline(m[6]) });
    }
  }
  return { id, heading, blocks };
}

const sections = [...cont.matchAll(/<section class="sec"[\s\S]*?<\/section>/g)].map(([s]) => parseSection(s));

writeFileSync(
  'src/app/terms/content.ts',
  [
    '// GENERATED from html_files/terms.html by scripts/extract-terms.mjs.',
    '// Do not hand-edit: re-run the script after a design sync so the legal',
    '// copy keeps coming across by machine rather than being retyped.',
    '',
    'export type Run = { t?: string; strong?: boolean; href?: string; br?: boolean };',
    '',
    'export type Block =',
    '  | { kind: "p"; body: Run[] }',
    '  | { kind: "h3"; text: string }',
    '  | { kind: "list"; ticked: boolean; items: Run[][] }',
    '  | { kind: "note"; body: Run[] }',
    '  | {',
    '      kind: "cards";',
    '      cards: { shapes: string[]; title: string; paras: Run[][] }[];',
    '    };',
    '',
    'export type Section = { id: string; heading: string; blocks: Block[] };',
    '',
    `export const hero = ${JSON.stringify(heroData, null, 2)};`,
    '',
    `export const ask = ${JSON.stringify(askData, null, 2)};`,
    '',
    `export const toc: { id: string; label: string }[] = ${JSON.stringify(toc, null, 2)};`,
    '',
    `export const intro: Run[][] = ${JSON.stringify(intro, null, 2)};`,
    '',
    `export const sections: Section[] = ${JSON.stringify(sections, null, 2)};`,
    '',
  ].join('\n'),
);

const blocks = sections.reduce((n, s) => n + s.blocks.length, 0);
console.log(`sections ${sections.length} | toc ${toc.length} | intro ${intro.length} | blocks ${blocks}`);
