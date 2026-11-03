"use client";

import { useEffect, useRef, useState } from "react";

export type QrStyle = {
  fg: string;
  bg: string;
  dots: "square" | "rounded" | "dots" | "classy" | "extra-rounded";
  corners: "square" | "extra-rounded" | "dot";
  frame: string | null;
  caption: string;
};

export const defaultQrStyle: QrStyle = {
  fg: "#0e1311",
  bg: "#ffffff",
  dots: "square",
  corners: "square",
  frame: null,
  caption: "SCAN ME",
};

/** Minimal shape of the bits of qr-code-styling we touch. */
type QrInstance = {
  append: (el: HTMLElement) => void;
  update: (opts: Record<string, unknown>) => void;
  download: (opts: { name: string; extension: string }) => Promise<void>;
};

/**
 * The text as UTF-8 bytes, one per character. qr-code-styling writes each
 * character's low byte, so anything past ASCII — an emoji in an SMS, "é" in
 * a vCard name — came out as garbage or nothing (Tami, 2026-10-30). Handing
 * it bytes makes the code UTF-8, which phone readers recognise.
 */
const utf8 = (s: string) => unescape(encodeURIComponent(s));

function optionsFor(value: string, style: QrStyle, size: number) {
  return {
    width: size,
    height: size,
    type: "svg" as const,
    data: utf8(value || " "),
    margin: 8,
    qrOptions: { errorCorrectionLevel: "Q" as const },
    dotsOptions: { color: style.fg, type: style.dots },
    backgroundOptions: { color: style.bg },
    cornersSquareOptions: { color: style.fg, type: style.corners },
    cornersDotOptions: { color: style.fg },
  };
}

/**
 * Renders a live QR for `value`. The library is loaded lazily because it
 * reaches for the DOM on construction, which would break server rendering.
 */
export function QrPreview({
  value,
  style,
  size = 240,
  className = "",
  onReady,
}: {
  value: string;
  style: QrStyle;
  size?: number;
  className?: string;
  onReady?: (download: (ext: "png" | "jpeg" | "svg") => void) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QrInstance | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("qr-code-styling");
        if (cancelled || !hostRef.current) return;

        const QRCodeStyling = mod.default as unknown as new (
          o: Record<string, unknown>,
        ) => QrInstance;

        if (!qrRef.current) {
          qrRef.current = new QRCodeStyling(optionsFor(value, style, size));
          hostRef.current.replaceChildren();
          qrRef.current.append(hostRef.current);
        } else {
          qrRef.current.update(optionsFor(value, style, size));
        }

        onReady?.((ext) =>
          qrRef.current?.download({ name: "qr-code", extension: ext }),
        );
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // onReady is a fresh closure each render; re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, style, size]);

  if (failed) {
    return (
      <div
        className={`grid place-items-center rounded-xl bg-bg-alt text-xs text-muted ${className}`}
        style={{ width: size, height: size }}
      >
        Preview unavailable
      </div>
    );
  }

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

type Ext = "png" | "jpeg" | "svg";
type Ready = { url: string; filename: string };

const loadLib = () => import("qr-code-styling");
/** Fetch the library ahead of the first click (the dashboard calls this). */
export const preloadQr = () => void loadLib();

const pending = new Map<string, Promise<Ready>>();
const ready = new Map<string, Ready>();
const keyOf = (value: string, style: QrStyle, name: string, ext: Ext) => JSON.stringify([value, style, name, ext]);

/**
 * Render the file ahead of the click, as a blob URL. Safari only lets a
 * page start a download from the click itself; one that waits for the
 * library to load and the code to draw is dropped without a word (Tami,
 * 2026-11-03: "nothing happens" in Safari, fine in Chrome). So the menu
 * prepares its files as it opens, and the click hands over a finished one.
 */
export function prepareQr(value: string, style: QrStyle, name: string, ext: Ext): Promise<Ready> {
  const key = keyOf(value, style, name, ext);
  let p = pending.get(key);
  if (!p) {
    p = (async () => {
      const mod = await loadLib();
      const QRCodeStyling = mod.default as unknown as new (o: Record<string, unknown>) => QrInstance & {
        getRawData: (ext: Ext) => Promise<Blob | null>;
      };
      const qr = new QRCodeStyling({
        ...optionsFor(value, style, 1024),
        // Raster formats need a canvas; SVG stays vector.
        type: ext === "svg" ? "svg" : "canvas",
        margin: 32,
      });
      const blob = await qr.getRawData(ext);
      if (!blob) throw new Error("QR render failed");
      const safe = name.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "qr-code";
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

/**
 * Download a code at print size without one on screen — the dashboard's
 * thumbnails are 36px, far too small to export from. Rendered off-screen at
 * 1024px through the same options the preview uses, so what downloads is
 * what was shown. Synchronous when `prepareQr` already finished.
 */
export async function downloadQr(value: string, style: QrStyle, name: string, ext: Ext) {
  const done = ready.get(keyOf(value, style, name, ext));
  if (done) return save(done);
  save(await prepareQr(value, style, name, ext));
}
