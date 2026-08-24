"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Upload,
  Info,
  ChevronDown,
  Contact,
  Image as ImageIcon,
  Phone,
  Building2,
  MapPin,
  Share2,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fieldSchema, fieldLabels, sections as sectionMeta } from "./fieldSchema";
import type { Field } from "./fieldSchema";
import { allTypes } from "./qrTypes";
import { isDynamic } from "./encodeQr";

type Values = Record<string, string>;

const label = (f: Field) => fieldLabels[f.labelKey] ?? f.labelKey;

const sectionIcons: Record<string, LucideIcon> = {
  personal: Contact,
  photo: ImageIcon,
  contact: Phone,
  company: Building2,
  address: MapPin,
  social: Share2,
  info: Info,
  basic: FileText,
  links: LinkIcon,
  image: ImageIcon,
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/** Fields whose `showIf` condition is not met are hidden entirely. */
function visible(f: Field, values: Values) {
  if (!f.showIf) return true;
  return Object.entries(f.showIf).every(([k, expected]) => {
    const actual = values[k] ?? "";
    if (Array.isArray(expected)) return expected.includes(actual);
    if (typeof expected === "boolean") return (actual === "true") === expected;
    return actual === expected;
  });
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const common = {
    id: field.name,
    className: inputClass,
    placeholder: field.placeholder,
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
        <textarea {...common} rows={4} className={`${inputClass} resize-y`} />
      );

    case "select":
      return (
        <select {...common} className={`${inputClass} cursor-pointer`}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
          <p className="mt-2 text-[11px] text-faint">
            Uploads arrive with the hosting service.
          </p>
        </div>
      );

    case "info":
      return (
        <p className="flex items-start gap-2 rounded-lg bg-bg-alt/60 px-3 py-2.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
          {label(field)}
        </p>
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
                : field.type === "tel" || field.type === "phone-intl"
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
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "info" || field.type === "checkbox") {
    return (
      <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
        <FieldControl field={field} value={value} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={field.name} className="text-sm font-medium text-ink">
          {label(field)}
          {field.required && <span className="ml-0.5 text-danger">*</span>}
        </label>
        {field.maxLength && (
          <span className="text-[11px] text-faint">
            {value.length}/{field.maxLength}
          </span>
        )}
      </div>
      <div className="mt-1.5">
        <FieldControl field={field} value={value} onChange={onChange} />
      </div>
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
    <section className="overflow-hidden rounded-xl border border-line/80 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bg-alt/70 text-body">
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-ink">
            {meta?.title ?? sectionKey}
          </span>
          <span className="block text-xs text-muted">{meta?.desc}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-line/80 px-4 py-4">
          {showTrackingBadge && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft/60 px-3 py-2 text-sm font-semibold text-brand-dark">
              <BadgeCheck className="h-4 w-4" />
              Smart Tracking &amp; Editing Included
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <FieldRow
                key={f.name}
                field={f}
                value={values[f.name] ?? ""}
                onChange={(v) => set(f.name, v)}
              />
            ))}
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
  const Icon = meta?.icon;

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
    <div className="min-w-0 flex-1">
      {/* Type header */}
      <div className="flex items-center gap-3 border-b border-line/80 pb-4">
        {Icon && (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bg-alt/70">
            <Icon className="h-6 w-6" style={{ color: meta?.color }} />
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold text-ink">{meta?.label ?? type}</h1>
          <p className="text-sm text-muted">{meta?.desc}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {/* Types without sections show their fields directly. */}
        {loose && (
          <div>
            {isDynamic(type) && (
              <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft/60 px-3 py-2 text-sm font-semibold text-brand-dark">
                <BadgeCheck className="h-4 w-4" />
                Smart Tracking &amp; Editing Included
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {loose.fields.map((f) => (
                <FieldRow
                  key={f.name}
                  field={f}
                  value={values[f.name] ?? ""}
                  onChange={(v) => set(f.name, v)}
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
            showTrackingBadge={i === 0 && !loose && isDynamic(type)}
          />
        ))}

        {/* Name is common to every type */}
        <div className="border-t border-line/80 pt-5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="qrName" className="text-sm font-medium text-ink">
              Name your QR Code
            </label>
            <span className="text-[11px] text-faint">{name.length}/40</span>
          </div>
          <input
            id="qrName"
            className={`${inputClass} mt-1.5`}
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
