#!/usr/bin/env node
/**
 * Run a scripted check in headless Chrome:
 *
 *   node scripts/browser-test.mjs /abs/path/test.mjs [width]
 *
 * The test module's default export receives
 *   { ev, tap, go, sleep, ok, shot, send, onEvent, key }
 * — ev(body) runs `body` as an async function in the page and returns its
 * value; tap(expr) clicks the element `expr` evaluates to; ok(cond, msg)
 * records PASS/FAIL; send() is the raw DevTools protocol. Exit code 1 if any
 * check failed. Used for the creator's end-to-end QA; nothing ships with it.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import WebSocket from "ws";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [testPath, widthArg] = process.argv.slice(2);
if (!testPath) {
  console.error("usage: node scripts/browser-test.mjs <test.mjs> [width]");
  process.exit(2);
}
const width = Number(widthArg || 1440);
const port = 9300 + (process.pid % 400);
const profile = mkdtempSync(join(tmpdir(), "browser-test-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0;
let code = 0;
try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break;
    } catch {
      // not up yet
    }
    if (i > 80) throw new Error("Chrome did not start");
    await sleep(250);
  }
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const handlers = [];
  let loaded = null;
  ws.on("message", (data) => {
    const msg = JSON.parse(String(data));
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === "Page.loadEventFired" && loaded) {
      loaded();
      loaded = null;
    }
    if (msg.method === "Runtime.exceptionThrown") console.log("ERROR", JSON.stringify(msg.params.exceptionDetails).slice(0, 400));
    for (const h of handlers) h(msg);
  });
  await new Promise((r) => ws.on("open", r));
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height: width < 600 ? 844 : 900, deviceScaleFactor: width < 600 ? 2 : 1, mobile: width < 600 });
  await send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});

  const ev = async (body) => {
    const r = await send("Runtime.evaluate", { expression: `(async () => { ${body} })()`, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) {
      console.log("ERROR", JSON.stringify(r.exceptionDetails).slice(0, 400));
      fails++;
      return undefined;
    }
    return r.result?.value;
  };
  const tap = (expr) =>
    ev(`const el = (${expr}); if (!el) throw new Error('tap: no element for ' + ${JSON.stringify(String(expr).slice(0, 120))}); el.scrollIntoView({ block: 'center' }); el.click();`);
  const go = async (url) => {
    const p = new Promise((r) => (loaded = r));
    await send("Page.navigate", { url });
    await Promise.race([p, sleep(15000)]);
  };
  const ok = (cond, msg) => {
    if (cond) console.log("PASS", msg);
    else {
      fails++;
      console.log("FAIL", msg);
    }
  };
  const shot = async (path) => {
    const r = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(path, Buffer.from(r.data, "base64"));
  };
  const onEvent = (h) => handlers.push(h);
  const keys = { ArrowDown: 40, ArrowUp: 38, Enter: 13, Escape: 27, Tab: 9 };
  const key = async (k) => {
    const base = { key: k, code: k, windowsVirtualKeyCode: keys[k] ?? 0, nativeVirtualKeyCode: keys[k] ?? 0 };
    await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...base });
    if (k === "Enter") await send("Input.dispatchKeyEvent", { type: "char", ...base, text: "\r" });
    await send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
  };

  const test = (await import(pathToFileURL(resolve(testPath)).href)).default;
  await test({ ev, tap, go, sleep, ok, shot, send, onEvent, key });
  console.log(fails ? `${fails} FAILED` : "ALL PASSED");
  code = fails ? 1 : 0;
  ws.close();
} catch (e) {
  console.log("ERROR", e.message);
  code = 1;
} finally {
  chrome.kill();
  await new Promise((r) => chrome.once("exit", r));
  process.exit(code);
}
