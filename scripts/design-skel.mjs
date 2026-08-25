/**
 * Print the rendered tag + text + attribute skeleton of a subtree, so a port
 * can be DIFFED against the designer's mockup instead of eyeballed.
 *
 *   node scripts/design-skel.mjs html_files/main.html --root 'header' > /tmp/design.txt
 *   node scripts/design-skel.mjs http://localhost:3000/ --root 'header' > /tmp/port.txt
 *   diff -u /tmp/design.txt /tmp/port.txt
 *
 * Or via the package alias: `npm run -s skel -- <source> --root '<selector>'`.
 * (The -s matters: npm's own banner otherwise lands in the redirect and shows
 * up as diff noise.)
 *
 * WHY THIS EXISTS
 * ---------------
 * Screenshots prove layout; they do not prove the content underneath it. The
 * deviations a PM sends back are invisible in a screenshot until you know
 * where to look: a section silently dropped, a reworded placeholder, "…" typed
 * as "...", a substituted icon, an <a> turned into a <button>. A diff catches
 * all of them in one command, before the PM does.
 *
 * BARCODESQR-SPECIFIC: this port TRANSLATES the mockup to Tailwind rather than
 * copying its CSS, so class names legitimately differ on every node — they are
 * omitted by default (pass --classes to include them, e.g. when diffing two
 * mockup versions against each other). What must still match, and what this
 * prints, is everything else: the element structure, every string, every
 * placeholder, every href, every icon's path data.
 *
 * WHAT A LINE MEANS
 * -----------------
 *   div
 *     h2  "Create your QR code"
 *     a  @href=/create
 *       svg  @viewBox=0 0 24 24
 *         path  @d=M21 11.5a8.38 8.38 0 0
 *
 * Text is the element's OWN text, trimmed and collapsed — enough to catch
 * reworded copy without every ancestor of a change also lighting up. `@d` is
 * truncated to 24 characters, plenty to tell two icons apart. Inputs carry
 * `@placeholder`, links `@href`, images `@src`. Any element carrying an
 * `@aria-label` prints it — it is copy a screen reader reads aloud.
 *
 * Both sides render in a real headless Chrome, so this compares what the
 * browser built — after React — not what the source file says.
 *
 * `--styles` appends the computed properties that matter to a translated port:
 * rendered box size, font, padding, border, background, colour, text-align.
 * With classes out of the picture, THIS is how you prove the Tailwind
 * translation reproduces the designer's numbers instead of approximating them.
 * (Box sizes legitimately differ where live data is longer than the mockup's
 * sample; read those, do not chase them.)
 *
 * `--width` emulates a true viewport via CDP — unlike `--window-size`, which
 * headless Chrome silently floors at a 500px viewport, so narrow-width media
 * queries actually fire here.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import WebSocket from 'ws';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * The click-target finder, stringified into the page.
 *
 * `--click` matches loosely, which is enough to open a disclosure but picks
 * the wrong row when one label contains another ("Text" inside "Plain Text").
 * `--click-exact` matches a LEAF whose own text is exactly the needle and
 * clicks its nearest clickable ancestor, which is how a list of similarly
 * named items gets addressed unambiguously.
 */
const CLICK_FINDER = `
  const CLICKABLE = 'a, button, [role=button], label, .itm, .nav-item';
  const find = (needle, exact) => {
    if (exact) {
      return [...document.querySelectorAll('*')]
        .filter((n) => !n.children.length && n.textContent.trim() === needle)
        .map((n) => n.closest(CLICKABLE))
        .find(Boolean);
    }
    const lower = needle.toLowerCase();
    return [...document.querySelectorAll(CLICKABLE)].find((n) =>
      n.textContent.trim().toLowerCase().includes(lower),
    );
  };
`;

function parseArgs() {
  const argv = process.argv.slice(2);
  const source = argv[0];
  if (!source || source.startsWith('-')) {
    console.error('usage: design-skel <file.html|url> --root <selector> [--click <text>]');
    console.error('                   [--session <token>] [--width 1440] [--wait 2500]');
    console.error('                   [--classes] [--styles] [--click-exact <text>]');
    process.exit(1);
  }
  const flag = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i === -1 ? undefined : argv[i + 1];
  };
  return {
    source,
    root: flag('root') ?? 'body',
    click: flag('click'),
    clickExact: flag('click-exact'),
    session: flag('session'),
    width: Number(flag('width') ?? 1440),
    wait: Number(flag('wait') ?? 2500),
    classes: argv.includes('--classes'),
    styles: argv.includes('--styles'),
  };
}

/**
 * The walker, stringified into the page. Kept as a single expression so it can
 * go through `Runtime.evaluate` without a build step. `getAttribute('class')`
 * rather than `classList`/`className` because it is the one form that behaves
 * identically for HTML and SVG elements.
 */
