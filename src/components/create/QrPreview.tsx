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

function optionsFor(value: string, style: QrStyle, size: number) {
  return {
    width: size,
    height: size,
    type: "svg" as const,
    data: value || " ",
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
