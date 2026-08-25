"use client";

import { useEffect, useRef } from "react";

/**
 * The lightbox both paywall steps sit in.
 *
 * The mockup uses remodal; vendor scripts are never ported, so this is the
 * same box driven by React — one panel, 976px at most, Escape and
 * click-outside to close, and the page behind it locked so a long modal does
 * not scroll the create flow underneath it.
 */
export function PaywallShell({
  onClose,
  closeLabel = "Close",
  children,
}: {
  onClose: () => void;
  closeLabel?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Lock the page behind the modal without letting the scrollbar's
    // disappearance shift the layout.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    panel.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        // `leading-[normal]` matches the mockup's cascade: it sets no
        // line-height on paragraphs, so they fall back to the font's own,
        // where Tailwind's preflight would impose 1.5 and stretch the modal.
        // Anything the designer DOES specify is set explicitly inside.
        className="relative my-auto max-h-[calc(100vh-40px)] w-full max-w-[976px] overflow-y-auto rounded-[20px] bg-white leading-[normal] shadow-modal outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 z-10 flex cursor-pointer text-muted transition-colors hover:text-ink"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 4L4 14M4 4l10 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
