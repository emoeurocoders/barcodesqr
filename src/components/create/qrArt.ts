import qrcode from "qrcode-generator";

import { DEFAULT_DESIGN, frameHasText, type QrDesign } from "@/lib/qrDesign";

/**
 * One renderer for every QR code the customer sees or downloads (JB,
 * 2026-11-24): the live preview, the frame/colour thumbnails, the dashboard
 * and the PNG, JPG and SVG files all come from `layout()` below, so a
 * thumbnail, the preview and the download cannot disagree — JB's report was
 * exactly that, a "Scan me!" label shaped differently in the thumbnail than
 * in the preview.
 *
 * The geometry is the designer's CSS (create_customize_desktop.html, the
 * `.qrFrm` / `.qrM` / `.qrEo` / `.qrEi` rules in default.css), measured in
 * headless Chrome at their preview width of 270px and kept here in those
 * pixels; any other size is a uniform scale of it.
 *
 * The modules are the REAL code for the customer's content — never the
 * file's sample symbol — so what the preview shows is what scans.
 */

/* ---- The code ------------------------------------------------------------- */

/** UTF-8 bytes as a "binary string", one char per byte (see QrPreview's note). */
const utf8 = (s: string) => unescape(encodeURIComponent(s));

export type Matrix = { n: number; dark: (r: number, c: number) => boolean };

/**
 * The module grid for `value`. Error correction is Q (25%), as before, and H
 * (30%) once a logo covers the centre — the logo hides roughly 7% of the
 * code, which H recovers with room to spare.
 */
export function matrixFor(value: string, withLogo: boolean): Matrix {
  const qr = qrcode(0, withLogo ? "H" : "Q");
  qr.addData(utf8(value || " "), "Byte");
  qr.make();
  const n = qr.getModuleCount();
  return { n, dark: (r, c) => qr.isDark(r, c) };
}

/* ---- Shapes --------------------------------------------------------------- */

export type Shape =
  | { kind: "path"; d: string; fill: string; evenodd?: boolean }
  | {
      kind: "text";
      x: number;
      y: number;
      text: string;
      size: number;
      fill: string;
    }
  | { kind: "logo"; x: number; y: number; w: number; h: number; bg: string; rx: number; ry: number; pad: number };

export type Layout = {
  width: number;
  height: number;
  shapes: Shape[];
  /** Their card shadow on Label / Top label — preview only, never exported. */
  shadow: { radius: number } | null;
};

const f = (n: number) => +n.toFixed(3);

