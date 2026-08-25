/**
 * Render the designer's mockup and the port in the same headless Chrome, at
 * the same true viewport width, and pixel-diff the two full-page screenshots.
 *
 *   node scripts/design-diff.mjs html_files/main.html http://localhost:3000/ --width 1440
 *   node scripts/design-diff.mjs html_files/create.html http://localhost:3000/create --width 390
 *
 * Or via the package alias: `npm run -s diff:design -- <mockup> <port-url>`.
 *
 * Prints an overall mismatch percentage and the vertical BANDS where the
 * mismatch concentrates, so a bad region is locatable without opening the
 * image. Writes design.png, port.png and diff.png (mismatches in red) to
 * --out (default /tmp/design-diff).
 *
 * WHAT THE NUMBER MEANS
 * ---------------------
 * This is the complement of the skeleton diff (design-skel.mjs): the skeleton
 * proves the content and structure, this proves the paint. Neither alone is
 * "it matches".
 *
 * 0.0% happens only when diffing a page against itself. Font rasterisation
 * puts a floor under everything else; anti-aliased edges are already excluded
 * (pixelmatch's includeAA=false). In practice:
 *
 *   < 1%   matching — read the bands anyway; 0.4% can still be one wrong icon
 *   1–5%   a real region differs — the band list says which
 *   > 5%   a section is missing, misplaced, or sized wrong
 *
 * Live data makes bands differ legitimately (real rows vs the mockup's
 * samples). Read every band, explain every band; only explained bands pass.
 *
 * MECHANICS WORTH KNOWING
 * -----------------------
 * - The viewport is emulated via CDP, so --width 390 is a TRUE 390px render.
 *   (--window-size floors the viewport at 500px and lies about mobile.)
 * - CSS animations/transitions are frozen and the caret hidden before
 *   capture, or the marquee/showcase animations diff against themselves.
 * - The two captures usually differ in height; the shorter is padded with
 *   white, and the pad region counts as mismatch — a big trailing band means
 *   one side has content the other lacks, which is a finding, not noise.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import WebSocket from 'ws';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function parseArgs() {
  const argv = process.argv.slice(2);
  const positional = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
  const [design, port] = positional;
  if (!design || !port) {
    console.error('usage: design-diff <design file|url> <port url> [--width 1440]');
    console.error('                   [--session <token>] [--click <text>] [--out /tmp/design-diff]');
    console.error('                   [--wait 2500]');
    process.exit(1);
  }
  const flag = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i === -1 ? undefined : argv[i + 1];
  };
  return {
    design,
    port,
    width: Number(flag('width') ?? 1440),
    session: flag('session'),
    click: flag('click'),
    out: flag('out') ?? '/tmp/design-diff',
    wait: Number(flag('wait') ?? 2500),
  };
}

function toUrl(source) {
  return /^https?:\/\//.test(source) ? source : `file://${resolve(process.cwd(), source)}`;
}

async function capture(send, evaluate, url, args, applySession) {
  // Reset the viewport before every navigation — the previous capture grew it
  // to that page's full height, and vh-based layouts would render against the
  // inherited height, making even a self-diff dirty.
  await send('Emulation.setDeviceMetricsOverride', {
    width: args.width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: args.width < 600,
  });
  if (applySession && args.session) {
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

  // Both sides, not just the port: --click exists to open interaction-gated
  // UI, and the design side is exactly the side that needs opening. Gating it
  // on `applySession` (i.e. "is this the port?") silently diffed the design's
  // closed state against the port's open one.
  if (args.click) {
    await evaluate(`(() => {
      const needle = ${JSON.stringify(args.click ?? '')}.toLowerCase();
      const el = [...document.querySelectorAll('a, button, [role=button], label, .itm, .nav-item')]
        .find((n) => n.textContent.trim().toLowerCase().includes(needle));
      if (el) el.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Freeze motion: an animated marquee diffs against itself frame-to-frame.
  await evaluate(`(() => {
    const s = document.createElement('style');
    s.textContent = '*, *::before, *::after {' +
      ' animation: none !important; transition: none !important;' +
      ' caret-color: transparent !important; scroll-behavior: auto !important; }';
    document.head.appendChild(s);
  })()`);
  await new Promise((r) => setTimeout(r, 300));

  const height = await evaluate('document.documentElement.scrollHeight');
  // Grow the emulated viewport to the full page so lazy/viewport-gated
  // content renders, then capture beyond it for safety.
  await send('Emulation.setDeviceMetricsOverride', {
    width: args.width,
    height: Math.min(Math.max(Number(height) || 900, 900), 20000),
    deviceScaleFactor: 1,
    mobile: args.width < 600,
  });
  await new Promise((r) => setTimeout(r, 500));
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  });
  return PNG.sync.read(Buffer.from(shot.result.data, 'base64'));
}

function padTo(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height, fill: true });
  out.data.fill(255); // white, fully opaque
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, width), Math.min(png.height, height), 0, 0);
  return out;
}

async function main() {
  const args = parseArgs();
  mkdirSync(args.out, { recursive: true });

  const profile = mkdtempSync(join(tmpdir(), 'design-diff-'));
  const debugPort = 9500 + (process.pid % 300);
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-color-profile=srgb',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    await waitForChrome(debugPort);
    const tab = await (
      await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })
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
      new Promise((res, rej) => {
        const i = ++id;
        pending.set(i, (m) => (m.error ? rej(new Error(m.error.message)) : res(m)));
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: args.width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: args.width < 600,
    });

    const designPng = await capture(send, evaluate, toUrl(args.design), args, false);
    const portPng = await capture(send, evaluate, toUrl(args.port), args, true);

    const width = Math.max(designPng.width, portPng.width);
    const height = Math.max(designPng.height, portPng.height);
    const a = padTo(designPng, width, height);
    const b = padTo(portPng, width, height);
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
      threshold: 0.1,
      includeAA: false,
      diffColor: [255, 0, 0],
    });

    writeFileSync(join(args.out, 'design.png'), PNG.sync.write(a));
    writeFileSync(join(args.out, 'port.png'), PNG.sync.write(b));
    writeFileSync(join(args.out, 'diff.png'), PNG.sync.write(diff));

    const pct = (100 * mismatched) / (width * height);
    console.log(
      `${pct.toFixed(2)}% of pixels differ  (${mismatched} px, canvas ${width}x${height})`,
    );
    if (designPng.height !== portPng.height) {
      console.log(
        `heights differ: design ${designPng.height}px vs port ${portPng.height}px — the tail beyond the shorter one counts as mismatch`,
      );
    }

    // Locate the damage: group rows where >2% of pixels differ into bands.
    const rowMiss = new Array(height).fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) {
          rowMiss[y]++;
        }
      }
    }
    const bands = [];
    let start = -1;
    for (let y = 0; y <= height; y++) {
      const hot = y < height && rowMiss[y] / width > 0.02;
      if (hot && start === -1) start = y;
      if (!hot && start !== -1) {
        const rows = rowMiss.slice(start, y);
        const avg = (100 * rows.reduce((s, v) => s + v, 0)) / (rows.length * width);
        bands.push({ start, end: y - 1, avg });
        start = -1;
      }
    }
    if (bands.length) {
      console.log('\nmismatch bands (viewport y-range → avg % of row differing):');
      for (const b2 of bands.filter((x) => x.end - x.start > 3)) {
        console.log(`  y ${b2.start}-${b2.end}  ${b2.avg.toFixed(1)}%`);
      }
    } else {
      console.log('no concentrated mismatch bands — differences are scattered pixels');
    }
    console.log(`\nimages: ${args.out}/{design,port,diff}.png`);

    ws.close();
  } finally {
    chrome.kill();
    // Wait for Chrome to actually exit, or it is still writing the profile
    // while we delete it and rmSync throws ENOTEMPTY.
    await new Promise((r) => chrome.once('exit', r));
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
  }
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
