"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";

import type { QrDesign } from "@/lib/qrDesign";
import { drawCanvas, layout, plainLayout, toSvg, type Layout, type Measure } from "./qrArt";

/**
 * Every QR the app shows or downloads, drawn by qrArt.ts (2026-11-24 —
 * replaced qr-code-styling, whose dot styles could not reproduce the
 * customize screen's patterns and frames).
 *
 * `design: null` is a code saved before designs existed: drawn "plain",
 * exactly as those codes always downloaded — square modules, black on white,
 * a thin white margin, no frame — so nobody's existing code changes look.
 */

/* ---- The page's font ------------------------------------------------------ */

let family = "";
/** The family next/font gave Inter on this page, read once from <body>. */
function fontFamily() {
  if (!family && typeof document !== "undefined") {
    family = getComputedStyle(document.body).fontFamily || "Inter, Arial, sans-serif";
  }
  return family || "Inter, Arial, sans-serif";
}

let measureCtx: CanvasRenderingContext2D | null = null;
const measure: Measure = (text, size) => {
  if (typeof document === "undefined") return text.length * size * 0.55;
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return text.length * size * 0.55;
  measureCtx.font = `700 ${size}px ${fontFamily()}`;
  return measureCtx.measureText(text).width;
};

/** The font is loaded before anything is measured or drawn with it. */
const fontReady = () =>
  typeof document === "undefined" ? Promise.resolve() : document.fonts.load(`700 21px ${fontFamily()}`).then(() => undefined);

/* ---- Rendering ------------------------------------------------------------- */

export function layoutFor(value: string, design: QrDesign | null, width: number, plain = false): Layout {
  return plain || !design ? plainLayout(value, design, width) : layout(value, design, width, measure);
}

const subscribeFonts = (cb: () => void) => {
  if (typeof document === "undefined") return () => {};
  document.fonts.addEventListener("loadingdone", cb);
  return () => document.fonts.removeEventListener("loadingdone", cb);
};
const fontsVersion = () => (typeof document === "undefined" ? 0 : document.fonts.status === "loaded" ? 1 : 0);

/**
 * A QR at `size` px wide, as inline SVG. `plain` draws it without its frame
 * (thumbnails). The card shadow of the Label and Top label frames is the
 * preview's, as in the file — downloads never carry it.
 */
export function QrPreview({
  value,
  design = null,
  size = 240,
  plain = false,
  shadow = false,
  className = "",
  title,
}: {
  value: string;
  design?: QrDesign | null;
  size?: number;
  plain?: boolean;
  shadow?: boolean;
  className?: string;
  title?: string;
}) {
  // Re-measure once the web font is in: the label's width depends on it.
  const fonts = useSyncExternalStore(subscribeFonts, fontsVersion, () => 0);
  const l = useMemo(() => layoutFor(value, design, size, plain), [value, design, size, plain, fonts]); // eslint-disable-line react-hooks/exhaustive-deps
  const wrap: CSSProperties =
    shadow && l.shadow
      ? { borderRadius: l.shadow.radius, boxShadow: `0 ${(14 * size) / 270}px ${(34 * size) / 270}px -${(14 * size) / 270}px rgba(14,19,17,0.3)` }
      : {};
  return (
    // Drawn at `size`; displayed at whatever width `className` gives it.
    <span className={`block ${className}`} style={wrap}>
      <svg
        width={l.width}
        height={l.height}
        viewBox={`0 0 ${l.width} ${l.height}`}
        className="block h-auto w-full"
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        <Shapes l={l} logo={design?.logo ?? null} />
      </svg>
    </span>
  );
}