function walkerFor(root, { classes, styles }) {
  return `(() => {
    const WITH_CLASSES = ${classes ? 'true' : 'false'};
    const WITH_STYLES = ${styles ? 'true' : 'false'};
    const root = document.querySelector(${JSON.stringify(root)});
    if (!root) return null;
    const NOTE = { input: 'placeholder', a: 'href', img: 'src', svg: 'viewBox', path: 'd', use: 'href' };
    const out = [];
    const walk = (el, depth) => {
      const tag = el.tagName.toLowerCase();
      // Classes sorted when shown — order never matters to CSS, so sorting
      // kills false positives.
      const cls = WITH_CLASSES
        ? (el.getAttribute('class') || '').split(/\\s+/).filter(Boolean).sort()
        : [];
      // Own text only — a parent must not inherit its children's copy, or
      // every ancestor of a changed string shows up in the diff as well.
      // Concatenate first, collapse second. Trimming each node and joining
      // with a space invented whitespace that never rendered: {n}/{max} came
      // out as "18 / 40" on one side and "18 /40" on the other, so every
      // character counter looked like a diff.
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('')
        .replace(/\\s+/g, ' ')
        .trim();
      const attr = NOTE[tag];
      const val = attr ? el.getAttribute(attr) : null;
      // The properties a translated port has to reproduce by hand. A wrong
      // Tailwind spacing/colour/font choice shows up in exactly these.
      let styleNote = '';
      if (WITH_STYLES) {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        styleNote =
          '  {' +
          [
            'align:' + cs.textAlign,
            'box:' + Math.round(r.width) + 'x' + Math.round(r.height),
            'font:' + cs.fontFamily.split(',')[0].replace(/"/g, '') + '/' + cs.fontSize + '/' + cs.fontWeight,
            'pad:' + cs.padding,
            'border:' + cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
            'bg:' + cs.backgroundColor,
            // Gradients live in background-image, not backgroundColor: without
            // this a gradient-filled panel reads as transparent.
            ...(cs.backgroundImage && cs.backgroundImage !== 'none'
              ? ['bgimg:' + cs.backgroundImage.replace(/\\s+/g, ' ')]
              : []),
            'color:' + cs.color,
          ].join(' ') +
          '}';
      }
      // aria-label is copy too: it is what a screen reader says in place of
      // the missing text, so a port that drops or rewords it has changed
      // what the page communicates just as surely as a reworded <p>.
      const aria = el.getAttribute('aria-label');
      out.push(
        '  '.repeat(depth) +
          tag +
          cls.map((c) => '.' + c).join('') +
          (own ? '  "' + own + '"' : '') +
          (val ? '  @' + attr + '=' + val.replace(/\\s+/g, ' ').slice(0, 24) : '') +
          (aria ? '  @aria-label=' + aria.replace(/\\s+/g, ' ') : '') +
          styleNote,
      );
      for (const child of el.children) walk(child, depth + 1);
    };
    walk(root, 0);
    return out.join('\\n');
  })()`;
}

async function main() {
  const args = parseArgs();
  const url = /^https?:\/\//.test(args.source)
    ? args.source
    : `file://${resolve(process.cwd(), args.source)}`;

  const profile = mkdtempSync(join(tmpdir(), 'design-skel-'));
  const port = 9200 + (process.pid % 300);
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  await waitForChrome(port);
  const tab = await (
    await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
  ).json();

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.on('message', (data) => {
    const msg = JSON.parse(String(data));
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  await new Promise((r) => ws.on('open', r));
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
    return r.result?.result?.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  // A true viewport, not a window size: headless Chrome floors --window-size
  // at a 500px viewport, so narrow-width captures lie without this.
  await send('Emulation.setDeviceMetricsOverride', {
    width: args.width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: args.width < 600,
  });
  if (args.session) {
    // Auth.js session cookie. Set before navigating, or the first render is
    // the signed-out one and the subtree you want never exists.
    await send('Network.setCookie', {
      name: 'authjs.session-token',
      value: args.session,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
  }
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, args.wait));

  if (args.click || args.clickExact) {
    const hit = await evaluate(`(() => {
      ${CLICK_FINDER}
      const el = find(${JSON.stringify(args.clickExact ?? args.click)}, ${Boolean(
        args.clickExact,
      )});
      if (!el) return 'MISS';
      el.click();
      return 'HIT ' + el.textContent.trim().slice(0, 40);
    })()`);
    if (String(hit).startsWith('MISS')) {
      console.error(
        `--click${args.clickExact ? '-exact' : ''} "${args.clickExact ?? args.click}": nothing matched`,
      );
      process.exitCode = 2;
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  const skeleton = await evaluate(walkerFor(args.root, args));
  if (skeleton == null) {
    console.error(`--root "${args.root}": not present in ${url}`);
    process.exitCode = 2;
  } else {
    console.log(skeleton);
  }

  ws.close();
  chrome.kill();
  // Wait for Chrome to actually exit, or it is still writing the profile
  // while we delete it and rmSync throws ENOTEMPTY.
  await new Promise((r) => chrome.once('exit', r));
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}

async function waitForChrome(port) {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Chrome never opened a debugging port on ${port}`);
}

main();