/** Rounded rect with per-corner radii [tl, tr, br, bl]; each corner may be elliptical. */
function rrect(x: number, y: number, w: number, h: number, r: number | [number, number, number, number], ry?: number): string {
  const rs = typeof r === "number" ? [r, r, r, r] : r;
  const k = ry === undefined ? 1 : ry / (rs[0] || 1);
  const [tl, tr, br, bl] = rs.map((v) => Math.min(v, w / 2));
  const v = (rx: number) => Math.min(rx * k, h / 2);
  if (!tl && !tr && !br && !bl) return `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
  return (
    `M${f(x + tl)} ${f(y)}H${f(x + w - tr)}` +
    (tr ? `A${f(tr)} ${f(v(tr))} 0 0 1 ${f(x + w)} ${f(y + v(tr))}` : "") +
    `V${f(y + h - v(br))}` +
    (br ? `A${f(br)} ${f(v(br))} 0 0 1 ${f(x + w - br)} ${f(y + h)}` : "") +
    `H${f(x + bl)}` +
    (bl ? `A${f(bl)} ${f(v(bl))} 0 0 1 ${f(x)} ${f(y + h - v(bl))}` : "") +
    `V${f(y + v(tl))}` +
    (tl ? `A${f(tl)} ${f(v(tl))} 0 0 1 ${f(x + tl)} ${f(y)}` : "") +
    "Z"
  );
}

const poly = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;

/* ---- Patterns and eyes (their .patX / .crnX custom properties) ----------- */

/** [rx, sx, sy] in module units — `--qrRx`, `--qrSx`, `--qrSy`. */
const PATTERN: Record<QrDesign["pattern"], [number, number, number]> = {
  square: [0, 1, 1],
  dots: [0.5, 0.86, 0.86],
  rounded: [0.32, 1, 1],
  fluid: [0.5, 0.9, 1.24],
  small: [0.5, 0.62, 0.62],
};

/** [outer rx, inner rx, diamond] — `--qrEoRx`, `--qrEiRx`, `--qrEoT`/`--qrEiT`. */
const CORNER: Record<QrDesign["corners"], [number, number, boolean]> = {
  square: [0, 0, false],
  dot: [1.2, 1.5, false],
  circle: [3, 1.5, false],
  rounded: [1.8, 0.7, false],
  diamond: [0, 0, true],
};

const inFinder = (n: number, r: number, c: number) =>
  (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

/**
 * The code itself at (x, y), `size` wide: modules as one path, the three eyes
 * as rings plus centres. `.qrM` is a 1×1 rect with rx, scaled about its own
 * centre (transform-box: fill-box) — so a scaled module keeps its centre and
 * its corner radius scales with it, which is what makes Fluid's 0.9 × 1.24
 * capsules overlap vertically into columns.
 */
function codeShapes(m: Matrix, d: QrDesign, x: number, y: number, size: number): Shape[] {
  const u = size / m.n;
  const [rx, sx, sy] = PATTERN[d.pattern];
  const w = sx * u;
  const h = sy * u;
  let mods = "";
  for (let r = 0; r < m.n; r++) {
    for (let c = 0; c < m.n; c++) {
      if (!m.dark(r, c) || inFinder(m.n, r, c)) continue;
      const cx = x + (c + 0.5) * u;
      const cy = y + (r + 0.5) * u;
      mods += rx ? rrect(cx - w / 2, cy - h / 2, w, h, rx * sx * u, rx * sy * u) : rrect(cx - w / 2, cy - h / 2, w, h, 0);
    }
  }
  const out: Shape[] = [{ kind: "path", d: mods, fill: d.fg }];

  const [ro, ri, diamond] = CORNER[d.corners];
  for (const [er, ec] of [
    [0, 0],
    [0, m.n - 7],
    [m.n - 7, 0],
  ]) {
    const ex = x + ec * u;
    const ey = y + er * u;
    if (diamond) {
      // rotate(45deg) scale(0.78) about each square's own centre.
      const cx = ex + 3.5 * u;
      const cy = ey + 3.5 * u;
      const sq = (half: number) => {
        const k = half * 0.78 * Math.SQRT2;
        return poly([
          [cx, cy - k],
          [cx + k, cy],
          [cx, cy + k],
          [cx - k, cy],
        ]);
      };
      // The ring is a 1-module stroke centred on the 6×6 square's edge.
      out.push({ kind: "path", d: sq(3.5 * u) + sq(2.5 * u), fill: d.fg, evenodd: true });
      out.push({ kind: "path", d: sq(1.5 * u), fill: d.fg });
    } else {
      // A 1-wide stroke on a rect with radius `ro`: outer edge radius ro+½,
      // inner edge ro−½ (square corners stay square).
      const outer = rrect(ex, ey, 7 * u, 7 * u, ro ? (ro + 0.5) * u : 0);
      const inner = rrect(ex + u, ey + u, 5 * u, 5 * u, ro ? Math.max(ro - 0.5, 0) * u : 0);
      out.push({ kind: "path", d: outer + inner, fill: d.fg, evenodd: true });
      out.push({ kind: "path", d: rrect(ex + 2 * u, ey + 2 * u, 3 * u, 3 * u, ri * u), fill: d.fg });
    }
  }
  return out;
}

/* ---- Frames (their .qrFrm.frmX rules, measured at 270px) ------------------ */

const HAIRLINE = "#e8eaef";
const WHITE = "#ffffff";
/** Inter: the alphabetic baseline sits 0.3633em below a line box's middle. */
const BASELINE = 0.3633;

export type Measure = (text: string, sizePx: number) => number;

/** Fit `text` into `max` px with an ellipsis, as their `text-overflow` does. */
function fit(text: string, size: number, max: number, measure: Measure) {
  if (measure(text, size) <= max) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (measure(text.slice(0, mid).trimEnd() + "…", size) <= max) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, lo).trimEnd() + "…";
}

/**
 * The whole design at `width` px. `measure` sizes the frame text (canvas
 * `measureText` in the page's Inter); the label shapes that hug their text —
 * Bubble and Ribbon — depend on it.
 */
export function layout(value: string, design: QrDesign, width: number, measure: Measure): Layout {
  const d = design;
  const s = width / 270;
  const m = matrixFor(value, !!d.logo);
  const shapes: Shape[] = [];
  const text = frameHasText(d.frame) ? d.text.trim() || DEFAULT_DESIGN.text : "";
  let height = 270;
  let shadow: Layout["shadow"] = null;

  /** The QR box: background, the code, and the logo at the box's centre. */
  const box = (bx: number, by: number, bw: number, bh: number, qx: number, qy: number, qs: number, border = 0, borderBottom = border) => {
    shapes.push(...codeShapes(m, d, qx * s, qy * s, qs * s));
    if (d.logo) {
      // `.qrLgo`: 24% of the box's padding box, centred, on the background
      // with an 18% radius and 1.5% padding (of the box width).
      const pw = bw - 2 * border;
      const ph = bh - border - borderBottom;
      const lw = 0.24 * pw;
      const lh = 0.24 * ph;
      shapes.push({
        kind: "logo",
        x: (bx + border + (pw - lw) / 2) * s,
        y: (by + border + (ph - lh) / 2) * s,
        w: lw * s,
        h: lh * s,
        bg: d.bg,
        rx: 0.18 * lw * s,
        ry: 0.18 * lh * s,
        pad: 0.015 * pw * s,
      });
    }
  };
  const bgRect = (x: number, y: number, w: number, h: number, r: number | [number, number, number, number]) =>
    shapes.push({ kind: "path", d: rrect(x * s, y * s, w * s, h * s, typeof r === "number" ? r * s : (r.map((v) => v * s) as [number, number, number, number])), fill: d.bg });
  const ring = (x: number, y: number, w: number, h: number, r: number, b: number, color: string) =>
    shapes.push({
      kind: "path",
      d: rrect(x * s, y * s, w * s, h * s, r * s) + rrect((x + b) * s, (y + b) * s, (w - 2 * b) * s, (h - 2 * b) * s, Math.max(r - b, 0) * s),
      fill: color,
      evenodd: true,
    });
  /** Centred label text in a line box starting at `lineTop`. */
  const label = (cx: number, lineTop: number, lh: number, size: number, max: number, color: string) =>
    shapes.push({
      kind: "text",
      x: cx * s,
      y: (lineTop + lh / 2 + BASELINE * size) * s,
      text: fit(text, size * s, max * s, measure),
      size: size * s,
      fill: color,
    });

  switch (d.frame) {
    case "none":
      bgRect(0, 0, 270, 270, 12);
      ring(0, 0, 270, 270, 12, 1, HAIRLINE);
      box(0, 0, 270, 270, 15, 15, 240, 1);
      break;
    case "border":
      bgRect(0, 0, 270, 270, 4);
      ring(0, 0, 270, 270, 4, 3, d.fr);
      box(0, 0, 270, 270, 19, 19, 232, 3);
      break;
    case "label":
    case "top": {
      // The card is the background with a 14px radius; the label is a band
      // across its bottom (Label) or top (Top label), clipped to the card.
      height = 319.88;
      shadow = { radius: 14 * s };
      const top = d.frame === "top";
      const lblY = top ? 0 : 268;
      bgRect(0, 0, 270, height, 14);
      shapes.push({
        kind: "path",
        d: rrect(0, lblY * s, 270 * s, 51.88 * s, (top ? [14, 14, 0, 0] : [0, 0, 14, 14]).map((v) => v * s) as [number, number, number, number]),
        fill: d.fr,
      });
      label(135, lblY + 13.02, 25, 21, 270 - 21, WHITE);
      if (top) box(0, 51.88, 270, 268, 14, 63.88, 242);
      else box(0, 0, 270, 268, 14, 14, 242);
      break;
    }
    case "rounded":
      // The whole card is the frame colour; the box sits inset with a 16px radius.
      height = 317.58;
      shapes.push({ kind: "path", d: rrect(0, 0, 270 * s, height * s, 24 * s), fill: d.fr });
      bgRect(9, 9, 252, 252, 16);
      label(135, 261 + 13.2, 28.98, 24, 252 - 24, WHITE);
      box(9, 9, 252, 252, 23, 23, 224);
      break;
    case "bubble": {
      height = 342.23;
      bgRect(0, 0, 270, 270, 16);
      ring(0, 0, 270, 270, 16, 5, d.fr);
      box(0, 0, 270, 270, 19, 19, 232, 5);
      // A pill that hugs its text (27.3px padding each side, max the box
      // width).
      const t = fit(text, 21 * s, (270 - 54.6) * s, measure);
      const w = Math.min(measure(t, 21 * s) / s + 54.6, 270);
      const x = 135 - w / 2;
      shapes.push({ kind: "path", d: rrect(x * s, 295.19 * s, w * s, 47.05 * s, 23.525 * s), fill: d.fr });
      // Their `.qrLbl:before` arrow is clipped by the label's own
      // `overflow: hidden`, so the file never shows it — nor do we (raised
      // with JB as a designer bug rather than fixed here).
      shapes.push({ kind: "text", x: 135 * s, y: (295.19 + 10.5 + 12.5 + BASELINE * 21) * s, text: t, size: 21 * s, fill: WHITE });
      break;
    }
    case "ribbon": {
      height = 295.64;
      bgRect(0, 0, 270, 278, 10);
      ring(0, 0, 270, 278, 10, 1, HAIRLINE);
      box(0, 0, 270, 278, 15, 15, 240, 1);
      // A notched banner over the box's bottom edge: 46.2px padding each
      // side, at most 90% of the frame, 0.9em (18.9px) notches.
      const t = fit(text, 21 * s, (243 - 92.4) * s, measure);
      const w = Math.min(measure(t, 21 * s) / s + 92.4, 243);
      const x = 135 - w / 2;
      const y = 250.7;
      const h = 44.94;
      shapes.push({
        kind: "path",
        d: poly([
          [x * s, y * s],
          [(x + w) * s, y * s],
          [(x + w - 18.9) * s, (y + h / 2) * s],
          [(x + w) * s, (y + h) * s],
          [x * s, (y + h) * s],
          [(x + 18.9) * s, (y + h / 2) * s],
        ]),
        fill: d.fr,
      });
      shapes.push({ kind: "text", x: 135 * s, y: (y + 9.45 + 12.5 + BASELINE * 21) * s, text: t, size: 21 * s, fill: WHITE });
      break;
    }
    case "sign": {
      height = 338.88;
      // The box: frame-coloured border on three sides, top corners 12px.
      bgRect(0, 22, 270, 265, [12, 12, 0, 0]);
      shapes.push({
        kind: "path",
        d: rrect(0, 22 * s, 270 * s, 265 * s, [12 * s, 12 * s, 0, 0]) + rrect(5 * s, 27 * s, 260 * s, 260 * s, [7 * s, 7 * s, 0, 0]),
        fill: d.fr,
        evenodd: true,
      });
      box(0, 22, 270, 265, 19, 41, 232, 5, 0);
      // The hanger: 52 × 28, top corners 26px, a ~6px hole at its centre.
      const hole = 5.85 * s;
      shapes.push({
        kind: "path",
        d:
          rrect(109 * s, 0, 52 * s, 28 * s, [26 * s, 26 * s, 0, 0]) +
          `M${f(135 * s + hole)} ${f(14 * s)}A${f(hole)} ${f(hole)} 0 1 0 ${f(135 * s - hole)} ${f(14 * s)}A${f(hole)} ${f(hole)} 0 1 0 ${f(135 * s + hole)} ${f(14 * s)}Z`,
        fill: d.fr,
        evenodd: true,
      });
      shapes.push({ kind: "path", d: rrect(0, 287 * s, 270 * s, 51.88 * s, [0, 0, 25.2 * s, 25.2 * s]), fill: d.fr });
      label(135, 287 + 13.02, 25, 21, 270 - 21, WHITE);
      break;
    }
    case "corners": {
      height = 302.59;
      bgRect(0, 0, 270, 270, 0);
      box(0, 0, 270, 270, 20, 20, 230);
      // A 5px, 6px-radius border masked down to 45px squares at the corners.
      const b = 5;
      const L = 45;
      const r = 6;
      const bracket = (sx: 1 | -1, sy: 1 | -1) => {
        const ox = sx === 1 ? 0 : 270;
        const oy = sy === 1 ? 0 : 270;
        const P = (x: number, y: number): [number, number] => [(ox + sx * x) * s, (oy + sy * y) * s];
        const [ax, ay] = P(0, L);
        const [bx, by] = P(0, r);
        const [cx, cy] = P(r, 0);
        const [dx, dy] = P(L, 0);
        const [ex, ey] = P(L, b);
        const [gx, gy] = P(b + (r - b), b);
        const [hx, hy] = P(b, b + (r - b));
        const [ix, iy] = P(b, L);
        const sweep = sx * sy === 1 ? 1 : 0;
        const ri = (r - b) * s;
        return (
          `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}A${f(r * s)} ${f(r * s)} 0 0 ${sweep} ${f(cx)} ${f(cy)}` +
          `L${f(dx)} ${f(dy)}L${f(ex)} ${f(ey)}L${f(gx)} ${f(gy)}A${f(ri)} ${f(ri)} 0 0 ${1 - sweep} ${f(hx)} ${f(hy)}L${f(ix)} ${f(iy)}Z`
        );
      };
      shapes.push({ kind: "path", d: bracket(1, 1) + bracket(-1, 1) + bracket(-1, -1) + bracket(1, -1), fill: d.fr });
      label(135, 270 + 6.6, 25.99, 22, 270, d.fr);
      break;
    }
  }

  return { width, height: height * s, shapes, shadow };
}

/**
 * A code with no frame: the background square and the code, with a margin of
 * 32/1024 of the width — what downloads had before designs existed. Used for
 * those older codes (`design` null: black on white, square modules) and for
 * the dashboard's 36px thumbnails (a design's colours and shapes, no frame or
 * logo — member_main.html draws bare coloured codes there).
 */
export function plainLayout(value: string, design: QrDesign | null, width: number): Layout {
  const d: QrDesign = design ? { ...design, logo: null } : { ...DEFAULT_DESIGN, frame: "none" };
  const m = matrixFor(value, false);
  const margin = (32 / 1024) * width;
  return {
    width,
    height: width,
    shadow: null,
    shapes: [{ kind: "path", d: rrect(0, 0, width, width, 0), fill: d.bg }, ...codeShapes(m, d, margin, margin, width - 2 * margin)],
  };
}

/* ---- Option tiles ----------------------------------------------------------- */

/** Their `.patLst` sample: a 5×5 module pattern, verbatim from the file. */
const PATTERN_SAMPLE: [number, number][] = [
  [0, 0], [2, 0], [3, 0], [0, 1], [3, 1], [1, 2], [4, 2], [1, 3], [3, 3], [4, 3], [0, 4], [3, 4],
];

/** A pattern tile: the file's 5×5 sample drawn with that pattern's rule. */
export function patternTile(pattern: QrDesign["pattern"], size: number, fg: string): Shape[] {
  const u = size / 5;
  const [rx, sx, sy] = PATTERN[pattern];
  const w = sx * u;
  const h = sy * u;
  const d = PATTERN_SAMPLE.map(([c, r]) => {
    const cx = (c + 0.5) * u;
    const cy = (r + 0.5) * u;
    return rrect(cx - w / 2, cy - h / 2, w, h, rx * sx * u, rx * sy * u);
  }).join("");
  return [{ kind: "path", d, fill: fg }];
}

/** A corner tile: one eye (7×7) in that corner style. */
export function cornerTile(corners: QrDesign["corners"], size: number, fg: string): Shape[] {
  // An eye is the top-left 7×7 of a code; draw a 7-module "code" with only it.
  const m: Matrix = { n: 7, dark: () => false };
  return codeShapes(m, { ...DEFAULT_DESIGN, corners, fg }, 0, 0, size).slice(1, 3);
}

/* ---- Output --------------------------------------------------------------- */

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The layout as an SVG document. `fontFamily` names the label font;
 * `fontCss` (an @font-face with the font inlined) makes a downloaded file
 * render the same anywhere, and `logoHref` is the logo as a data: URL there
 * for the same reason.
 */
export function toSvg(l: Layout, o: { fontFamily: string; fontCss?: string; logoHref?: string | null; title?: string }) {
  const parts: string[] = [];
  let i = 0;
  for (const sh of l.shapes) {
    if (sh.kind === "path") {
      parts.push(`<path d="${sh.d}" fill="${sh.fill}"${sh.evenodd ? ' fill-rule="evenodd"' : ""}/>`);
    } else if (sh.kind === "text") {
      parts.push(
        `<text x="${f(sh.x)}" y="${f(sh.y)}" fill="${sh.fill}" font-size="${f(sh.size)}" font-weight="700" text-anchor="middle" font-family="${esc(o.fontFamily)}">${esc(sh.text)}</text>`,
      );
    } else if (o.logoHref) {
      const id = `qrlogo${i++}`;
      parts.push(
        `<path d="${rrect(sh.x, sh.y, sh.w, sh.h, sh.rx, sh.ry)}" fill="${sh.bg}"/>` +
          `<clipPath id="${id}"><path d="${rrect(sh.x, sh.y, sh.w, sh.h, sh.rx, sh.ry)}"/></clipPath>` +
          `<image href="${esc(o.logoHref)}" x="${f(sh.x + sh.pad)}" y="${f(sh.y + sh.pad)}" width="${f(sh.w - 2 * sh.pad)}" height="${f(sh.h - 2 * sh.pad)}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${id})"/>`,
      );
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${f(l.width)}" height="${f(l.height)}" viewBox="0 0 ${f(l.width)} ${f(l.height)}">` +
    (o.title ? `<title>${esc(o.title)}</title>` : "") +
    (o.fontCss ? `<defs><style>${o.fontCss}</style></defs>` : "") +
    parts.join("") +
    `</svg>`
  );
}

