"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { dialCodes, fieldSchema } from "../fieldSchema";
import type { Field } from "../fieldSchema";
import { cropStyle } from "../storedValues";
import { useFileUpload } from "../useFileUpload";
import { isValidUrl } from "../validate";
import { ImageAdjuster } from "../ImageAdjuster";
import {
  Counter,
  Fld,
  Slide,
  textArea,
  textInput,
} from "./ui";


/**
 * The field-level pieces every create_mobile_*.html form shares: the form
 * state shape, text/phone/textarea fields, URL handling, the upload box and
 * its glyphs. The forms themselves are in forms.tsx (batch 1) and
 * forms2.tsx (batch 2).
 */

export type Values = Record<string, string>;

export type FormState = {
  values: Values;
  set: (k: string, v: string) => void;
  /** Several keys at once, against the latest values. */
  patch: (fn: (cur: Values) => Values) => void;
  /** Read-modify-write against the latest value, for writes that land late. */
  update: (k: string, fn: (cur: string) => string) => void;
  /** Messages by control id — empty until Next has been pressed once. */
  errors: Record<string, string>;
  isOpen: (acc: string) => boolean;
  toggle: (acc: string) => void;
  socialsOn: string[];
  setSocialsOn: React.Dispatch<React.SetStateAction<string[]>>;
  moreSocials: boolean;
  setMoreSocials: (v: boolean) => void;
};

export type Check = {
  /** The control Next focuses and scrolls to. */
  id: string;
  /** Where the message shows, when not under that control (a group). */
  key?: string;
  acc?: string;
  msg: string | null;
};

export const trimmed = (v: string | undefined) => (v ?? "").trim();
export const urlOk = (v: string) => v !== "https://" && isValidUrl(v);
/* ---- URL inputs ------------------------------------------------------------ */

/**
 * Their `.inUrl` behaviour, plus the paste and whitespace cases JB asked to be
 * QA'd: focusing an empty field types "https://" for you, leaving it bare
 * clears it again, a pasted full address does not end up as
 * "https://https://…", and stray spaces go on blur.
 */
export function urlHandlers(value: string, onChange: (v: string) => void) {
  return {
    inputMode: "url" as const,
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: false,
    onFocus: () => {
      if (value === "") onChange("https://");
    },
    onBlur: () => {
      const v = value.replace(/\s+/g, "");
      onChange(v === "https://" ? "" : v);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value.replace(/^https?:\/\/(?=https?:\/\/)/i, "")),
  };
}

/* ---- Shared pieces --------------------------------------------------------- */

export const NAME_TIP = {
  label: "About the QR code name",
  text: "Only you can see this. It helps you find the code later.",
};

/** The type header at the top of the form card (their `.frm .hdr`). */
export function FormHeader({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center">
      <div className="flex h-[45.4px] w-[45.4px] shrink-0 items-center justify-center rounded-[10.5px] border border-mc-card-line bg-mc-tile">
        {icon}
      </div>
      <div className="min-w-0 flex-1 pl-[8.9px]">
        <h4 className="text-[22.71px] leading-[normal] font-extrabold tracking-[-0.57px] text-ink">
          {title}
        </h4>
        <p className="mt-[3.2px] text-[12.98px] leading-[normal] [font-weight:var(--mc-hd-w,500)] text-muted">
          {desc}
        </p>
      </div>
    </div>
  );
}

/** "Name your QR Code", common to every type. */
export function NameField({
  name,
  setName,
  error,
}: {
  name: string;
  setName: (v: string) => void;
  error?: string;
}) {
  // Required since the 2026-10-29 sync ("Please name your QR code.").
  return (
    <Fld id="qrName" label="Name your QR Code" required tip={NAME_TIP} error={error} counter={<Counter value={name} max={40} />}>
      <input
        type="text"
        id="qrName"
        name="qrName"
        maxLength={40}
        value={name}
        aria-invalid={!!error}
        onChange={(e) => setName(e.target.value)}
        className={textInput(!!error)}
      />
    </Fld>
  );
}

/** A plain text-like field bound to one value key. */
export function TextFld({
  s,
  id,
  k,
  label,
  placeholder,
  max,
  required,
  counter,
  type = "text",
  url,
  tip,
}: {
  s: FormState;
  id: string;
  k: string;
  label: string;
  placeholder?: string;
  max?: number;
  required?: boolean;
  counter?: boolean;
  type?: "text" | "tel" | "email";
  url?: boolean;
  tip?: { label: string; text: string };
}) {
  const value = s.values[k] ?? "";
  const set = (v: string) => s.set(k, v);
  const err = s.errors[id];
  return (
    <Fld
      id={id}
      label={label}
      required={required}
      tip={tip}
      error={err}
      counter={counter && max ? <Counter value={value} max={max} /> : undefined}
    >
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        maxLength={max}
        aria-invalid={!!err}
        className={textInput(!!err)}
        {...(url ? urlHandlers(value, set) : { onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.value) })}
      />
    </Fld>
  );
}

