"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * The pieces every create_mobile_*.html form is built from: the ⓘ tooltip,
 * the "Smart Tracking" pill, a labelled field, an accordion section and the
 * two footer buttons.
 *
 * Sizes are the mockups' computed values at 390px. Their `.frm` runs at
 * 2.08vw (8.11px at 390), and every em below was converted from that.
 */

/* ---- Tooltip -------------------------------------------------------------- */

const tipGlyph = {
  /** Beside a field label: 17px artwork, grey. */
  field: (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[13.8px] w-[13.8px]">
      <g>
        <path d="M8.5 15.5833C12.412 15.5833 15.5833 12.412 15.5833 8.5C15.5833 4.58798 12.412 1.41667 8.5 1.41667C4.58798 1.41667 1.41667 4.58798 1.41667 8.5C1.41667 12.412 4.58798 15.5833 8.5 15.5833Z" stroke="#9CA3AF" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 11.3333V8.5" stroke="#9CA3AF" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 5.66667H8.50708" stroke="#9CA3AF" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  /** Inside the teal pill: 15px artwork, teal. */
  pill: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[17px] w-[17px]">
      <g>
        <path d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z" stroke="#5CB5AE" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 10V7.5" stroke="#5CB5AE" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 5H7.50625" stroke="#5CB5AE" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  ),
};

/**
 * Their `.tipWrp`: tap the ⓘ to open, tap anywhere else or press Escape to
 * close. The bubble hangs below the icon, right-aligned to it, and its size
 * follows the font of whatever it sits in — so the pill's is larger than a
 * field's.
 */
export function Tip({
  label,
  text,
  variant = "field",
}: {
  /** What a screen reader announces for the icon. */
  label: string;
  text: string;
  variant?: "field" | "pill";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const pill = variant === "pill";

  return (
    <span
      ref={wrap}
      className={`relative inline-flex ${pill ? "ml-[9.1px]" : ""}`}
    >
      <a
        href="#"
        role="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className={`flex items-center justify-center ${
          pill ? "-m-[4.5px] p-[4.5px]" : "-m-[3.2px] p-[3.2px]"
        }`}
      >
        {tipGlyph[variant]}
      </a>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`absolute z-[11] whitespace-normal bg-ink text-left font-normal text-white shadow-mc-tip ${
            pill
              ? "top-[calc(100%+12.3px)] -right-[10.9px] w-[286.2px] rounded-[10.9px] px-[13.6px] py-[10.2px] text-[13.63px] leading-[20.44px]"
              : "top-[calc(100%+8.8px)] -right-[7.8px] w-[204.4px] rounded-[7.8px] px-[9.7px] py-[7.3px] text-[9.73px] leading-[14.6px]"
          }`}
        >
          {/* Their `.tipBox:before` caret. */}
          <span
            aria-hidden="true"
            className={`absolute bottom-full border-transparent border-b-ink ${
              pill
                ? "right-[15px] border-[6.1px]"
                : "right-[10.7px] border-[4.4px]"
            }`}
          />
          {text}
        </span>
      )}
    </span>
  );
}

/* ---- "Smart Tracking & Editing Included" --------------------------------- */

export const TRACKING_TIP =
  "This is a dynamic QR code. You can edit where it points anytime (even after printing) and track every scan.";

export function TrackingPill({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-[32.4px] w-fit items-center rounded-full border border-mc-pill-line bg-brand-soft px-[13px] ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-[6.5px] block h-[14.6px] w-[14.6px] shrink-0">
        <g>
          <path d="M2.8875 6.465C2.77803 5.97189 2.79484 5.45913 2.93637 4.97425C3.0779 4.48938 3.33956 4.04808 3.6971 3.69129C4.05464 3.3345 4.49648 3.07376 4.98166 2.93325C5.46683 2.79273 5.97963 2.777 6.4725 2.8875C6.74378 2.46323 7.1175 2.11407 7.55921 1.87221C8.00092 1.63036 8.49641 1.50359 9 1.50359C9.50359 1.50359 9.99908 1.63036 10.4408 1.87221C10.8825 2.11407 11.2562 2.46323 11.5275 2.8875C12.0211 2.77652 12.5348 2.79218 13.0207 2.93304C13.5067 3.07389 13.9491 3.33536 14.3069 3.69311C14.6646 4.05087 14.9261 4.4933 15.067 4.97925C15.2078 5.4652 15.2235 5.97887 15.1125 6.4725C15.5368 6.74378 15.8859 7.1175 16.1278 7.55921C16.3696 8.00092 16.4964 8.49641 16.4964 9C16.4964 9.50359 16.3696 9.99908 16.1278 10.4408C15.8859 10.8825 15.5368 11.2562 15.1125 11.5275C15.223 12.0204 15.2073 12.5332 15.0668 13.0183C14.9262 13.5035 14.6655 13.9454 14.3087 14.3029C13.9519 14.6604 13.5106 14.9221 13.0257 15.0636C12.5409 15.2052 12.0281 15.222 11.535 15.1125C11.2641 15.5384 10.8901 15.8891 10.4476 16.132C10.0051 16.3749 9.50852 16.5023 9.00375 16.5023C8.49898 16.5023 8.00237 16.3749 7.55991 16.132C7.11744 15.8891 6.74343 15.5384 6.4725 15.1125C5.97963 15.223 5.46683 15.2073 4.98166 15.0668C4.49648 14.9262 4.05464 14.6655 3.6971 14.3087C3.33956 13.9519 3.0779 13.5106 2.93637 13.0257C2.79484 12.5409 2.77803 12.0281 2.8875 11.535C2.45997 11.2644 2.10781 10.8901 1.86379 10.4469C1.61976 10.0037 1.4918 9.50596 1.4918 9C1.4918 8.49404 1.61976 7.99631 1.86379 7.55309C2.10781 7.10987 2.45997 6.73557 2.8875 6.465Z" stroke="#11B1A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.75 9L8.25 10.5L11.25 7.5" stroke="#11B1A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <span className="text-[11.36px] leading-[normal] font-bold whitespace-normal text-brand-dark">
        Smart Tracking &amp; Editing Included
      </span>
      <Tip
        variant="pill"
        label="About Smart Tracking & Editing"
        text={TRACKING_TIP}
      />
    </div>
  );
}

/* ---- Fields ---------------------------------------------------------------- */

/**
 * Their text input: 43.7px tall, 5px corners, 16px type (so iOS does not
 * zoom on focus), blue border while focused, red once Next has found it
 * wanting.
 */
export function inputClass(invalid: boolean) {
  return `mt-[9.6px] block w-full rounded-[5px] border bg-white px-4 text-base leading-6 tracking-[0.16px] text-ink shadow-mc-input transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-mc-placeholder focus:placeholder:text-mc-placeholder/58 ${
    invalid
      ? "border-mc-error focus:border-error focus:shadow-[0_5px_10px_-5px_rgba(0,0,0,0.1),inset_0_0_0_1px_#cc0000]"
      : "border-mc-input-line focus:border-primary"
  }`;
}

export const textInput = (invalid: boolean) =>
  `${inputClass(invalid)} h-[43.7px]`;

export const textArea = (invalid: boolean) =>
  `${inputClass(invalid)} min-h-[102.4px] px-4 py-[11.2px]`;

/** Their `.lbl label`: 14px/600 slate, a red star when required. */
export function Label({
  htmlFor,
  required,
  children,
  className = "",
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-[14px] leading-[normal] font-semibold text-body ${className}`}
    >
      {children}
      {required && (
        <>
          {" "}
          <em className="not-italic text-mc-error">*</em>
        </>
      )}
    </label>
  );
}

