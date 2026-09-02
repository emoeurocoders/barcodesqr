"use client";

import { useRef, useState } from "react";
import { Move, RotateCcw } from "lucide-react";

import { cropStyle, defaultCrop, type Crop, type StoredFile } from "./storedValues";

/**
 * Reposition and zoom an uploaded image inside its frame.
 *
 * The live creator offers this for every field the schema marks `adjustable`,
 * and the PM reported it missing after the R2 upload work. It was never in this
 * port — `adjustable` has sat unread in fieldSchema.ts since the schema was
 * generated — so this is new, not a restoration.
 *
 * The designer has never mocked it, so the layout follows the live product
 * (drag hint, zoom slider, reset) drawn with this app's existing tokens. Flagged
 * as unmocked in the handover.
 *
 * Nothing is written to the file: the three numbers are stored beside it and
 * replayed through `cropStyle` wherever the picture appears, so re-framing is
 * free and reversible and never re-uploads.
 */

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function ImageAdjuster({
  shape,
  stored,
  src,
  onChange,
}: {
  shape: "circle" | "wide";
  stored: StoredFile;
  src: string;
  onChange: (crop: Crop) => void;
}) {
  const crop = stored.crop ?? defaultCrop;
  const frame = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  /**
   * Drag moves the picture, so the object-position moves the opposite way. The
   * travel is divided by the frame size and by zoom: at 3x a pixel of pointer
   * movement should shift the image a third as far, or dragging feels wild.
   */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const from = crop;

    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / box.width) * 100;
      const dy = ((ev.clientY - startY) / box.height) * 100;
      onChange({
        ...from,
        x: clamp(from.x - dx / from.zoom),
        y: clamp(from.y - dy / from.zoom),
      });
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const changed =
    crop.x !== defaultCrop.x ||
    crop.y !== defaultCrop.y ||
    crop.zoom !== defaultCrop.zoom;

  return (
    <div className="mt-3 flex items-start gap-4 rounded-xl border border-line bg-white p-3">
      <div
        ref={frame}
        onPointerDown={onPointerDown}
        role="application"
        aria-label={`Reposition ${stored.name}`}
        className={`relative shrink-0 touch-none overflow-hidden border border-line bg-bg-alt ${
          shape === "circle" ? "h-20 w-20 rounded-full" : "h-20 w-32 rounded-lg"
        } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full select-none"
          style={cropStyle(stored)}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Move className="h-3.5 w-3.5 shrink-0 text-primary" />
          Drag the image to reposition it.
        </p>

        <label className="mt-2 block text-xs font-medium text-ink" htmlFor="zoom">
          Zoom
        </label>
        <input
          id="zoom"
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={crop.zoom}
          onChange={(e) =>
            onChange({ ...crop, zoom: Number(e.currentTarget.value) })
          }
          className="mt-1 w-full accent-primary"
        />

        <button
          type="button"
          onClick={() => onChange(defaultCrop)}
          disabled={!changed}
          className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-primary disabled:cursor-default disabled:opacity-50 disabled:hover:text-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));
