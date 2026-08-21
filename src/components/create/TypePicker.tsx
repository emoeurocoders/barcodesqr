"use client";

import { useState } from "react";
import { Check, ChevronDown, MoreHorizontal } from "lucide-react";
import { primaryTypes, secondaryTypes } from "./qrTypes";
import type { CreateQrType } from "./qrTypes";
import { PreviewPanel } from "./PreviewPanel";

/** Filled circle + tick when chosen, hollow ring otherwise. */
function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
        selected
          ? "border-primary bg-primary text-white"
          : "border-line bg-white"
      }`}
    >
      {selected && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
  );
}

function TypeCard({
  type,
  selected,
  onSelect,
}: {
  type: CreateQrType;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = type.icon;
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
        selected
          ? "border-primary bg-[#eff4ff]"
          : "border-line/80 bg-white hover:border-line hover:bg-bg-alt/40"
      }`}
    >
      <Icon className="mt-0.5 h-[25px] w-[25px] shrink-0" style={{ color: type.color }} />

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`text-[15px] font-bold leading-tight ${
              selected ? "text-primary-dark" : "text-ink"
            }`}
          >
            {type.label}
          </span>
          {type.tag && (
            <span className="rounded-full bg-[#dff3f0] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#0d8a82]">
              {type.tag}
            </span>
          )}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-muted">
          {type.desc}
        </span>
      </span>

      <RadioDot selected={selected} />
      <input
        type="radio"
        name="qrType"
        value={type.value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
    </label>
  );
}

function TypeTile({
  type,
  selected,
  onSelect,
}: {
  type: CreateQrType;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = type.icon;
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border px-[5px] py-[13px] text-center transition-colors ${
        selected
          ? "border-primary bg-[#eff4ff]"
          : "border-line/80 bg-white hover:border-line hover:bg-bg-alt/40"
      }`}
    >
      <Icon className="h-[25px] w-[25px]" style={{ color: type.color }} />
      <span
        className={`text-xs font-semibold leading-tight ${
          selected ? "text-primary-dark" : "text-body"
        }`}
      >
        {type.label}
      </span>
      <input
        type="radio"
        name="qrType"
        value={type.value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
    </label>
  );
}

export function TypePicker() {
  const [selected, setSelected] = useState("website");

  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start">
      {/* Type selection */}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[34px] sm:leading-tight">
          What do you want to create?
        </h1>
        <p className="mt-2 text-muted">
          Select a QR code type to get started in seconds.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {primaryTypes.map((type) => (
            <TypeCard
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => setSelected(type.value)}
            />
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-primary"
          >
            More QR Types
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 xl:grid-cols-9">
          {secondaryTypes.map((type) => (
            <TypeTile
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => setSelected(type.value)}
            />
          ))}
          <button
            type="button"
            className="flex cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border border-line/80 bg-white px-[5px] py-[13px] text-center transition-colors hover:border-line hover:bg-bg-alt/40"
          >
            <MoreHorizontal className="h-[25px] w-[25px] text-faint" />
            <span className="text-xs font-semibold leading-tight text-body">
              See All
            </span>
          </button>
        </div>
      </div>

      <PreviewPanel />
    </div>
  );
}
