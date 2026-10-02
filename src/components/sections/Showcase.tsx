"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/**
 * "23 QR code types for every use case" — mainB.html's #mainFormats on
 * desktop, main_mobile.html's #mainTypes below `md:`. Both are the same list
 * of formats, but neither is a reflow of the other: desktop is a static grid
 * of the designer's pre-tinted SVG badges with a "Create Your QR Code" button
 * under it, mobile a 3×3 grid of stroked glyphs with "More Formats" as a
 * disclosure. Their markup, icons and tints are carried separately below.
 *
 * Neither file makes a tile clickable — they are plain <li>s, so they stay
 * plain here. The section id stays `types`, which the footer links to.
 */

/**
 * Desktop tiles. The badges are the designer's own SVGs, copied to
 * public/formats/ untouched — each paints its own glyph colour, so the tile
 * only supplies the disc behind it.
 *
 * `tint` is that disc. Their CSS keys it by position, `.lst .itm:nth-child(n)
 * .ico`, and because the six small tiles are ALSO a `.lst`, those same six
 * rules beat the `.ico2`–`.ico6` tints the small tiles carry (one id and four
 * classes against one id and two). So Email–Plain Text render with the first
 * six popular tints, which is what is reproduced. `img` is the badge width in
 * em of the tile's 10px base: 2.2 by default, with the per-tile exceptions
 * their CSS names.
 */
type FormatTile = { label: string; src: string; tint: string; img: number };

const popular: FormatTile[] = [
  { label: "Website", src: "website", tint: "#eaf2ff", img: 2.2 },
  { label: "vCard", src: "vcard", tint: "#eaf8f0", img: 2.2 },
  { label: "PDF", src: "pdf", tint: "#fff0f0", img: 2.2 },
  { label: "Image", src: "image", tint: "#eaf8ef", img: 2.2 },
  { label: "Video", src: "video", tint: "#fff0f2", img: 2.2 },
  { label: "App Link", src: "applink", tint: "#e8f5ff", img: 2.2 },
  { label: "WhatsApp", src: "whatsapp", tint: "#eaf9ed", img: 2.2 },
  { label: "SMS", src: "sms", tint: "#eaf3ff", img: 2.2 },
  { label: "WiFi", src: "wifi", tint: "#eafafe", img: 2.2 },
  { label: "Menu", src: "menu", tint: "#fff4e7", img: 1.9 },
  { label: "Reviews", src: "reviews", tint: "#fff8e6", img: 2 },
  { label: "Payment", src: "payment", tint: "#fcecf5", img: 2.2 },
];

/** The small row. Email and Location carry no size class, so their badges
 *  fill the 3.2em disc outright — both SVGs draw their own circle. */
const more: FormatTile[] = [
  { label: "Email", src: "email", tint: "#eaf2ff", img: 3.2 },
  { label: "Phone", src: "phone", tint: "#eaf8f0", img: 1.55 },
  { label: "Location", src: "location", tint: "#fff0f0", img: 3.2 },
  { label: "Event", src: "event", tint: "#eaf8ef", img: 1.45 },
  { label: "Multi-Link", src: "multilink", tint: "#fff0f2", img: 1.65 },
  { label: "Plain Text", src: "plaintext", tint: "#e8f5ff", img: 1.35 },
];

const tileClass =
  "flex items-center justify-center rounded-[12px] border border-formats-tile-line bg-white text-[10px] shadow-formats-tile transition-all duration-[180ms] ease-[ease] hover:border-formats-tile-hover hover:shadow-formats-tile-hover";

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}