function Shapes({ l, logo }: { l: Layout; logo: string | null }) {
  return (
    <>
      {l.shapes.map((sh, i) => {
        if (sh.kind === "path") return <path key={i} d={sh.d} fill={sh.fill} fillRule={sh.evenodd ? "evenodd" : undefined} />;
        if (sh.kind === "text")
          return (
            <text key={i} x={sh.x} y={sh.y} fill={sh.fill} fontSize={sh.size} fontWeight={700} textAnchor="middle" style={{ fontFamily: "inherit" }}>
              {sh.text}
            </text>
          );
        if (!logo) return null;
        const id = `lg${i}-${Math.round(sh.x)}`;
        return (
          <g key={i}>
            <clipPath id={id}>
              <rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={sh.rx} ry={sh.ry} />
            </clipPath>
            <rect x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={sh.rx} ry={sh.ry} fill={sh.bg} />
            <image
              href={logo}
              x={sh.x + sh.pad}
              y={sh.y + sh.pad}
              width={sh.w - 2 * sh.pad}
              height={sh.h - 2 * sh.pad}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${id})`}
            />
          </g>
        );
      })}
    </>
  );
}

/* ---- Downloads ------------------------------------------------------------- */

type Ext = "png" | "jpeg" | "svg";
type Ready = { url: string; filename: string };

/** Download width in px; a framed code is taller in proportion. */
const EXPORT_WIDTH = 1024;

/** Warm the font ahead of the first download (the dashboard calls this). */
export const preloadQr = () => void fontReady();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // The bucket answers CORS; without this the canvas would be tainted and
    // refuse to export.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("logo failed to load"));
    img.src = src;
  });
}

async function dataUrl(src: string): Promise<string> {
  if (src.startsWith("data:")) return src;
  const blob = await (await fetch(src, { mode: "cors" })).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** Ranges from a CSS `unicode-range`, to pick the font files the text needs. */
function inRanges(ranges: string, ch: number) {
  if (!ranges) return true;
  return ranges.split(",").some((part) => {
    const m = part.trim().match(/^U\+([0-9a-f?]+)(?:-([0-9a-f]+))?$/i);
    if (!m) return false;
    const lo = parseInt(m[1].replace(/\?/g, "0"), 16);
    const hi = m[2] ? parseInt(m[2], 16) : parseInt(m[1].replace(/\?/g, "f"), 16);
    return ch >= lo && ch <= hi;
  });
}

/**
 * The page's Inter as inline @font-face rules, only the files `text` needs —
 * so a downloaded SVG shows the same lettering in any browser or viewer that
 * honours embedded fonts, instead of falling back to Arial.
 */
async function embeddedFont(text: string): Promise<string> {
  const first = fontFamily().split(",")[0].trim().replace(/^["']|["']$/g, "");
  const chars = [...new Set([...text])].map((c) => c.codePointAt(0)!);
  const out: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const fam = rule.style.getPropertyValue("font-family").trim().replace(/^["']|["']$/g, "");
      if (fam !== first) continue;
      const range = rule.style.getPropertyValue("unicode-range");
      if (!chars.some((c) => inRanges(range, c))) continue;
      const url = rule.style.getPropertyValue("src").match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      if (!url) continue;
      try {
        const href = await dataUrl(new URL(url, location.href).href);
        out.push(`@font-face{font-family:"${first}";font-weight:100 900;src:url(${href}) format("woff2");${range ? `unicode-range:${range};` : ""}}`);
      } catch {
        /* the file just renders in the fallback font */
      }
    }
  }
  return out.join("");
}

const pending = new Map<string, Promise<Ready>>();
const ready = new Map<string, Ready>();
const keyOf = (value: string, design: QrDesign | null, name: string, ext: Ext) => JSON.stringify([value, design, name, ext]);

/**
 * Render the file ahead of the click, as a blob URL. Safari only lets a page
 * start a download from the click itself; one that waits for fonts, logos
 * and drawing is dropped without a word (Tami, 2026-11-03). So callers
 * prepare as a menu opens or the pointer arrives, and the click hands over a
 * finished file.
 *
 * Built from the same `layout()` as the on-screen preview, at 1024px wide:
 * what downloads is what was shown.
 */
export function prepareQr(value: string, design: QrDesign | null, name: string, ext: Ext): Promise<Ready> {
  const key = keyOf(value, design, name, ext);
  let p = pending.get(key);
  if (!p) {
    p = (async () => {
      await fontReady();
      const l = layoutFor(value, design, EXPORT_WIDTH);
      const safe = name.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "qr-code";
      let blob: Blob;
      if (ext === "svg") {
        const text = l.shapes.map((sh) => (sh.kind === "text" ? sh.text : "")).join("");
        const svg = toSvg(l, {
          fontFamily: fontFamily(),
          fontCss: text ? await embeddedFont(text) : undefined,
          logoHref: design?.logo ? await dataUrl(design.logo) : null,
          title: name,
        });
        blob = new Blob([svg], { type: "image/svg+xml" });
      } else {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(l.width);
        canvas.height = Math.round(l.height);
        const ctx = canvas.getContext("2d")!;
        // JPG has no transparency: the corners outside a rounded frame go white.
        if (ext === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        drawCanvas(ctx, l, {
          fontFamily: fontFamily(),
          logo: design?.logo ? await loadImage(design.logo) : null,
        });
        const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, `image/${ext}`, 0.95));
        if (!out) throw new Error("QR render failed");
        blob = out;
      }
      const r = { url: URL.createObjectURL(blob), filename: `${safe}.${ext === "jpeg" ? "jpg" : ext}` };
      ready.set(key, r);
      return r;
    })();
    pending.set(key, p);
    p.catch(() => pending.delete(key));
  }
  return p;
}

function save({ url, filename }: Ready) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Download now — synchronous when `prepareQr` already finished. */
export async function downloadQr(value: string, design: QrDesign | null, name: string, ext: Ext) {
  const done = ready.get(keyOf(value, design, name, ext));
  if (done) return save(done);
  save(await prepareQr(value, design, name, ext));
}

/** Raw renderer shapes in a `w × h` box — the pattern and corner tiles. */
export function ShapeSvg({ shapes, w, h, className, label }: { shapes: Layout["shapes"]; w: number; h: number; className?: string; label?: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} overflow="visible">
      <Shapes l={{ width: w, height: h, shapes, shadow: null }} logo={null} />
    </svg>
  );
}
