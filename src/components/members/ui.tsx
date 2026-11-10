"use client";

import { useActionState, useState, useSyncExternalStore, useTransition } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

import { MenuButton } from "./MembersShell";

/**
 * member_myaccount / member_billing.html's parts (`#mainApp.accApp`), sizes
 * straight from their CSS.
 */

/**
 * A server action behind a form, submitted by hand: React resets a form's
 * fields after an `action={…}` submission, which wiped what was typed after
 * an error and put old values back after a save. Called from onSubmit, the
 * action leaves the fields as they are.
 */
export function useForm<S>(action: (prev: Awaited<S>, form: FormData) => Promise<S>, init: Awaited<S>) {
  const [state, run, busy] = useActionState<S, FormData>(action, init);
  const [, start] = useTransition();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    start(() => run(form));
  };
  return [state, onSubmit, busy] as const;
}

/* ---- Buttons: `.btn.genBtn7/8` + `.btnC3/C5/C6/accBtnRo/accBtnR` ---------- */

const size = {
  // genBtn7: 15px, 0.8em 1.8em; genBtn8: 14px, 0.8em 1.1em; radius 0.7em.
  md: "text-[15px] px-[27px] py-[12px] rounded-[10.5px]",
  sm: "text-[14px] px-[15.4px] py-[11.2px] rounded-[9.8px]",
};
const tone = {
  primary: "bg-[#2563eb] text-white hover:bg-[#1855db]",
  outline: "border border-[#2563eb] bg-white text-[#2563eb] hover:bg-[#2563eb] hover:text-white",
  grey: "border border-[#d7dde2] bg-white text-[#374151] hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white",
  redOutline: "border border-[#f1aeae] bg-white text-[#dc2626] hover:border-[#dc2626] hover:bg-[#fef2f2]",
  red: "bg-[#dc2626] text-white hover:bg-[#c81e1e]",
};
export const btn = (t: keyof typeof tone, s: keyof typeof size = "md") =>
  `inline-flex cursor-pointer items-center justify-center gap-[0.55em] leading-[1em] font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45 [&>svg]:h-[1.14em] [&>svg]:w-[1.14em] [&>svg]:shrink-0 ${size[s]} ${tone[t]}`;

/** Their `.btn .spn`: the spinner a busy button shows. */
export const Spinner = () => (
  <span className="block h-[1em] w-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />
);

/* ---- Page header + tabs: `.top`, `.accTabs` -------------------------------- */