/** The same layout on a canvas — PNG and JPG downloads. */
export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  l: Layout,
  o: { fontFamily: string; logo?: CanvasImageSource & { width: number; height: number } | null },
) {
  for (const sh of l.shapes) {
    if (sh.kind === "path") {
      ctx.fillStyle = sh.fill;
      ctx.fill(new Path2D(sh.d), sh.evenodd ? "evenodd" : "nonzero");
    } else if (sh.kind === "text") {
      ctx.fillStyle = sh.fill;
      ctx.font = `700 ${sh.size}px ${o.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(sh.text, sh.x, sh.y);
    } else if (o.logo) {
      const clip = new Path2D(rrect(sh.x, sh.y, sh.w, sh.h, sh.rx, sh.ry));
      ctx.fillStyle = sh.bg;
      ctx.fill(clip);
      // object-fit: contain inside the padding.
      const bw = sh.w - 2 * sh.pad;
      const bh = sh.h - 2 * sh.pad;
      const k = Math.min(bw / o.logo.width, bh / o.logo.height);
      const w = o.logo.width * k;
      const h = o.logo.height * k;
      ctx.save();
      ctx.clip(clip);
      ctx.drawImage(o.logo, sh.x + sh.pad + (bw - w) / 2, sh.y + sh.pad + (bh - h) / 2, w, h);
      ctx.restore();
    }
  }
}