/** Their `.cnt`: the character count under a control. */
export function Counter({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-[4.9px] text-right text-[10.14px] leading-[normal] text-faint">
      {value.length}/{max}
    </p>
  );
}

/** Their `small.error`, appended under the control by their Next handler. */
export function FieldError({ children }: { children: ReactNode }) {
  return (
    <small className="mt-[5.1px] block text-[10.14px] leading-[normal] text-mc-error">
      {children}
    </small>
  );
}

/**
 * Their `.fld`: label row (with an optional ⓘ), the control, then the error
 * and the counter.
 */
export function Fld({
  id,
  label,
  required,
  tip,
  error,
  counter,
  children,
  className = "mt-[12.2px]",
}: {
  id: string;
  label: string;
  required?: boolean;
  tip?: { label: string; text: string };
  error?: string | null;
  counter?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
          {tip && <Tip label={tip.label} text={tip.text} />}
        </div>
        {children}
        {error && <FieldError>{error}</FieldError>}
      </div>
      {counter}
    </div>
  );
}

/** Their `.sep`: the hairline between the header, the fields and the name. */
export function Sep() {
  return <div className="my-[13.8px] h-px bg-mc-rule" />;
}

/* ---- Accordion ------------------------------------------------------------- */

/** Their down-caret, shared by the accordions and the preview bar. */
export function Caret({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Height-animated disclosure, standing in for jQuery's `slideToggle(220)`.
 * Animating `grid-template-rows` between 0fr and 1fr needs no measuring, and
 * the closed body is `inert` so a collapsed field cannot take focus.
 */
export function Slide({
  open,
  children,
  className = "",
  duration = "duration-[220ms]",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  /** A Tailwind duration class: jQuery's 220ms unless the file says otherwise. */
  duration?: string;
}) {
  return (
    <div
      inert={!open}
      className={`grid transition-[grid-template-rows] ${duration} ease-in-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className={`min-h-0 overflow-hidden ${className}`}>{children}</div>
    </div>
  );
}

/** Their `.acc`: a bordered section with an icon tile, title and caret. */
export function Acc({
  icon,
  title,
  desc,
  open,
  onToggle,
  children,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-[12.2px] rounded-[11.4px] border border-mc-acc-line bg-white">
      <a
        href="#"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className="flex items-center px-[10.5px] py-[9.7px]"
      >
        <i className="flex h-[32.4px] w-[32.4px] shrink-0 items-center justify-center rounded-[8.1px] border border-mc-card-line bg-mc-tile text-ink not-italic [&>svg]:block [&>svg]:h-[16.2px] [&>svg]:w-[16.2px]">
          {icon}
        </i>
        <span className="min-w-0 flex-1 pr-[6.5px] pl-[8.1px]">
          <span className="block text-[12.17px] leading-[normal] font-bold text-ink">
            {title}
          </span>
          <span className="mt-[1.6px] block text-[10.14px] leading-[normal] text-muted">
            {desc}
          </span>
        </span>
        <i
          className={`flex shrink-0 text-muted not-italic transition-transform duration-[250ms] ease-out ${
            open ? "rotate-180" : ""
          }`}
        >
          <Caret className="block h-[13.8px] w-[13.8px]" />
        </i>
      </a>
      <Slide open={open}>
        <div className="border-t border-mc-art-line px-[10.5px] pt-[1.6px] pb-[13px]">
          {children}
        </div>
      </Slide>
    </div>
  );
}

/* ---- Footer ---------------------------------------------------------------- */

/** Their `.genBtn6`: 13px/500, 36.4px tall, 9.1px corners. Padding is set
 * per variant — see `outlineBtn`. */
export const smallBtn =
  "relative inline-flex h-[36.4px] cursor-pointer items-center justify-center gap-[7.8px] rounded-[9.1px] text-[13px] leading-[13px] font-medium capitalize transition-colors duration-150 [&>svg]:h-[15.6px] [&>svg]:w-[15.6px]";

/** Their `.btnC6`: blue outline that fills on hover. */
// Their border is drawn on `:after`, outside the box model; a real border
// would widen the button by 2px, so the padding gives that pixel back.
export const outlineBtn = `${smallBtn} border border-primary bg-white px-[22.4px] text-primary hover:bg-primary hover:text-white`;

export function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