function DesktopFormats() {
  return (
    <div className="hidden md:block">
      <div className="text-center">
        <h4 className="text-[43px] font-extrabold leading-[normal] tracking-[-0.045em] text-formats-ink to-768:text-[38px]">
          <span className="text-primary">23</span> QR code types for every use
          case
        </h4>
        <p className="mt-[0.8em] p-0 text-[17px] leading-[normal] text-formats-muted to-992:mx-auto to-992:max-w-[22em]">
          From websites and PDFs to menus, reviews, payments and more.
        </p>
      </div>

      <h5 className="mt-[3.1em] text-[14px] font-extrabold leading-[normal] text-formats-ink">
        Popular QR Types
      </h5>
      <ul className="mt-[13px] grid grid-cols-4 gap-[14px] to-768:grid-cols-2">
        {popular.map(({ label, src, tint, img }) => (
          <li key={label} className={`${tileClass} min-h-[11.2em] flex-col`}>
            <span
              className="flex h-[5.2em] w-[5.2em] items-center justify-center rounded-full"
              style={{ background: tint }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/formats/${src}.svg`} alt={label} style={{ width: `${img}em` }} />
            </span>
            <p className="mt-[0.7em] p-0 text-[13px] font-bold leading-[normal] text-formats-ink">
              {label}
            </p>
          </li>
        ))}
      </ul>

      {/* Their `.mid`: a label between two hairlines. Static on desktop —
          both lists are always shown, so nothing here toggles. */}
      <div className="mt-[27px] flex items-center before:h-px before:flex-auto before:bg-formats-rule before:content-[''] after:h-px after:flex-auto after:bg-formats-rule after:content-['']">
        <span className="mx-[14px] inline-flex items-center text-[13px] font-bold leading-[normal] text-formats-rule-ink">
          More Formats
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="ml-[5px] h-[1em] w-[1em] shrink-0"
          >
            <path d="m5 12 7-7 7 7"></path>
            <path d="M12 19V5"></path>
          </svg>
        </span>
      </div>

      <ul className="mt-[18px] grid grid-cols-6 gap-[12px] to-768:grid-cols-3">
        {more.map(({ label, src, tint, img }) => (
          <li key={label} className={`${tileClass} min-h-[5.2em] flex-row`}>
            <span
              className="flex h-[3.2em] w-[3.2em] items-center justify-center rounded-full"
              style={{ background: tint }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/formats/${src}.svg`} alt={label} style={{ width: `${img}em` }} />
            </span>
            <p className="ml-[0.7em] p-0 text-[12px] font-bold leading-[normal] text-formats-ink">
              {label}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-[30px] flex justify-center">
        <Link
          href="/create"
          className="inline-flex items-center gap-[0.85em] rounded-[0.7em] bg-primary px-[2.2em] py-[1em] text-[16px] font-semibold leading-[1em] text-on-accent transition-all duration-150 hover:bg-primary-press active:shadow-[inset_0_0_0_1.3px_var(--color-formats-bg)]"
        >
          Create Your QR Code
          <ArrowRightGlyph className="h-[1.3em] w-[1.3em] shrink-0" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Mobile tiles: the designer's inline glyphs, copied verbatim, with the
 * colour pair each <span class="ico"> carries in its style attribute.
 */
type MobileType = { label: string; fg: string; bg: string; icon: ReactNode };

/** The 24-unit stroked glyphs, attributes shared by most of them. */
function G24({ children }: { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[3.1em] w-[3.1em]"
    >
      {children}
    </svg>
  );
}

/** The 22-unit set the designer drew separately (Menu, Phone, Event…). */
function G22({ children }: { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.83333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[3.1em] w-[3.1em]"
    >
      {children}
    </svg>
  );
}

const mobilePopular: MobileType[] = [
  {
    label: "Website",
    fg: "#782be4",
    bg: "#f1e9ff",
    icon: (
      <G24>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
        <path d="M2 12h20"></path>
      </G24>
    ),
  },
  {
    label: "vCard",
    fg: "#079b63",
    bg: "#e4f8ef",
    icon: (
      <G24>
        <path d="M16 2v2"></path>
        <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
        <path d="M8 2v2"></path>
        <circle cx="12" cy="11" r="3"></circle>
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      </G24>
    ),
  },
  {
    label: "PDF",
    fg: "#c92348",
    bg: "#fdecef",
    icon: (
      <G24>
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
        <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
        <path d="M10 9H8"></path>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
      </G24>
    ),
  },
  {
    label: "Image",
    fg: "#079b63",
    bg: "#e4f8ef",
    icon: (
      <G24>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
        <circle cx="9" cy="9" r="2"></circle>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
      </G24>
    ),
  },
  {
    label: "Video",
    fg: "#c92348",
    bg: "#fdecef",
    icon: (
      <G24>
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
        <rect x="2" y="6" width="14" height="12" rx="2"></rect>
      </G24>
    ),
  },
  {
    label: "App Link",
    fg: "#1f6fe5",
    bg: "#e9f2ff",
    icon: (
      <G24>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
        <path d="M12 18h.01"></path>
      </G24>
    ),
  },
  {
    label: "WhatsApp",
    fg: "#079b63",
    bg: "#e4f8ef",
    icon: (
      <G24>
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
      </G24>
    ),
  },
  {
    label: "SMS",
    fg: "#1f6fe5",
    bg: "#e9f2ff",
    icon: (
      <G24>
        <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
      </G24>
    ),
  },
  {
    label: "Social Media",
    fg: "#f35d9e",
    bg: "#fbe8f7",
    icon: (
      <G24>
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
      </G24>
    ),
  },
  {
    label: "WiFi",
    fg: "#078fa9",
    bg: "#e5f8fb",
    icon: (
      <G24>
        <path d="M12 20h.01"></path>
        <path d="M2 8.82a15 15 0 0 1 20 0"></path>
        <path d="M5 12.859a10 10 0 0 1 14 0"></path>
        <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
      </G24>
    ),
  },
];

const mobileMore: MobileType[] = [
  {
    label: "Menu",
    fg: "#e4770b",
    bg: "#fff1df",
    icon: (
      <G22>
        <path d="M2.75 1.83333V8.25C2.75 9.25833 3.575 10.0833 4.58333 10.0833H8.25C8.73623 10.0833 9.20255 9.89018 9.54636 9.54636C9.89018 9.20255 10.0833 8.73623 10.0833 8.25V1.83333"></path>
        <path d="M6.41667 1.83333V20.1667"></path>
        <path d="M19.25 13.75V1.83333C18.0344 1.83333 16.8686 2.31622 16.0091 3.17576C15.1496 4.0353 14.6667 5.20109 14.6667 6.41667V11.9167C14.6667 12.925 15.4917 13.75 16.5 13.75H19.25ZM19.25 13.75V20.1667"></path>
      </G22>
    ),
  },
  {
    label: "Email",
    fg: "#1f6fe5",
    bg: "#e9f2ff",
    icon: (
      <G24>
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      </G24>
    ),
  },
  {
    label: "Phone",
    fg: "#079b63",
    bg: "#e4f8ef",
    icon: (
      <G22>
        <path d="M20.1667 15.51V18.26C20.1677 18.5153 20.1154 18.768 20.0131 19.0019C19.9109 19.2358 19.7609 19.4458 19.5727 19.6184C19.3846 19.791 19.1625 19.9224 18.9207 20.0041C18.6788 20.0859 18.4226 20.1163 18.1683 20.0933C15.3476 19.7868 12.6381 18.823 10.2575 17.2792C8.04268 15.8718 6.16489 13.994 4.7575 11.7792C3.20831 9.38777 2.24422 6.66508 1.94333 3.83167C1.92043 3.57818 1.95055 3.3227 2.03179 3.08149C2.11303 2.84028 2.24361 2.61863 2.4152 2.43065C2.5868 2.24267 2.79565 2.09248 3.02847 1.98965C3.2613 1.88681 3.51298 1.83357 3.7675 1.83333H6.5175C6.96236 1.82895 7.39364 1.98649 7.73095 2.27657C8.06825 2.56665 8.28857 2.96949 8.35083 3.41C8.4669 4.29006 8.68216 5.15417 8.9925 5.98583C9.11583 6.31393 9.14252 6.6705 9.06941 7.01331C8.9963 7.35611 8.82646 7.67077 8.58 7.92L7.41583 9.08417C8.72076 11.3791 10.6209 13.2792 12.9158 14.5842L14.08 13.42C14.3292 13.1735 14.6439 13.0037 14.9867 12.9306C15.3295 12.8575 15.6861 12.8842 16.0142 13.0075C16.8458 13.3178 17.7099 13.5331 18.59 13.6492C19.0353 13.712 19.442 13.9363 19.7327 14.2794C20.0234 14.6225 20.1778 15.0604 20.1667 15.51Z"></path>
      </G22>
    ),
  },
  {
    label: "Location",
    fg: "#1f6fe5",
    bg: "#e9f2ff",
    icon: (
      <G24>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </G24>
    ),
  },
  {
    label: "Event",
    fg: "#782be4",
    bg: "#f1e9ff",
    icon: (
      <G22>
        <path d="M7.33333 1.83333V5.5"></path>
        <path d="M14.6667 1.83333V5.5"></path>
        <path d="M17.4167 3.66667H4.58333C3.57081 3.66667 2.75 4.48748 2.75 5.5V18.3333C2.75 19.3459 3.57081 20.1667 4.58333 20.1667H17.4167C18.4292 20.1667 19.25 19.3459 19.25 18.3333V5.5C19.25 4.48748 18.4292 3.66667 17.4167 3.66667Z"></path>
        <path d="M2.75 9.16667H19.25"></path>
      </G22>
    ),
  },
  {
    label: "Reviews",
    fg: "#e4770b",
    bg: "#fff1df",
    icon: (
      <G22>
        <path d="M10.5646 2.10375C10.6048 2.02259 10.6668 1.95427 10.7437 1.90651C10.8207 1.85874 10.9094 1.83343 11 1.83343C11.0906 1.83343 11.1793 1.85874 11.2563 1.90651C11.3332 1.95427 11.3952 2.02259 11.4354 2.10375L13.5529 6.39283C13.6924 6.67514 13.8983 6.91937 14.153 7.10458C14.4077 7.28979 14.7034 7.41044 15.015 7.45617L19.7505 8.14917C19.8402 8.16217 19.9245 8.20002 19.9939 8.25843C20.0632 8.31685 20.1148 8.3935 20.1429 8.47972C20.1709 8.56594 20.1742 8.65829 20.1525 8.74632C20.1308 8.83434 20.0849 8.91454 20.02 8.97783L16.5953 12.3127C16.3695 12.5328 16.2005 12.8044 16.1029 13.1043C16.0054 13.4042 15.9821 13.7233 16.0353 14.0342L16.8438 18.7458C16.8596 18.8355 16.8499 18.9279 16.8158 19.0123C16.7817 19.0967 16.7245 19.1699 16.6508 19.2234C16.5771 19.2769 16.4899 19.3087 16.399 19.315C16.3082 19.3213 16.2174 19.302 16.137 19.2592L11.9038 17.0335C11.6249 16.887 11.3146 16.8105 10.9995 16.8105C10.6845 16.8105 10.3742 16.887 10.0952 17.0335L5.863 19.2592C5.78264 19.3017 5.69195 19.3208 5.60125 19.3144C5.51055 19.308 5.42347 19.2762 5.34994 19.2227C5.2764 19.1692 5.21935 19.0962 5.18527 19.0119C5.15119 18.9276 5.14145 18.8354 5.15717 18.7458L5.96475 14.0351C6.0181 13.7241 5.99499 13.4048 5.89741 13.1047C5.79983 12.8046 5.63072 12.5328 5.40467 12.3127L1.98 8.97875C1.91454 8.91553 1.86816 8.8352 1.84613 8.7469C1.8241 8.65861 1.82732 8.5659 1.85541 8.47934C1.88349 8.39278 1.93533 8.31585 2.005 8.25732C2.07468 8.19878 2.15939 8.16099 2.2495 8.14825L6.98408 7.45617C7.29599 7.41079 7.59219 7.2903 7.8472 7.10507C8.10221 6.91984 8.30839 6.67541 8.448 6.39283L10.5646 2.10375Z"></path>
      </G22>
    ),
  },
  {
    label: "Multi-Link",
    fg: "#782be4",
    bg: "#f1e9ff",
    icon: (
      <G22>
        <path d="M9.16667 11.9167C9.56033 12.443 10.0626 12.8784 10.6393 13.1935C11.2161 13.5086 11.8539 13.696 12.5094 13.743C13.165 13.7899 13.823 13.6953 14.4387 13.4656C15.0545 13.2359 15.6137 12.8765 16.0783 12.4117L18.8283 9.66167C19.6632 8.79724 20.1252 7.63948 20.1148 6.43774C20.1043 5.23601 19.6223 4.08645 18.7725 3.23666C17.9227 2.38688 16.7732 1.90485 15.5714 1.89441C14.3697 1.88397 13.2119 2.34594 12.3475 3.18083L10.7708 4.74833"></path>
        <path d="M12.8333 10.0833C12.4397 9.55705 11.9374 9.12158 11.3607 8.80647C10.7839 8.49136 10.1461 8.30398 9.49057 8.25703C8.83502 8.21008 8.17705 8.30466 7.56127 8.53437C6.94549 8.76407 6.38631 9.12352 5.92167 9.58833L3.17167 12.3383C2.33678 13.2028 1.8748 14.3605 1.88524 15.5623C1.89569 16.764 2.37771 17.9135 3.2275 18.7633C4.07729 19.6131 5.22684 20.0951 6.42858 20.1056C7.63031 20.116 8.78807 19.6541 9.6525 18.8192L11.22 17.2517"></path>
      </G22>
    ),
  },
  {
    label: "Payment",
    fg: "#c51d9e",
    bg: "#fbe8f7",
    icon: (
      <G24>
        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
        <line x1="2" x2="22" y1="10" y2="10"></line>
      </G24>
    ),
  },
  {
    label: "Plain Text",
    fg: "#667085",
    bg: "#eef1f5",
    icon: (
      <G22>
        <path d="M11 3.66667V18.3333"></path>
        <path d="M3.66667 6.41667V4.58333C3.66667 4.34022 3.76324 4.10706 3.93515 3.93515C4.10706 3.76324 4.34022 3.66667 4.58333 3.66667H17.4167C17.6598 3.66667 17.8929 3.76324 18.0648 3.93515C18.2368 4.10706 18.3333 4.34022 18.3333 4.58333V6.41667"></path>
        <path d="M8.25 18.3333H13.75"></path>
      </G22>
    ),
  },
];

/**
 * `hidden` is for the ninth popular tile, Social Media: their file keeps it in
 * the list and drops it with `nth-child(9) { display: none }` so the grid lands
 * on a clean 3×3. Kept in the DOM the same way — display:none is not read out.
 */
function MobileTypeTile({ type, hidden }: { type: MobileType; hidden?: boolean }) {
  return (
    <li
      className={`${hidden ? "hidden" : "flex"} min-h-[13.8em] flex-col items-center justify-center rounded-[1.6em] border border-hero-card-line bg-white px-[0.6em] py-[1.48em] text-[10px] leading-[normal] to-480:text-[2.1vw]`}
    >
      <span
        className="flex h-[5.9em] w-[5.9em] shrink-0 items-center justify-center rounded-full"
        style={{ color: type.fg, background: type.bg }}
      >
        {type.icon}
      </span>
      <span className="mt-[0.7em] text-[1.6em] font-semibold text-ink">
        {type.label}
      </span>
    </li>
  );
}

/**
 * The mobile composition: heading, 3×3 popular grid, and "More Formats" as a
 * disclosure over the other nine. Their `.mid` is a clickable <div>; it is a
 * <button> here so the disclosure is reachable by keyboard and announces its
 * state — the one element-type change in this section.
 */
function MobileTypes() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="text-center">
        <h4 className="mx-auto max-w-[9.5em] text-[42px] font-extrabold leading-[1.08] tracking-[-0.035em] text-black to-480:text-[8.7vw]">
          <span className="text-primary">23</span> QR code types for every use
          case
        </h4>
        <p className="mx-auto mt-[0.85em] max-w-[18em] p-0 text-[20px] leading-[1.55] text-muted to-480:text-[4.1vw]">
          From websites and PDFs to menus, reviews, payments and more.
        </p>
      </div>

      <h5 className="mt-[min(24px,3.75vw)] text-[22px] font-extrabold leading-[normal] tracking-[-0.02em] text-black to-480:text-[4.6vw]">
        Popular QR Types
      </h5>
      <ul className="mt-[min(16px,2.5vw)] grid grid-cols-3 gap-[min(12px,1.875vw)] to-480:gap-[2.56vw]">
        {mobilePopular.map((t, i) => (
          <MobileTypeTile key={t.label} type={t} hidden={i === 8} />
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="more-formats"
        onClick={() => setOpen((v) => !v)}
        className="mt-[min(18.5px,2.890625vw)] flex w-full cursor-pointer select-none items-center text-[18px] font-bold leading-[normal] text-ink before:mr-[0.7em] before:h-px before:flex-1 before:bg-hero-divider before:content-[''] after:ml-[0.35em] after:h-px after:flex-1 after:bg-hero-divider after:content-[''] to-480:text-[3.8vw]"
      >
        More Formats
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0e1311"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`ml-[6px] h-[22px] w-[22px] to-480:h-[4.6vw] to-480:w-[4.6vw] transition-transform duration-[250ms] ease-out ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </button>

      {/* Always in the DOM, as theirs is — `display: none` until opened. */}
      <ul
        id="more-formats"
        className={`mt-[min(18.5px,2.890625vw)] grid-cols-3 gap-[min(12px,1.875vw)] to-480:gap-[2.56vw] ${open ? "grid" : "hidden"}`}
      >
        {mobileMore.map((t) => (
          <MobileTypeTile key={t.label} type={t} />
        ))}
      </ul>
    </div>
  );
}

export function Showcase() {
  return (
    <section
      id="types"
      className="scroll-mt-[84px] border-b border-hero-line bg-types-bg py-[48px] to-480:py-[10vw] md:scroll-mt-20 md:border-b-0 md:bg-formats-bg md:py-0"
    >
      {/*
        The 1px bottom rule on mobile is their base `#mainTypes` rule, which
        main_mobile.html never overrides — easy to miss, and leaving it off
        shifts every section below it up by a pixel.

        No vertical padding from `md:` up: their #mainFormats has none. The gap
        above it is #mainShare's bottom padding and the one below is
        #mainBenefits' top, so the heading sits against the seam by design.
      */}
      <div className="container-wide-home">
        <MobileTypes />
        <DesktopFormats />
      </div>
    </section>
  );
}
