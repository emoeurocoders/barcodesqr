"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * The lightbox the paywall and the login modal sit in.
 *
 * The mockup uses remodal; vendor scripts are never ported, so this is the
 * same box driven by React — Escape and click-outside to close, and the page
 * behind it locked so a long modal does not scroll what is underneath.
 *
 * Rendered through a portal on purpose. `position: fixed` is resolved against
 * the nearest ancestor with a filter, transform or backdrop-filter rather
 * than the viewport, and the site header has `backdrop-blur` — mounting the
 * login modal inside it clipped the whole dialog to a 64px strip. A portal
 * puts it on <body> wherever it is called from.
 */
/** The "am I hydrated" store never changes, so it never notifies. */
const subscribeNever = () => () => {};

export function PaywallShell({
  onClose,
  closeLabel = "Close",
  maxWidth = "max-w-[976px]",
  children,
}: {
  onClose: () => void;
  closeLabel?: string;
  /** The login modal is a narrower box in the same frame. */
  maxWidth?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  // `document` only exists in the browser, so there is nothing to portal into
  // until hydration. Read as an external store rather than set in an effect.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

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

  if (!mounted) return null;

  return createPortal(
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
        className={`relative my-auto max-h-[calc(100vh-40px)] w-full ${maxWidth} overflow-y-auto rounded-[20px] bg-white leading-[normal] shadow-modal outline-none`}
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
    </div>,
    document.body,
  );
}
