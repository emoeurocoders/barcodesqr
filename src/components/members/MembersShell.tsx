"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

import { logoutUser } from "@/app/actions/auth";

/**
 * The members area's frame — `#mainApp` in member_main / member_stats /
 * member_myaccount / member_billing.html: the 260px sidebar (`.lft`) and the
 * page column (`.rgt`). At 1024px and below the sidebar becomes a drawer
 * opened by the page title's burger (`.top .brg`), closed by a click outside
 * it, Escape, or following a link — their main.js, as React state.
 */

const Ctx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

const sv = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" } as const;
const st = { stroke: "currentColor", strokeWidth: 1.66667, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Their sidebar, group by group, with the designer's icons. */
const groups: { title: string; items: { label: string; href: string; icon: ReactNode }[] }[] = [
  {
    title: "CREATE",
    items: [
      {
        label: "Create QR",
        href: "/create",
        icon: (
          <svg {...sv}>
            <path d="M7.08333 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V7.08333C2.5 7.77369 3.05964 8.33333 3.75 8.33333H7.08333C7.77369 8.33333 8.33333 7.77369 8.33333 7.08333V3.75C8.33333 3.05964 7.77369 2.5 7.08333 2.5Z" {...st} />
            <path d="M16.25 2.5H12.9167C12.2263 2.5 11.6667 3.05964 11.6667 3.75V7.08333C11.6667 7.77369 12.2263 8.33333 12.9167 8.33333H16.25C16.9404 8.33333 17.5 7.77369 17.5 7.08333V3.75C17.5 3.05964 16.9404 2.5 16.25 2.5Z" {...st} />
            <path d="M7.08333 11.6667H3.75C3.05964 11.6667 2.5 12.2263 2.5 12.9167V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H7.08333C7.77369 17.5 8.33333 16.9404 8.33333 16.25V12.9167C8.33333 12.2263 7.77369 11.6667 7.08333 11.6667Z" {...st} />
            <path d="M11.6667 14.1667H17.5" {...st} />
            <path d="M14.5833 11.6667V16.6667" {...st} />
          </svg>
        ),
      },
      {
        label: "Create Bulk",
        href: "/dashboard",
        icon: (
          <svg {...sv}>
            <path d="M10.6917 1.81667C10.4745 1.71762 10.2387 1.66637 10 1.66637C9.76134 1.66637 9.52547 1.71762 9.30833 1.81667L2.16667 5.06667C2.01879 5.13187 1.89307 5.23867 1.8048 5.37405C1.71654 5.50943 1.66954 5.66755 1.66954 5.82917C1.66954 5.99078 1.71654 6.14891 1.8048 6.28429C1.89307 6.41967 2.01879 6.52646 2.16667 6.59167L9.31667 9.85C9.5338 9.94904 9.76968 10.0003 10.0083 10.0003C10.247 10.0003 10.4829 9.94904 10.7 9.85L17.85 6.6C17.9979 6.5348 18.1236 6.428 18.2119 6.29262C18.3001 6.15724 18.3471 5.99911 18.3471 5.8375C18.3471 5.67589 18.3001 5.51776 18.2119 5.38238C18.1236 5.247 17.9979 5.1402 17.85 5.075L10.6917 1.81667Z" {...st} />
            <path d="M2.16667 10.0667L9.31667 13.325C9.5338 13.424 9.76968 13.4753 10.0083 13.4753C10.247 13.4753 10.4829 13.424 10.7 13.325L17.85 10.075" {...st} />
            <path d="M2.16667 13.8167L9.31667 17.075C9.5338 17.174 9.76968 17.2253 10.0083 17.2253C10.247 17.2253 10.4829 17.174 10.7 17.075L17.85 13.825" {...st} />
          </svg>
        ),
      },
    ],
  },
  {
    title: "MANAGE",
    items: [
      {
        label: "My QR Codes",
        href: "/dashboard",
        icon: (
          <svg {...sv}>
            <path d="M7.08333 2.5H3.75C3.05964 2.5 2.5 3.05964 2.5 3.75V7.08333C2.5 7.77369 3.05964 8.33333 3.75 8.33333H7.08333C7.77369 8.33333 8.33333 7.77369 8.33333 7.08333V3.75C8.33333 3.05964 7.77369 2.5 7.08333 2.5Z" {...st} />
            <path d="M16.25 2.5H12.9167C12.2263 2.5 11.6667 3.05964 11.6667 3.75V7.08333C11.6667 7.77369 12.2263 8.33333 12.9167 8.33333H16.25C16.9404 8.33333 17.5 7.77369 17.5 7.08333V3.75C17.5 3.05964 16.9404 2.5 16.25 2.5Z" {...st} />
            <path d="M7.08333 11.6667H3.75C3.05964 11.6667 2.5 12.2263 2.5 12.9167V16.25C2.5 16.9404 3.05964 17.5 3.75 17.5H7.08333C7.77369 17.5 8.33333 16.9404 8.33333 16.25V12.9167C8.33333 12.2263 7.77369 11.6667 7.08333 11.6667Z" {...st} />
            <path d="M16.25 11.6667H12.9167C12.2263 11.6667 11.6667 12.2263 11.6667 12.9167V16.25C11.6667 16.9404 12.2263 17.5 12.9167 17.5H16.25C16.9404 17.5 17.5 16.9404 17.5 16.25V12.9167C17.5 12.2263 16.9404 11.6667 16.25 11.6667Z" {...st} />
          </svg>
        ),
      },
      {
        label: "QR Templates",
        href: "/dashboard",
        icon: (
          <svg {...sv}>
            <path d="M15.8333 2.5H7.5C6.57953 2.5 5.83333 3.24619 5.83333 4.16667V15.8333C5.83333 16.7538 6.57953 17.5 7.5 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" {...st} />
            <path d="M3.33333 5V15.8333C3.33333 16.2754 3.50893 16.6993 3.82149 17.0118C4.13405 17.3244 4.55797 17.5 5 17.5H12.5" {...st} />
          </svg>
        ),
      },
    ],
  },
  {
    title: "ANALYZE",
    items: [
      {
        label: "Statistics",
        href: "/dashboard",
        icon: (
          <svg {...sv}>
            <path d="M3.33333 16.6667V8.33333" {...st} />
            <path d="M8.33333 16.6667V3.33333" {...st} />
            <path d="M13.3333 16.6667V10.8333" {...st} />
            <path d="M18.3333 16.6667H1.66667" {...st} />
          </svg>
        ),
      },
      {
        label: "Scheduled Reports",
        href: "/dashboard",
        icon: (
          <svg {...sv}>
            <path d="M17.5 9.16667V5C17.5 4.55797 17.3244 4.13405 17.0118 3.82149C16.6993 3.50893 16.2754 3.33333 15.8333 3.33333H4.16667C3.72464 3.33333 3.30072 3.50893 2.98816 3.82149C2.67559 4.13405 2.5 4.55797 2.5 5V16.6667C2.5 17.1087 2.67559 17.5326 2.98816 17.8452C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333H9.16667" {...st} />
            <path d="M2.5 8.33333H17.5" {...st} />
            <path d="M6.66667 1.66667V5" {...st} />
            <path d="M13.3333 1.66667V5" {...st} />
            <path d="M15 18.3333C16.8409 18.3333 18.3333 16.8409 18.3333 15C18.3333 13.1591 16.8409 11.6667 15 11.6667C13.1591 11.6667 11.6667 13.1591 11.6667 15C11.6667 16.8409 13.1591 18.3333 15 18.3333Z" {...st} />
            <path d="M15 13.75V15L15.8333 15.8333" {...st} />
          </svg>
        ),
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        label: "My Account",
        href: "/account",
        icon: (
          <svg {...sv}>
            <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.3841 12.5 12.5 12.5H7.5C6.61594 12.5 5.7681 12.8512 5.14298 13.4763C4.51786 14.1014 4.16667 14.9493 4.16667 15.8333V17.5" {...st} />
            <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" {...st} />
          </svg>
        ),
      },
      {
        label: "Billing & Subscription",
        href: "/billing",
        icon: (
          <svg {...sv}>
            <path d="M16.6667 4.16667H3.33333C2.41286 4.16667 1.66667 4.91286 1.66667 5.83333V14.1667C1.66667 15.0871 2.41286 15.8333 3.33333 15.8333H16.6667C17.5871 15.8333 18.3333 15.0871 18.3333 14.1667V5.83333C18.3333 4.91286 17.5871 4.16667 16.6667 4.16667Z" {...st} />
            <path d="M1.66667 8.33333H18.3333" {...st} />
          </svg>
        ),
      },
    ],
  },
];

export type ShellUser = { name: string; plan: string };

export function MembersShell({ current, user, children }: { current: string; user: ShellUser; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const side = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !menu) return;
    const outside = (e: PointerEvent) => {
      if (open && !side.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [open, menu]);

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen items-stretch bg-white">
        <div
          ref={side}
          className={`flex w-[260px] shrink-0 flex-col leading-[normal] border-r border-[#dae0e8] bg-white max-[1024px]:fixed max-[1024px]:inset-y-0 max-[1024px]:left-0 max-[1024px]:z-[900] max-[1024px]:overflow-y-auto max-[1024px]:transition-transform max-[1024px]:duration-300 max-[1024px]:ease-out ${
            open ? "max-[1024px]:translate-x-0 max-[1024px]:shadow-[0_0_0_200vmax_rgba(0,0,0,0.4)]" : "max-[1024px]:-translate-x-[280px]"
          }`}
        >
          <div className="min-h-[99px] px-[19px] pt-[30px]">
            <Link href="/" className="block h-[31px] w-[172px] overflow-hidden bg-[url(/brand/logo.svg)] bg-contain bg-left bg-no-repeat -indent-[8000px] whitespace-nowrap">
              BarcodesQR
            </Link>
          </div>
          {groups.map((g) => (
            <div key={g.title} className="px-[11px] [&+&]:pt-[17px]">
              <p className="px-[8px] text-[11.5px] font-bold tracking-[0.09em] text-[#9ca3af] uppercase">{g.title}</p>
              <ul className="mt-[9px]">
                {g.items.map((it) => {
                  const cur = it.label === current;
                  return (
                    <li key={it.label} className="[&+&]:mt-[2px]">
                      <Link
                        href={it.href}
                        aria-current={cur ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-center rounded-[10px] p-[8px] text-[15px] focus-visible:outline-offset-[-2px] [&>svg]:mr-[12px] [&>svg]:h-[20px] [&>svg]:w-[20px] [&>svg]:shrink-0 ${
                          cur ? "bg-[#e9f0fb] font-semibold text-[#2563eb]" : "font-medium text-[#4b5563] hover:bg-[#f5f7f9]"
                        }`}
                      >
                        {it.icon}
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {/* Their `.usr`. The chevron opens a small menu — unmocked; its one
              action is the Log out the previous sidebar had. */}
          <div className="relative mt-auto border-t border-[#dae0e8]">
            {menu && (
              <form action={logoutUser} className="absolute right-[16px] bottom-full left-[16px] mb-[6px] rounded-[10px] border border-[#dae0e8] bg-white p-[4px] shadow-[0_8px_24px_-12px_rgba(14,19,17,0.3)]">
                <button type="submit" className="w-full cursor-pointer rounded-[8px] px-[10px] py-[8px] text-left text-[14.5px] font-medium text-[#374151] hover:bg-[#f5f7f9]">
                  Log out
                </button>
              </form>
            )}
            <button
              type="button"
              aria-expanded={menu}
              aria-label="Account menu"
              onClick={() => setMenu(!menu)}
              className="flex w-full cursor-pointer items-center px-[16px] pt-[14px] pb-[13px] text-left hover:bg-[#f8f9fb]"
            >
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-[15px] font-bold text-white">
                {(user.name.trim()[0] ?? "A").toUpperCase()}
              </span>
              <span className="min-w-0 flex-[1_0_0] pl-[8px]">
                <span className="block truncate text-[14.5px] font-bold text-[#0e1311]">{user.name}</span>
                <span className="mt-[0.08em] block truncate text-[12.5px] text-[#6b7280]">{user.plan}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-[16px] w-[16px] shrink-0 transition-transform ${menu ? "rotate-180" : ""}`}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_0_0] flex-col">{children}</div>
      </div>
    </Ctx.Provider>
  );
}

/** Their `.top .brg`: the burger beside the page title, at 1024px and below. */
export function MenuButton() {
  const { open, setOpen } = useContext(Ctx);
  return (
    <button
      type="button"
      aria-label="Open menu"
      aria-expanded={open}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => setOpen(!open)}
      className="mr-[12px] hidden h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-[#d1d5db] text-[#374151] max-[1024px]:flex"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
    </button>
  );
}