export function TextAreaFld({
  s,
  id,
  k,
  label,
  placeholder,
  max,
}: {
  s: FormState;
  id: string;
  k: string;
  label: string;
  placeholder: string;
  max: number;
}) {
  const value = s.values[k] ?? "";
  return (
    <Fld id={id} label={label} counter={<Counter value={value} max={max} />}>
      <textarea
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        maxLength={max}
        onChange={(e) => s.set(k, e.target.value)}
        className={`${textArea(false)} resize-y`}
      />
    </Fld>
  );
}

/** create_mobile_whatsapp.html's option wording: "🇺🇸 US +1". */
export const mobileDialLabel = (c: { label: string; region: string; value: string }) =>
  c.label.replace(/ (\+\d+)$/, ` ${c.region} $1`);

/**
 * A phone number with the country-code picker beside it — JB, 2026-10-15:
 * keep desktop's picker on mobile. Laid out like the designer's own pairing
 * on create_mobile_whatsapp.html (`.rowCols`: "Country" at 36%, the number
 * beside it). The code is stored under `<key>Country`, as on desktop, and a
 * number typed with its own leading "+" overrides it.
 *
 * The select is 16px, not their 12px: anything smaller makes iOS zoom the
 * page when it opens.
 */
export function PhoneFld({
  s,
  id,
  k,
  label,
}: {
  s: FormState;
  id: string;
  k: string;
  label: string;
}) {
  const value = s.values[k] ?? "";
  const dial = s.values[`${k}Country`] ?? dialCodes[0].value;
  return (
    <div className="flex gap-[9.7px]">
      <Fld id={`${id}Cc`} label="Country" className="mt-[12.2px] w-[36%] shrink-0">
        <select
          id={`${id}Cc`}
          value={dial}
          onChange={(e) => s.set(`${k}Country`, e.target.value)}
          className={`${textInput(false)} cursor-pointer appearance-none pr-[12.8px] pl-[13px]`}
        >
          {dialCodes.map((c) => (
            <option key={c.value} value={c.value}>
              {mobileDialLabel(c)}
            </option>
          ))}
        </select>
      </Fld>
      <Fld id={id} label={label} className="mt-[12.2px] min-w-0 flex-1">
        <input
          type="tel"
          id={id}
          name={id}
          value={value}
          placeholder="555 555 0123"
          onChange={(e) => s.set(k, e.target.value)}
          className={textInput(false)}
        />
      </Fld>
    </div>
  );
}

/* ---- Upload ---------------------------------------------------------------- */

export const uploadGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto block h-[21.1px] w-[21.1px] text-faint">
    <path d="M12 13v8" />
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="m8 17 4-4 4 4" />
  </svg>
);

export const trashGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

/**
 * Their `.upl` + `.uplPrv`: a dashed tap target, and once a picture is in, a
 * thumbnail with "Remove". The file goes to R2 the moment it is picked, the
 * same path the desktop drop zone takes.
 */
