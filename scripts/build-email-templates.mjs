/**
 * Turn the designer's mailer HTML into the token templates the app renders.
 *
 *   npm run emails:build          # rewrite src/emails/templates/*.ts
 *   npm run emails:build -- --check   # fail if they are out of date
 *
 * `html_files/mailers/**` is a read-only mirror of the designer's staging host
 * (see AGENTS.md). Hand-patching a 42 KB email after every `npm run
 * sync:design` is how a port silently stops matching, so the substitutions
 * live here instead: the designer's file stays byte-for-byte theirs, and this
 * script re-applies the same edits to whatever they send next.
 *
 * Every rule below is anchored to a line number AND an exact string. If the
 * designer moves or rewords a line the script fails loudly naming the rule,
 * which is the point — an email that quietly loses its "Trial ends" date is
 * worse than a build that stops.
 *
 * Two token forms, Mustache's:
 *   {{name}}    HTML-escaped at render time — every value from a payment
 *               provider goes through this one.
 *   {{{name}}}  raw, for the handful of spots that carry the designer's own
 *               entities (`&nbsp;`, `&ndash;`) inside a value.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SRC = 'html_files/mailers';
const OUT = 'src/emails/templates';

/** Images every mailer shares; served from `public/emails/` at send time. */
const IMAGES = [
  'width_fix.png',
  'logo.png',
  'logo_dark.png',
  'hero_check.png',
  'ico_info.png',
  'ico_check.png',
];

/**
 * The links the mockup cannot have. `#`, `#LINK_MSO_VML` and
 * `#DONT_FORGET_TO_LINK_MSO_VML` are the designer's placeholders — the last
 * one is literally a note to self — and every one of them is the sanctioned
 * "`href="#"` -> real route" divergence.
 *
 * Order matters: the two MSO placeholders appear twice per file, once for the
 * primary button and once for the secondary, and they must not be swapped.
 */
const LINKS = (primary, secondary) => [
  // Each button is drawn twice — a VML `roundrect` for Outlook and an anchor
  // for everyone else — so both placeholders appear exactly twice, in document
  // order: primary button first, secondary second.
  { find: 'href="#LINK_MSO_VML"', puts: [`href="${primary}"`, `href="${secondary}"`] },
  {
    find: 'href="#DONT_FORGET_TO_LINK_MSO_VML"',
    puts: [`href="${primary}"`, `href="${secondary}"`],
  },
];

/** Footer row + logo, identical in both files. */
const CHROME = [
  // The logo lockup links home; the mockup leaves it as `#`.
  { find: '<a href="#" style="text-decoration: none;" >', put: '<a href="{{homeUrl}}" style="text-decoration: none;" >' },
  { find: '<a href="#" style="text-decoration: underline; color: #2563eb;">Help Center</a>', put: '<a href="{{helpUrl}}" style="text-decoration: underline; color: #2563eb;">Help Center</a>' },
  { find: '<a href="#" style="text-decoration: underline; color: #2563eb;">Terms</a>', put: '<a href="{{termsUrl}}" style="text-decoration: underline; color: #2563eb;">Terms</a>' },
  { find: '<a href="#" style="text-decoration: underline; color: #2563eb;">Privacy</a>', put: '<a href="{{privacyUrl}}" style="text-decoration: underline; color: #2563eb;">Privacy</a>' },
];

const TEMPLATES = [
  {
    name: 'trialStarted',
    src: 'trial/index.html',
    constant: 'TRIAL_STARTED_HTML',
    title: 'Your 7-Day Trial Is Active',
    edits: [
      ...LINKS('{{dashboardUrl}}', '{{manageUrl}}'),
      ...CHROME,
      // --- Transaction Details rows, top to bottom ------------------------
      { line: 364, find: '>7-Day Full Access Trial<', put: '>{{planName}}<' },
      { line: 372, find: '>$1.00 USD<', put: '>{{amountCharged}}<' },
      { line: 380, find: '>Sep 7, 2026<', put: '>{{trialStartedOn}}<' },
      { line: 388, find: '>Sep 14, 2026<', put: '>{{trialEndsOn}}<' },
      { line: 396, find: '>$39.95 USD<', put: '>{{nextChargeAmount}}<' },
      { line: 404, find: '>Every 4 weeks<', put: '>{{billingFrequency}}<' },
      { line: 412, find: '>BARCODESQR.COM<', put: '>{{statementDescriptor}}<' },
      // --- Renewal notice. Their `&nbsp;` holds "4 weeks" on one line. ----
      {
        line: 438,
        find: 'Unless you cancel before <strong style="font-weight: 700;">Sep 14, 2026</strong>, your subscription will automatically continue at <strong style="font-weight: 700;">$39.95 every 4&nbsp;weeks</strong>.',
        put: 'Unless you cancel before <strong style="font-weight: 700;">{{trialEndsOn}}</strong>, your subscription will automatically continue at <strong style="font-weight: 700;">{{renewalAmount}} {{{billingFrequencyLower}}}</strong>.',
      },
    ],
  },
  {
    name: 'paymentReceipt',
    src: 'receipt/index.html',
    constant: 'PAYMENT_RECEIPT_HTML',
    title: 'Payment Received',
    edits: [
      ...LINKS('{{dashboardUrl}}', '{{manageUrl}}'),
      ...CHROME,
      { line: 364, find: '>$39.95 USD<', put: '>{{amountPaid}}<' },
      { line: 372, find: '>BarcodesQR Full Access<', put: '>{{planName}}<' },
      { line: 380, find: '>Sep 14, 2026<', put: '>{{paymentDate}}<' },
      // Raw: the range keeps the designer's `&ndash;`, not a hyphen.
      { line: 388, find: '>Sep 14 &ndash; Oct 11, 2026<', put: '>{{{billingPeriod}}}<' },
      { line: 396, find: '>Oct 12, 2026<', put: '>{{nextRenewalDate}}<' },
      { line: 404, find: '>$39.95 USD<', put: '>{{nextRenewalAmount}}<' },
      { line: 412, find: '>BARCODESQR.COM<', put: '>{{statementDescriptor}}<' },
      {
        line: 438,
        find: 'Your subscription renews automatically <strong style="font-weight: 700;">every 4&nbsp;weeks</strong> at <strong style="font-weight: 700;">$39.95</strong> unless&nbsp;canceled.',
        put: 'Your subscription renews automatically <strong style="font-weight: 700;">{{{billingFrequencyLower}}}</strong> at <strong style="font-weight: 700;">{{renewalAmount}}</strong> unless&nbsp;canceled.',
      },
    ],
  },
];

