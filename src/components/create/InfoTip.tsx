"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";

/**
 * The small ⓘ the creator puts beside a label or badge, and the dark bubble it
 * opens. The creator reaches for Radix here; a popover this simple does not
 * earn a dependency, so this is the same markup driven by local state.
 */
export function InfoTip({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <span ref={wrap} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
        className="-m-2 inline-flex cursor-pointer rounded-full p-2 text-faint transition-colors hover:text-muted focus:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Info className="h-4 w-4" />
      </button>

      {open && (
        <span
          id={id}
          role="dialog"
          className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs font-normal leading-snug text-white shadow-pop"
        >
          <svg
            aria-hidden="true"
            width="10"
            height="5"
            viewBox="0 0 10 5"
            className="absolute -top-[5px] left-1/2 -translate-x-1/2 fill-ink"
          >
            <path d="M5 0L10 5H0L5 0Z" />
          </svg>
          {label}
        </span>
      )}
    </span>
  );
}
