"use client";

import { useState } from "react";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { primaryTypes, secondaryTypes } from "./qrTypes";
import type { CreateQrType } from "./qrTypes";
import { PreviewPanel } from "./PreviewPanel";

function TypeRow({
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
    <li>
      <label
        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
          selected
            ? "border-primary bg-[#eff4ff]"
            : "border-line/80 bg-white hover:border-line hover:bg-bg-alt/40"
        }`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bg-alt/70">
          <Icon className="h-5 w-5" style={{ color: type.color }} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[15px] font-bold ${
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
          <span className="mt-0.5 block text-[13px] text-muted">
            {type.desc}
          </span>
        </span>

        <input
          type="radio"
          name="qrType"
          value={type.value}
          checked={selected}
          onChange={onSelect}
          className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
        />
      </label>
    </li>
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
    <li>
      <label
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-2 py-3.5 text-center transition-colors ${
          selected
            ? "border-primary bg-[#eff4ff]"
            : "border-line/80 bg-white hover:border-line hover:bg-bg-alt/40"
        }`}
      >
        <Icon className="h-5 w-5" style={{ color: type.color }} />
        <span
          className={`text-xs font-semibold ${
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
    </li>
  );
}

export function TypePicker() {
  const [selected, setSelected] = useState("website");

  return (
    <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.7fr_1fr] lg:gap-10">
      {/* Type selection */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          What do you want to create?
        </h1>
        <p className="mt-2 text-muted">
          Select a QR code type to get started in seconds.
        </p>

        <ul className="mt-6 space-y-2.5">
          {primaryTypes.map((type) => (
            <TypeRow
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => setSelected(type.value)}
            />
          ))}
        </ul>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-primary"
          >
            More QR Types
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {secondaryTypes.map((type) => (
            <TypeTile
              key={type.value}
              type={type}
              selected={selected === type.value}
              onSelect={() => setSelected(type.value)}
            />
          ))}
          <li>
            <button
              type="button"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-line/80 bg-white px-2 py-3.5 text-center transition-colors hover:border-line hover:bg-bg-alt/40"
            >
              <LayoutGrid className="h-5 w-5 text-faint" />
              <span className="text-xs font-semibold text-body">See All</span>
            </button>
          </li>
        </ul>
      </div>

      <PreviewPanel />
    </div>
  );
}