/**
 * Replace every occurrence of `find` with the matching entry of `puts`, in
 * document order. The counts must agree exactly: a third button appearing, or
 * one disappearing, is a design change to look at rather than to absorb.
 */
function replaceInOrder(html, find, puts, where) {
  const parts = html.split(find);
  if (parts.length - 1 !== puts.length) {
    throw new Error(
      `${where}: expected ${puts.length} occurrence(s) of ${JSON.stringify(find)}, ` +
        `found ${parts.length - 1}. The designer changed this markup — re-read the ` +
        `file and update the rule in scripts/build-email-templates.mjs.`,
    );
  }
  return parts.reduce((acc, part, i) => acc + puts[i - 1] + part);
}

/** Replace on one specific line, so the two identical `$39.95 USD` rows can't swap. */
function replaceOnLine(html, line, find, put, where) {
  const lines = html.split('\n');
  const text = lines[line - 1];
  if (text === undefined || !text.includes(find)) {
    throw new Error(
      `${where}: line ${line} does not contain ${JSON.stringify(find)}.\n` +
        `  got: ${JSON.stringify((text ?? '').trim().slice(0, 160))}\n` +
        `The designer moved or reworded this row — re-read the file and update ` +
        `the rule in scripts/build-email-templates.mjs.`,
    );
  }
  lines[line - 1] = text.replace(find, put);
  return lines.join('\n');
}

function build(tpl) {
  const path = `${SRC}/${tpl.src}`;
  if (!existsSync(path)) {
    throw new Error(`Missing ${path}. Run \`npm run sync:design\` first.`);
  }
  let html = readFileSync(path, 'utf8');

  // A template literal is the only quoting this has to survive, and the
  // designer's HTML contains neither. Assert it rather than trust it.
  for (const hazard of ['`', '${']) {
    if (html.includes(hazard)) {
      throw new Error(
        `${tpl.src} contains ${JSON.stringify(hazard)}, which would break the ` +
          `generated template literal. Escape it here before proceeding.`,
      );
    }
  }

  for (const img of IMAGES) {
    // ico_check.png is trial-only; the shared list is deliberately not per-file.
    html = html.split(`src="${img}"`).join(`src="{{assetBase}}/${img}"`);
  }

  for (const edit of tpl.edits) {
    html = edit.line
      ? replaceOnLine(html, edit.line, edit.find, edit.put, tpl.name)
      : replaceInOrder(html, edit.find, edit.puts ?? [edit.put], tpl.name);
  }

  // Nothing the designer left as a placeholder may survive into a real send.
  for (const leftover of ['#LINK_MSO_VML', '#DONT_FORGET_TO_LINK_MSO_VML', 'href="#"']) {
    if (html.includes(leftover)) {
      throw new Error(`${tpl.name}: ${leftover} still present after substitution.`);
    }
  }

  return `// GENERATED by scripts/build-email-templates.mjs — do not edit.
//
// Ported verbatim from html_files/mailers/${tpl.src}, the read-only mirror of
// the designer's staging host, with only these substitutions applied:
//   - relative <img src> -> {{assetBase}}/…  (email needs absolute URLs)
//   - the mockup's placeholder hrefs -> real routes
//   - the Transaction Details values and the renewal notice -> tokens
//
// Regenerate with \`npm run emails:build\` after \`npm run sync:design\`;
// \`npm run emails:build -- --check\` verifies it is current.

/** <title>${tpl.title}</title> — also the subject line. */
export const ${tpl.constant}_SUBJECT = ${JSON.stringify(tpl.title)};

export const ${tpl.constant} = \`${html}\`;
`;
}

const check = process.argv.includes('--check');
let stale = 0;

for (const tpl of TEMPLATES) {
  const out = `${OUT}/${tpl.name}.html.ts`;
  const next = build(tpl);
  const current = existsSync(out) ? readFileSync(out, 'utf8') : null;

  if (current === next) {
    console.log(`  unchanged  ${out}`);
  } else if (check) {
    console.error(`  STALE      ${out}`);
    stale++;
  } else {
    writeFileSync(out, next);
    console.log(`  ${current === null ? 'created' : 'updated'}    ${out}`);
  }
}

if (stale) {
  console.error(
    `\n${stale} template(s) out of date with html_files/mailers/. ` +
      `Run \`npm run emails:build\` and commit the result.`,
  );
  process.exit(1);
}
