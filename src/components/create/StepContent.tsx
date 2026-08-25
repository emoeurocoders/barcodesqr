"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Upload,
  Info,
  Pencil,
  ChevronDown,
  Contact,
  Image as ImageIcon,
  Phone,
  Building2,
  MapPin,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { hasTracking } from "./encodeQr";
import { InfoTip } from "./InfoTip";

type Values = Record<string, string>;

const label = (f: Field) => fieldLabels[f.labelKey] ?? f.labelKey;

const sectionIcons: Record<string, LucideIcon> = {
  personal: Contact,
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

/**
 * Fields whose `showIf` condition is not met are hidden entirely.
 *
 * Every condition in the schema is written as `{ field, equals | notEquals }`.
 * Reading it as a plain field->value map instead — which is what this did —
 * matched nothing, so vCard's address block and WiFi's password were
 * unreachable rather than conditional.
 */
function visible(f: Field, values: Values) {
  const cond = f.showIf as
    | { field?: string; equals?: unknown; notEquals?: unknown }
    | undefined;
  if (!cond?.field) return true;

  const actual = values[cond.field] ?? "";
  if ("equals" in cond) return actual === cond.equals;
  if ("notEquals" in cond) return actual !== cond.notEquals;
  return true;
}

function FieldControl({
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
  // `placeholderFrom` makes the example follow another field — the payment
  // link shows a PayPal shape once PayPal is the provider.
  const from = field.placeholderFrom;
  const placeholder = from
    ? (from.map[values[from.field] ?? ""] ?? from.fallback ?? field.placeholder)
    : field.placeholder;

  const common = {
    id: field.name,
    className: inputClass,
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
          className={`${inputClass} min-h-[88px] resize-y`}
        />
      );

    case "select":
      return (
        <select {...common} className={`${inputClass} cursor-pointer`}>
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
        <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(String(e.target.checked))}
            className="h-4 w-4 accent-primary"
          />
          {label(field)}
        </label>
      );

    case "file":
      return (
        <div className="rounded-lg border border-dashed border-line bg-bg-alt/40 px-4 py-8 text-center">
          <Upload className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-2 text-sm font-medium text-ink">
            Click to upload or drag &amp; drop your {label(field)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Max size: {field.maxSizeMb ?? 5} MB •{" "}
            {field.formats ?? "PNG, JPG, JPEG, etc."}
          </p>
        </div>
      );

    case "info":
      return (
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-bg px-4 py-3 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          {label(field)}
        </div>
      );

    case "links":
      return (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="https://example.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

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
  const control = (
    <FieldControl
      field={field}
      value={value}
      values={values}
      onChange={onChange}
      dial={dial}
      onDialChange={onDialChange}
    />
  );
  const hint = field.hintKey ? fieldHints[field.hintKey] : undefined;

  if (field.type === "info" || field.type === "checkbox") {
    return <div className={span}>{control}</div>;
  }

  const tip = field.tip ? fieldTips[field.tip] : undefined;

  return (
    <div className={span}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={field.name} className="text-sm font-medium text-ink">
          {label(field)}
          {field.required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        {tip && <InfoTip label={tip} />}
      </div>
      {control}
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
