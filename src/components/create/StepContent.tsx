"use client";

import { useRef, useState } from "react";
import {
  BadgeCheck,
  CloudUpload,
  File as FileIcon,
  Info,
  Pencil,
  ChevronDown,
  Image as ImageIcon,
  Phone,
  Building2,
  MapPin,
  Plus,
  Share2,
  Trash2,
  Link as LinkIcon,
  X,
} from "lucide-react";
import {
  fieldSchema,
  fieldLabels,
  fieldTips,
  fieldHints,
  dialCodes,
  sections as sectionMeta,
} from "./fieldSchema";
import type { Field } from "./fieldSchema";
import { allTypes } from "./qrTypes";
import type { QrTypeIcon } from "./qrTypes";
import { hasTracking } from "./encodeQr";
import { InfoTip } from "./InfoTip";
import { ContactIcon } from "@/components/ui/CreatorIcons";
import { fieldError, isValidUrl, errorCopy, visible } from "./validate";
import {
  parseStoredFile,
  parseLinks,
  type StoredLink,
} from "./storedValues";

type Values = Record<string, string>;

const label = (f: Field) => fieldLabels[f.labelKey] ?? f.labelKey;

/** Section glyphs. Not all are lucide — see `CreatorIcons`. */
const sectionIcons: Record<string, QrTypeIcon> = {
  personal: ContactIcon,
  photo: ImageIcon,
  contact: Phone,
  company: Building2,
  address: MapPin,
  social: Share2,
  info: Pencil,
  basic: Pencil,
  links: LinkIcon,
  image: ImageIcon,
};

// 16px below `md`, as on the creator: anything smaller makes iOS Safari zoom
// the page on focus. Back to 14px once there is room for it.
const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-faint shadow-soft transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 md:text-sm";

/** The same control once its value has failed validation. */
const invalidInputClass =
  "w-full rounded-lg border border-error bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-faint shadow-soft transition-colors focus:border-error focus:outline-none focus:ring-2 focus:ring-error/20 disabled:opacity-50 md:text-sm";

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs font-medium text-error">{children}</p>;
}

/** The teal pill above the first section of every tracked format. */
const TRACKING_TIP =
  "This is a dynamic QR code — you can edit where it points anytime (even after printing) and track every scan.";

function TrackingBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand">
      <BadgeCheck className="h-4 w-4" />
      Smart Tracking &amp; Editing Included
      <InfoTip label={TRACKING_TIP} />
    </div>
  );
}

/** Right-aligned character count, which sits under its control. */
function Counter({ value, max }: { value: string; max: number }) {
  return (
    <div className="mt-1 text-right text-xs text-faint">
      {value.length}/{max}
    </div>
  );
}

// `visible` moved to validate.ts — the wizard's Next gate needs the same
// answer to what is on screen as the renderer.

/** Does a picked/dropped file satisfy the field's `accept` list? */
function matchesAccept(file: File, accept?: string) {
  const wanted = (accept ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!wanted.length) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return wanted.some((a) =>
    a.startsWith(".")
      ? name.endsWith(a)
      : a.endsWith("/*")
        ? type.startsWith(a.slice(0, -1))
        : type === a,
  );
}

function humanSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Reads a file into the JSON shape `storedValues` defines. */
function readFileValue(file: File, onDone: (json: string) => void) {
  const meta = { name: file.name, size: file.size };
  if (!file.type.toLowerCase().startsWith("image/")) {
    onDone(JSON.stringify(meta));
    return;
  }
  // Images carry a data URL so the phone preview can actually show them.
  const reader = new FileReader();
  reader.onload = () =>
    onDone(JSON.stringify({ ...meta, dataUrl: reader.result }));
  reader.onerror = () => onDone(JSON.stringify(meta));
  reader.readAsDataURL(file);
}

/**
 * Click-to-upload and drag & drop, with the type and size limits from the
 * schema enforced on the way in. The file stays in memory (see storedValues) —
 * pushing it to storage is save-time work once R2 exists.
 */
function FileControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const stored = parseStoredFile(value);
  const maxMb = field.maxSizeMb ?? 5;

  const take = (file: File | undefined | null) => {
    if (!file) return;
    if (!matchesAccept(file, field.accept)) {
      setError(
        `That file type isn't supported — use ${field.formats ?? "a supported format"}.`,
      );
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setError(`This file is too large — the maximum size is ${maxMb} MB.`);
      return;
    }
    setError(null);
    readFileValue(file, onChange);
  };

  const clear = (e: React.MouseEvent) => {
    // Inside a <label>: without preventDefault the click would also re-open
    // the file picker.
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          take(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary-soft/30"
            : error
              ? "border-error bg-bg hover:border-error"
              : "border-line bg-bg hover:border-primary/50"
        }`}
      >
        {stored ? (
          <div className="flex w-full items-center gap-3 text-left">
            {stored.dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stored.dataUrl}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover"
              />
            ) : (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-line bg-white">
                <FileIcon className="h-6 w-6 text-primary" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">
                {stored.name}
              </span>
              <span className="block text-xs text-muted">
                {humanSize(stored.size)} • Click or drop a file to replace
              </span>
            </span>
            <button
              type="button"
              onClick={clear}
              aria-label="Remove file"
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <CloudUpload className="h-7 w-7 text-primary" />
            <span className="text-sm font-medium text-ink">
              Click to upload or drag &amp; drop your {label(field)}
            </span>
            <span className="text-xs text-muted">
              Max size: {maxMb} MB •{" "}
              {field.formats ?? "PNG, JPG, JPEG, etc."}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={field.accept}
          className="hidden"
          onChange={(e) => {
            take(e.currentTarget.files?.[0]);
            // Reset so picking the same file again still fires onChange.
            e.currentTarget.value = "";
          }}
        />
      </label>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  );
}

const emptyLink: StoredLink = { name: "", url: "" };

/**
 * The multi-link editor: any number of rows, each an optional logo, a name
 * and a URL, serialised back into the flat values map as JSON.
 */
function LinksControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parsed = parseLinks(value);
  const rows = parsed.length ? parsed : [emptyLink];
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [logoError, setLogoError] = useState<string | null>(null);

  const write = (next: StoredLink[]) => onChange(JSON.stringify(next));
  const update = (i: number, patch: Partial<StoredLink>) =>
    write(rows.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const takeLogo = (i: number, file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.toLowerCase().startsWith("image/")) {
      setLogoError("Logos must be images — PNG, JPG, JPEG, etc.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("This logo is too large — the maximum size is 2 MB.");
      return;
    }
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => update(i, { logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {rows.map((row, i) => {
        const urlBad =
          touched[i] && row.url.trim() !== "" && !isValidUrl(row.url);
        return (
          <div key={i} className="rounded-xl border border-line bg-bg p-3">
            <div className="flex items-start gap-3">
              <label
                title={fieldLabels.linkLogo}
                className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-line bg-white transition-colors hover:border-primary/50"
              >
                {row.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.logo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-faint" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    takeLogo(i, e.currentTarget.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                />
              </label>

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className={inputClass}
                  placeholder={fieldLabels.linkName}
                  maxLength={40}
                  value={row.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                />
                <input
                  type="url"
                  className={urlBad ? invalidInputClass : inputClass}
                  placeholder="https://example.com"
                  maxLength={200}
                  value={row.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, [i]: true }))}
                />
                {urlBad && <ErrorText>{errorCopy.url}</ErrorText>}
              </div>

              <button
                type="button"
                aria-label={fieldLabels.removeLink}
                onClick={() => write(rows.filter((_, j) => j !== i))}
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-bg-alt hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

      {logoError && <ErrorText>{logoError}</ErrorText>}

      <button
        type="button"
        onClick={() => write([...rows, emptyLink])}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary-soft/20"
      >
        <Plus className="h-4 w-4" />
        {fieldLabels.addLink}
      </button>
    </div>
  );
}

function FieldControl({
  field,
  value,
  values,
  onChange,
  dial,
  onDialChange,
  invalid,
}: {
  field: Field;
  value: string;
  values: Values;
  onChange: (v: string) => void;
  dial: string;
  onDialChange: (v: string) => void;
  invalid?: boolean;
}) {
  // `placeholderFrom` makes the example follow another field — the payment
  // link shows a PayPal shape once PayPal is the provider.
  const from = field.placeholderFrom;
  const placeholder = from
    ? (from.map[values[from.field] ?? ""] ?? from.fallback ?? field.placeholder)
    : field.placeholder;

  const baseClass = invalid ? invalidInputClass : inputClass;

  const common = {
    id: field.name,
    className: baseClass,
    placeholder,
    maxLength: field.maxLength,
    value,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange(e.target.value),
  };

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          {...common}
          className={`${baseClass} min-h-[88px] resize-y`}
        />
      );

    case "select":
      return (
        <select {...common} className={`${baseClass} cursor-pointer`}>
          {field.placeholder && (
            <option value="" disabled>
              {field.placeholder}
            </option>
          )}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );

    // A dial-code picker welded to the number, so the country is never
    // guessed from whatever the user happened to type.
    case "phone-intl":
      return (
        <div className="flex gap-2">
          <select
            aria-label="Country code"
            className={`${inputClass} w-[104px] shrink-0 cursor-pointer px-2 text-sm`}
            value={dial}
            onChange={(e) => onDialChange(e.target.value)}
          >
            {dialCodes.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input {...common} type="tel" />
        </div>
      );

    case "segment":
      return (
        <div className="flex gap-2">
          {field.options?.map((o) => {
            const on = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange(o.value)}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  on
                    ? "border-primary bg-[#eff4ff] text-primary-dark"
                    : "border-line bg-white text-body hover:bg-bg-alt/50"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2.5 py-1 text-sm text-ink">
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(String(e.target.checked))}
            className="h-4 w-4 rounded border-line text-primary focus:ring-primary/30"
          />
          {label(field)}
        </label>
      );

    case "file":
      return <FileControl field={field} value={value} onChange={onChange} />;

    case "info":
      return (
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-bg px-4 py-3 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>{label(field)}</span>
        </div>
      );

    case "links":
      return <LinksControl value={value} onChange={onChange} />;

    default:
      return (
        <input
          {...common}
          type={
            field.type === "datetime-local" || field.type === "date"
              ? field.type
              : field.type === "email"
                ? "email"
                : field.type === "tel"
                  ? "tel"
                  : field.type === "url"
                    ? "url"
                    : "text"
          }
        />
      );
  }
}

function FieldRow({
  field,
  value,
  values,
  onChange,
  dial,
  onDialChange,
}: {
  field: Field;
  value: string;
  values: Values;
  onChange: (v: string) => void;
  dial: string;
  onDialChange: (v: string) => void;
}) {
  const span = field.half ? "sm:col-span-1" : "col-span-full";

  // Errors wait for the first blur — nobody wants "invalid URL" while still
  // typing "htt". The file and links controls surface their own messages.
  const [touched, setTouched] = useState(false);
  const selfReporting = field.type === "file" || field.type === "links";
  const error = touched && !selfReporting ? fieldError(field, value) : null;

  const control = (
    <FieldControl
      field={field}
      value={value}
      values={values}
      onChange={onChange}
      dial={dial}
      onDialChange={onDialChange}
      invalid={!!error}
    />
  );
  const hint = field.hintKey ? fieldHints[field.hintKey] : undefined;

  if (field.type === "info" || field.type === "checkbox") {
    return <div className={span}>{control}</div>;
  }

  const tip = field.tip ? fieldTips[field.tip] : undefined;

  return (
    <div className={span} onBlur={() => setTouched(true)}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={field.name} className="text-sm font-medium text-ink">
          {label(field)}
          {field.required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        {tip && <InfoTip label={tip} />}
      </div>
      {control}
      {error && <ErrorText>{error}</ErrorText>}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {field.maxLength && <Counter value={value} max={field.maxLength} />}
    </div>
  );
}

function Section({
  sectionKey,
  fields,
  values,
  set,
  open,
  onToggle,
  showTrackingBadge,
}: {
  sectionKey: string;
  fields: Field[];
  values: Values;
  set: (k: string, v: string) => void;
  open: boolean;
  onToggle: () => void;
  showTrackingBadge: boolean;
}) {
  const meta = sectionMeta[sectionKey];
  const Icon = sectionIcons[sectionKey] ?? Info;

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-bg-alt/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bg-alt text-ink">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">
            {meta?.title ?? sectionKey}
          </span>
          <span className="block truncate text-xs text-muted">
            {meta?.desc}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-4 py-4">
          <div className="space-y-4">
            {showTrackingBadge && <TrackingBadge />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <FieldRow
                  key={f.name}
                  field={f}
                  value={values[f.name] ?? ""}
                  values={values}
                  onChange={(v) => set(f.name, v)}
                  dial={values[`${f.name}Country`] ?? dialCodes[0].value}
                  onDialChange={(v) => set(`${f.name}Country`, v)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function StepContent({
  type,
  values,
  setValues,
  name,
  setName,
}: {
  type: string;
  values: Values;
  setValues: (v: Values) => void;
  name: string;
  setName: (v: string) => void;
}) {
  const meta = allTypes.find((t) => t.value === type);
  const fields = (fieldSchema[type] ?? []).filter((f) => visible(f, values));
  // The creator introduces a couple of formats with a different glyph here
  // than in step 1's list; fall back to the list icon when it does not.
  const Icon = meta?.stepIcon ?? meta?.icon;

  // Preserve the schema's order while collecting each section's fields.
  const groups: { key: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const key = f.section ?? "_";
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, fields: [] };
      groups.push(g);
    }
    g.fields.push(f);
  }

  const sectioned = groups.filter((g) => g.key !== "_");
  const loose = groups.find((g) => g.key === "_");

  // The first section starts open, the rest collapsed, as on the live creator.
  const [openKey, setOpenKey] = useState<string | null>(
    sectioned[0]?.key ?? null,
  );

  const set = (k: string, v: string) => setValues({ ...values, [k]: v });

  return (
    <>
      {/* Type header. The glyph is neutral here — the colour in step 1's list
          is what tells the formats apart; by step 2 you have already chosen. */}
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
        {/* No `shrink-0` on the tile: the creator lets it squeeze at narrow
            widths rather than steal room from the title. */}
        {Icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-bg-alt text-ink">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold tracking-heading text-ink">
            {meta?.stepLabel ?? meta?.label ?? type}
          </h2>
          <p className="text-sm text-muted">{meta?.stepDesc ?? meta?.desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          {/* Types without sections show their fields directly. */}
          {loose && (
            <div className="space-y-4">
              {hasTracking(type) && <TrackingBadge />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {loose.fields.map((f) => (
                  <FieldRow
                    key={f.name}
                    field={f}
                    value={values[f.name] ?? ""}
                    values={values}
                    onChange={(v) => set(f.name, v)}
                    dial={values[`${f.name}Country`] ?? dialCodes[0].value}
                    onDialChange={(v) => set(`${f.name}Country`, v)}
                  />
                ))}
              </div>
            </div>
          )}

          {sectioned.map((g, i) => (
            <Section
              key={g.key}
              sectionKey={g.key}
              fields={g.fields}
              values={values}
              set={set}
              open={openKey === g.key}
              onToggle={() => setOpenKey(openKey === g.key ? null : g.key)}
              showTrackingBadge={i === 0 && !loose && hasTracking(type)}
            />
          ))}
        </div>

        {/* Name is common to every type */}
        <div className="border-t border-line pt-5">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="qrName" className="text-sm font-medium text-ink">
              Name your QR Code
            </label>
            <InfoTip label="Only you can see this — it helps you find the code later." />
          </div>
          <input
            id="qrName"
            className={inputClass}
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Counter value={name} max={40} />
        </div>
      </div>
    </>
  );
}