export function Upload({
  type,
  field,
  value,
  onChange,
  what,
  round,
}: {
  type: string;
  field: Field;
  value: string;
  onChange: (v: string) => void;
  /** "your photo", "your cover image". */
  what: string;
  round?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [adjusting, setAdjusting] = useState(false);
  const { take, clear, error, progress, pending, stored, maxMb } = useFileUpload({
    type,
    field,
    value,
    onChange,
  });
  const src = pending?.src ?? stored?.url ?? stored?.dataUrl;
  const uploading = progress !== null;

  return (
    <>
      <label className="relative mt-[12.2px] block cursor-pointer rounded-[9.7px] border-2 border-dashed border-mc-input-line px-[11.4px] py-[16.2px] text-center">
        {uploadGlyph}
        <span className="mt-[7.9px] block text-[11.36px] leading-[normal] font-semibold text-body">
          {uploading ? (
            `Uploading… ${progress}%`
          ) : (
            <>
              <b className="font-black text-primary">Click to upload</b> {what}
            </>
          )}
        </span>
        <span className="mt-[3.4px] block text-[9.73px] leading-[normal] text-faint">
          PNG, JPG, JPEG · up to {maxMb} MB
        </span>
        <input
          ref={input}
          type="file"
          accept={field.accept}
          className="absolute top-0 left-0 h-px w-px border-0 opacity-0"
          onChange={(e) => {
            take(e.currentTarget.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
      </label>
      {error && (
        <small className="mt-[5.1px] block text-[10.14px] leading-[normal] text-mc-error">{error}</small>
      )}
      {src && (
        <div className="mt-[10.5px] flex items-center">
          <span
            className={`block h-[45.4px] w-[45.4px] shrink-0 overflow-hidden border border-mc-acc-line ${
              round ? "rounded-full" : "rounded-[8.1px]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="block h-full w-full object-cover"
              style={pending ? undefined : cropStyle(stored)}
            />
          </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              clear();
              if (input.current) input.current.value = "";
            }}
            className="ml-[10.5px] flex items-center gap-[4.7px] text-[10.55px] leading-[normal] font-semibold text-mc-error [&>svg]:block [&>svg]:h-[12.7px] [&>svg]:w-[12.7px]"
          >
            {trashGlyph}
            Remove
          </a>
        </div>
      )}
      {/*
        Reposition / zoom — JB, 2026-10-15: keep desktop's adjuster on
        mobile, tucked behind a disclosure so it does not crowd the form.
        Unmocked: the toggle borrows "More Platforms", the panel is the
        desktop ImageAdjuster as is (it already drags by touch).
      */}
      {field.adjustable && stored && src && !uploading && (
        <>
          <a
            href="#"
            aria-expanded={adjusting}
            onClick={(e) => {
              e.preventDefault();
              setAdjusting(!adjusting);
            }}
            className="mt-[10.5px] flex items-center gap-[4.9px] text-[10.95px] leading-[normal] font-bold text-primary"
          >
            Adjust position &amp; zoom
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`block h-[13.1px] w-[13.1px] transition-transform duration-[250ms] ease-out ${adjusting ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </a>
          <Slide open={adjusting}>
            <ImageAdjuster
              shape={field.adjustable}
              stored={stored}
              src={src}
              onChange={(crop) => onChange(JSON.stringify({ ...stored, crop }))}
            />
          </Slide>
        </>
      )}
    </>
  );
}

export const schemaField = (type: string, name: string) =>
  (fieldSchema[type] ?? []).find((f) => f.name === name)!;

export const imageGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);
export const shareGlyph = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

/**
 * A mobile number typed beside a country picker, as their `data-req="wap"`
 * checks it — 5 to 14 digits, no "+" — plus JB's "no duplicate country
 * codes": a number that opens with the picked code's own digits and then
 * runs on for a full national number has had the code typed twice.
 * National numbers practically never begin with their country's code.
 */
export function mobileNumberOk(raw: string | undefined, dial: string | undefined) {
  const v = (raw ?? "").trim();
  const digits = v.replace(/\D/g, "");
  if (digits.length < 5 || digits.length > 14 || v.includes("+")) return false;
  const code = (dial ?? "+1").split("-")[0].replace(/\D/g, "");
  return !(code && digits.startsWith(code) && digits.length - code.length >= 7);
}

/**
 * The visitor's country, guessed from the browser language the way
 * create_mobile_whatsapp.html's script does — or the first code if the
 * language names no region we list.
 */
export function guessDialCode() {
  const region = (navigator.language.split("-")[1] ?? "").toUpperCase();
  return dialCodes.find((c) => c.region === region)?.value ?? dialCodes[0].value;
}

/**
 * Country select + mobile number, as WhatsApp's file lays them out
 * (`.rowCols`: "Country" at 36%). Shared by WhatsApp and SMS (JB: "reuse the
 * WhatsApp international phone-number component"). Writes `phone` and
 * `phoneCountry`, the keys desktop uses; preselects the visitor's country
 * on arrival if none is set yet.
 */
export function IntlNumberFld({
  s,
  ccId,
  numId,
  label,
  tip,
  placeholder = "Enter mobile number",
  hint,
}: {
  s: FormState;
  ccId: string;
  numId: string;
  label: string;
  tip?: { label: string; text: string };
  placeholder?: string;
  /** Their `.fsub` under the number (Phone's file has one). */
  hint?: string;
}) {
  const dial = s.values.phoneCountry ?? dialCodes[0].value;
  const err = s.errors[numId];
  const { values, patch } = s;
  useEffect(() => {
    if (values.phoneCountry !== undefined) return;
    patch((cur) => ({ ...cur, phoneCountry: cur.phoneCountry ?? guessDialCode() }));
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-[9.7px]">
      <Fld id={ccId} label="Country" className="mt-[12.2px] w-[36%] shrink-0">
        <select
          id={ccId}
          value={dial}
          onChange={(e) => s.set("phoneCountry", e.target.value)}
          className={`${textInput(false)} cursor-pointer appearance-none pr-[12.8px] pl-[13px]`}
        >
          {dialCodes.map((c) => (
            <option key={c.value} value={c.value}>
              {mobileDialLabel(c)}
            </option>
          ))}
        </select>
      </Fld>
      <Fld
        id={numId}
        label={label}
        required
        tip={tip}
        error={err}
        // The hint sits where a counter would: after the control, in the .fld.
        counter={hint ? <p className="mt-[3.04px] text-[10.14px] leading-[12.17px] text-muted">{hint}</p> : undefined}
        className="mt-[12.2px] min-w-0 flex-1"
      >
        <input
          type="tel"
          id={numId}
          value={s.values.phone ?? ""}
          placeholder={placeholder}
          aria-invalid={!!err}
          onChange={(e) => s.set("phone", e.target.value)}
          className={textInput(!!err)}
        />
      </Fld>
    </div>
  );
}
