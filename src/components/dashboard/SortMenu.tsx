"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import type { DashboardSort } from "@/app/dashboard/page";

/**
 * The "Date created" control. The mockup draws only the closed control, so
 * the menu is unmocked — it borrows the row menu's card. See LAUNCH.md.
 * Each option is a link, so the choice lives in the URL and survives refresh.
 */
const options: { value: DashboardSort; label: string }[] = [
  { value: "newest", label: "Date created" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A–Z)" },
];

export function SortMenu({ sort, q }: { sort: DashboardSort; q: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const current = options.find((o) => o.value === sort) ?? options[0];
  const href = (value: DashboardSort) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (value !== "newest") p.set("sort", value);
    const s = p.toString();
    return s ? `/dashboard?${s}` : "/dashboard";
  };

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink transition-colors hover:bg-bg-alt/60"
      >
        {current.label}
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-pop">
          {options.map((o) => (
            <Link
              key={o.value}
              role="menuitem"
              href={href(o.value)}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-ink hover:bg-bg-alt"
            >
              {o.label}
              {o.value === sort && <Check className="h-4 w-4 text-primary" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
