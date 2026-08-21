"use client";

import { useState } from "react";
import { Frame, Palette, Lock, ChevronDown, Ban } from "lucide-react";
import type { QrStyle } from "./QrPreview";

const colorPresets: { fg: string; bg: string; label: string }[] = [
  { fg: "#0e1311", bg: "#ffffff", label: "Classic" },
  { fg: "#0f766e", bg: "#ecfdf5", label: "Teal" },
  { fg: "#11b1a7", bg: "#ffffff", label: "Brand" },
  { fg: "#7c2d12", bg: "#fff7ed", label: "Rust" },
  { fg: "#dc2626", bg: "#fef2f2", label: "Red" },
  { fg: "#1e3a8a", bg: "#eff6ff", label: "Navy" },
  { fg: "#2563eb", bg: "#ffffff", label: "Blue" },
  { fg: "#7c3aed", bg: "#f5f3ff", label: "Violet" },
];

const dotStyles: { value: QrStyle["dots"]; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "extra-rounded", label: "Extra" },
];

const cornerStyles: { value: QrStyle["corners"]; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Dot" },
];

const frames: { value: string | null; label: string }[] = [
  { value: null, label: "None" },
  { value: "bottom", label: "Caption below" },
  { value: "top", label: "Caption above" },
  { value: "border", label: "Bordered" },
  { value: "rounded", label: "Rounded" },
];

function Section({
  icon: Icon,
  title,
  desc,
  children,
  defaultOpen = false,
}: {
  icon: typeof Frame;
  title: string;
  desc: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-xl border border-line/80 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bg-alt/70 text-body">
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-ink">{title}</span>
          <span className="block text-xs text-muted">{desc}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-line/80 px-4 py-4">{children}</div>
      )}
    </section>
  );
}

const swatchRow = "flex flex-wrap gap-2";

export function StepCustomize({
  style,
  setStyle,
  password,
  setPassword,
}: {
  style: QrStyle;
  setStyle: (s: QrStyle) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
  const [locked, setLocked] = useState(false);
  const set = <K extends keyof QrStyle>(k: K, v: QrStyle[K]) =>
    setStyle({ ...style, [k]: v });

  return (
    <div className="min-w-0 flex-1 space-y-3">
      <Section
        icon={Frame}
        title="Frame"
        desc="Add a stylish frame around your QR code"
        defaultOpen
      >
        <p className="text-sm font-medium text-ink">Frame around the QR code</p>
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {frames.map((f) => {
            const on = style.frame === f.value;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => set("frame", f.value)}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-colors ${
                  on
                    ? "border-primary bg-[#eff4ff]"
                    : "border-line bg-white hover:bg-bg-alt/40"
                }`}
              >
                {f.value === null ? (
                  <Ban className="h-4 w-4 text-faint" />
                ) : (
                  <span className="h-4 w-4 rounded-sm border-2 border-current text-body" />
                )}
                <span className="text-[11px] font-medium text-body">
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>

        {style.frame && (
          <div className="mt-4">
            <label htmlFor="caption" className="text-sm font-medium text-ink">
              Caption
            </label>
            <input
              id="caption"
              maxLength={20}
              value={style.caption}
              onChange={(e) => set("caption", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        <p className="mt-5 text-sm font-medium text-ink">Color presets</p>
        <div className={`mt-2.5 ${swatchRow}`}>
          {colorPresets.map((p) => {
            const on = style.fg === p.fg && style.bg === p.bg;
            return (
              <button
                key={p.label}
                type="button"
                title={p.label}
                aria-label={p.label}
                onClick={() => setStyle({ ...style, fg: p.fg, bg: p.bg })}
                className={`flex cursor-pointer overflow-hidden rounded-md border-2 transition-colors ${
                  on ? "border-primary" : "border-line"
                }`}
              >
                <span className="h-7 w-7" style={{ background: p.fg }} />
                <span className="h-7 w-7" style={{ background: p.bg }} />
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        icon={Palette}
        title="Customization"
        desc="Add unique shapes, colors & texts to your QR"
      >
        <p className="text-sm font-medium text-ink">Dot shape</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {dotStyles.map((d) => {
            const on = style.dots === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => set("dots", d.value)}
                className={`cursor-pointer rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors ${
                  on
                    ? "border-primary bg-[#eff4ff] text-primary-dark"
                    : "border-line bg-white text-body hover:bg-bg-alt/40"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-medium text-ink">Corner shape</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {cornerStyles.map((c) => {
            const on = style.corners === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => set("corners", c.value)}
                className={`cursor-pointer rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors ${
                  on
                    ? "border-primary bg-[#eff4ff] text-primary-dark"
                    : "border-line bg-white text-body hover:bg-bg-alt/40"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fg" className="text-sm font-medium text-ink">
              Foreground
            </label>
            <input
              id="fg"
              type="color"
              value={style.fg}
              onChange={(e) => set("fg", e.target.value)}
              className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-line bg-white"
            />
          </div>
          <div>
            <label htmlFor="bg" className="text-sm font-medium text-ink">
              Background
            </label>
            <input
              id="bg"
              type="color"
              value={style.bg}
              onChange={(e) => set("bg", e.target.value)}
              className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-line bg-white"
            />
          </div>
        </div>
      </Section>

      <Section
        icon={Lock}
        title="Password protection"
        desc="Ask for a password before the content opens"
      >
        <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={locked}
            onChange={(e) => {
              setLocked(e.target.checked);
              if (!e.target.checked) setPassword("");
            }}
            className="h-4 w-4 accent-primary"
          />
          Require a password
        </label>

        {locked && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-2 text-xs text-muted">
              Password protection applies to dynamic codes once hosting is
              connected.
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
