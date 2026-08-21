"use client";

import { BadgeCheck, Upload, Info } from "lucide-react";
import { fieldSchema, fieldLabels, sectionTitles } from "./fieldSchema";
import type { Field } from "./fieldSchema";
import { allTypes } from "./qrTypes";
import { isDynamic } from "./encodeQr";

type Values = Record<string, string>;

const label = (f: Field) => fieldLabels[f.labelKey] ?? f.labelKey;

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
      return <textarea {...common} rows={4} className={`${inputClass} resize-y`} />;

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
        <div className="rounded-lg border border-dashed border-line bg-bg-alt/40 px-4 py-6 text-center">
          <Upload className="mx-auto h-5 w-5 text-faint" />
          <p className="mt-2 text-sm font-medium text-ink">
            Upload a file
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {field.formats ?? "PNG, JPG, JPEG, etc."}
            {field.maxSizeMb ? ` · up to ${field.maxSizeMb}MB` : ""}
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
          {[0, 1].map((i) => (
            <input
              key={i}
              className={inputClass}
              placeholder={i === 0 ? "https://example.com" : "Add another link"}
              value={i === 0 ? value : ""}
              onChange={(e) => i === 0 && onChange(e.target.value)}
            />
          ))}
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
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-ink"
        >
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
  const groups: { key: string; title: string | null; fields: Field[] }[] = [];
  for (const f of fields) {
    const key = f.section ?? "_";
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, title: key === "_" ? null : (sectionTitles[key] ?? key), fields: [] };
      groups.push(g);
    }
    g.fields.push(f);
  }

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

      {isDynamic(type) && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft/60 px-3 py-2 text-sm font-semibold text-brand-dark">
          <BadgeCheck className="h-4 w-4" />
          Smart Tracking &amp; Editing Included
        </p>
      )}

      {/* Fields */}
      <div className="mt-6 space-y-7">
        {groups.map((g) => (
          <section key={g.key}>
            {g.title && (
              <h2 className="mb-3 text-sm font-bold text-ink">{g.title}</h2>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {g.fields.map((f) => (
                <FieldRow
                  key={f.name}
                  field={f}
                  value={values[f.name] ?? ""}
                  onChange={(v) => set(f.name, v)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Name is common to every type */}
        <section className="border-t border-line/80 pt-6">
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
        </section>
      </div>
    </div>
  );
}