export function PageTop({ title, tabs }: { title: string; tabs: { id: string; label: string }[] }) {
  // Their script: a hash on arrival picks the tab (no scroll), a click
  // scrolls to the card and flashes it.
  const hash = useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    () => window.location.hash.slice(1),
    () => "",
  );
  const [picked, setPicked] = useState<string | null>(null);
  const cur = picked ?? (tabs.some((t) => t.id === hash) ? hash : tabs[0]?.id);
  const go = (id: string) => {
    setPicked(id);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.dataset.hl = "1";
    window.setTimeout(() => delete el.dataset.hl, 1400);
    history.replaceState(null, "", `#${id}`);
  };
  return (
    <>
      <div className="flex min-h-[46px] flex-wrap items-center">
        <MenuButton />
        <h1 className="text-[28px] font-extrabold tracking-[-0.025em] text-black max-[576px]:text-[24px] max-[380px]:text-[21px]">{title}</h1>
      </div>
      <ul className="mt-[12px] flex overflow-x-auto shadow-[inset_0_-1px_0_#dae0e8] [scrollbar-width:none]">
        {tabs.map((t) => (
          <li key={t.id} className="shrink-0 [&+&]:ml-[6px] max-[576px]:[&+&]:ml-[2px]">
            <a
              href={`#${t.id}`}
              aria-current={cur === t.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(t.id);
              }}
              className={`block rounded-t-[8px] border-b-2 px-[16px] pt-[10px] pb-[11px] text-[15px] whitespace-nowrap focus-visible:outline-offset-[-2px] max-[576px]:px-[12px] max-[380px]:px-[8px] max-[380px]:text-[14px] ${
                cur === t.id ? "border-[#2563eb] font-semibold text-[#2563eb]" : "border-transparent font-medium text-[#4b5563] hover:bg-[#f5f7f9] hover:text-[#0e1311]"
              }`}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---- Cards: `.accCrd`, `.hd` ----------------------------------------------- */

export function Card({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-[16px] rounded-[16px] border border-[#dae0e8] bg-white px-[22px] pt-[20px] pb-[22px] shadow-[0_1px_1px_rgba(14,19,17,0.04)] transition-[border-color,box-shadow] duration-[250ms] ease-out data-[hl]:border-[#2563eb] data-[hl]:shadow-[0_0_0_3px_rgba(37,99,235,0.14)] max-[576px]:px-[16px] max-[576px]:pt-[16px] max-[576px]:pb-[18px] [&+&]:mt-[16px]"
    >
      {children}
    </section>
  );
}

const icoTone = { blue: "bg-[#eff4ff] text-[#2563eb]", teal: "bg-[#e6f7f5] text-[#11b1a7]", purple: "bg-[#f3eefc] text-[#9333ea]" };

export function CardHead({ icon, tone: t = "blue", title, sub }: { icon: ReactNode; tone?: keyof typeof icoTone; title: string; sub?: string }) {
  return (
    <div className="flex items-center">
      <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[13px] max-[576px]:h-[46px] max-[576px]:w-[46px] max-[576px]:rounded-[12px] [&>svg]:h-[24px] [&>svg]:w-[24px] max-[576px]:[&>svg]:h-[22px] max-[576px]:[&>svg]:w-[22px] ${icoTone[t]}`}>
        {icon}
      </div>
      <div className="min-w-0 pl-[16px] max-[576px]:pl-[12px]">
        <h2 className="text-[19px] font-bold tracking-[-0.015em] text-[#0e1311] max-[576px]:text-[18px]">{title}</h2>
        {sub && <p className="mt-[0.3em] text-[14.5px] text-[#6b7280] max-[576px]:text-[14px] max-[576px]:font-medium">{sub}</p>}
      </div>
    </div>
  );
}

/* ---- Bits ------------------------------------------------------------------ */

/** `.accStt`: the status pill. */
const sttTone = {
  ok: "bg-[#e3f5e9] text-[#15803d] [&>i]:bg-[#16a34a]",
  pending: "bg-[#fff2e9] text-[#c2410c] [&>i]:bg-[#ea580c]",
  fail: "bg-[#fef2f2] text-[#b91c1c] [&>i]:bg-[#dc2626]",
  end: "bg-[#f1f3f5] text-[#4b5563] [&>i]:bg-[#9ca3af]",
};
export function Status({ tone: t, children }: { tone: keyof typeof sttTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full py-[0.4em] pr-[0.85em] pl-[0.75em] text-[13.5px] font-semibold whitespace-nowrap ${sttTone[t]}`}>
      <i className="mr-[0.5em] h-[8px] w-[8px] shrink-0 rounded-full" />
      {children}
    </span>
  );
}

/** `.accActs`: a row of actions; stacked full-width at 480px. */
export const Actions = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`mt-[18px] flex flex-wrap items-center gap-x-[14px] gap-y-[10px] max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:[&>*]:w-full ${className}`}>{children}</div>
);

/** `.accNte`. */
export const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-[1.06em] text-[13.5px] leading-[1.45em] text-[#6b7280] max-[576px]:font-medium">{children}</p>
);

/** `.accKv`: label / value rows. */
export function KeyValues({ rows, top = false }: { rows: [string, ReactNode][]; top?: boolean }) {
  return (
    <ul className={top ? "mt-[16px] -mb-[2px]" : "mt-[12px]"}>
      {rows.map(([k, v]) => (
        <li key={k} className={`flex items-baseline ${top ? "border-t border-[#e2e6ec] pt-[12px]" : "border-b border-[#e2e6ec] py-[11px]"}`}>
          <p className="w-[38%] max-w-[12em] min-w-[7.6em] flex-none pr-[12px] text-[15px] font-semibold text-[#0e1311]">{k}</p>
          <p className="min-w-0 flex-1 text-[15px] [overflow-wrap:anywhere] text-[#374151]">{v}</p>
        </li>
      ))}
    </ul>
  );
}

/** `.accMsg`: the save result line. */
export function Message({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <p role="status" className={`flex items-center text-[14px] leading-[1.35em] font-medium ${ok ? "text-[#0d8a82]" : "text-[#dc2626]"} [&>svg]:mr-[0.45em] [&>svg]:h-[17px] [&>svg]:w-[17px] [&>svg]:shrink-0`}>
      {ok ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )}
      <span>{children}</span>
    </p>
  );
}

/* ---- Form fields: `.accFrm` ------------------------------------------------ */

export const inputCls = (err?: string) =>
  `mt-[8px] block h-[46px] w-full rounded-[10px] border bg-white px-[14px] text-[15px] leading-[1.3em] text-[#0e1311] outline-none placeholder:text-[#9ca3af] hover:border-[#b4bcc8] max-[768px]:text-[16px] ${
    err ? "border-[#dc2626]! focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]" : "border-[#d1d5db] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.14)]"
  }`;
export const selectCls = (err?: string) => `${inputCls(err)} acc-select cursor-pointer appearance-none pr-[40px]`;

export function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[14px] font-semibold text-[#0e1311]">
        {label}
        {optional && <em className="ml-[0.35em] text-[12.5px] font-normal text-[#6b7280] not-italic">(optional)</em>}
      </label>
      {children}
      {error && <small className="mt-[6px] block text-[12.5px] font-medium text-[#dc2626]">{error}</small>}
    </div>
  );
}

/** Their row helpers: `.row` (two columns, one below 576px) and `.row.one`. */
export const Row = ({ one, children }: { one?: boolean; children: ReactNode }) => (
  <div className={`grid gap-x-[24px] [&+&]:mt-[16px] ${one ? "grid-cols-1" : "grid-cols-2 max-[576px]:grid-cols-1 max-[576px]:gap-y-[16px]"}`}>{children}</div>
);

export const linkCls = "font-semibold text-[#2563eb] hover:text-[#1855db]";
export { Link };
