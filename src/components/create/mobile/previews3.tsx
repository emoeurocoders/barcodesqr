"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { QrPreview, defaultQrStyle } from "../QrPreview";
import { encodeQr } from "../encodeQr";
import { wifiIssues } from "../validate";
import { cropStyle, fileSrc, filledLinks, linkCaption, parseMenuItems, parseStoredFile } from "../storedValues";
import type { MenuItem } from "../storedValues";
import { BarCaret, BarText, Chip, PreviewCard, RowLink, Sample, ScanNote, chevronRight, hrefOf, qrGlyph } from "./previews";
import { filledSocials, socialHref, useDesktop, usePageMode } from "./pageMode";
import { socialByKey } from "./socials";

/**
 * The previews for batch 3 (social media / menu / WiFi / video), from the same
 * files. Sizes are their `.pvwCmp` ems (8.11px at 390).
 */

type Values = Record<string, string>;
type Props = { values: Values; open: boolean; onToggle: () => void };

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Phone({ className = "", children }: { className?: string; children: ReactNode }) {
  const desk = useDesktop();
  // As a hosted page the phone IS the screen: no frame.
  if (usePageMode()) return <div className={`relative min-h-[var(--qh)] overflow-hidden ${className}`}>{children}</div>;
  return (
    <div className={`relative mx-auto ${desk ? "" : "mt-[4.1px]"} overflow-hidden rounded-[17.8px] border border-mc-pv-line shadow-mc-phone ${className}`}>
      {children}
    </div>
  );
}

function Thumb({ src, round, style }: { src: string; round?: boolean; style?: React.CSSProperties }) {
  return (
    <span className={`block h-[35.7px] w-[35.7px] shrink-0 overflow-hidden ${round ? "rounded-full" : "rounded-[8.1px]"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block h-full w-full object-cover" style={style} />
    </span>
  );
}

/* ---- Social Media ---------------------------------------------------------- */

const sampleSocials = ["instagram", "tiktok", "whatsapp"];
/** Desktop's sample shows two more. */
const sampleSocialsDesktop = ["instagram", "tiktok", "whatsapp", "youtube", "linkedin"];

/**
 * Desktop words each row as an action ("Follow on Instagram"), from their
 * script's `crSocLbl`; mobile shows the name alone.
 */
const socAction: Record<string, string> = {
  instagram: "Follow on", tiktok: "Follow on", facebook: "Follow on", x: "Follow on", pinterest: "Follow on",
  snapchat: "Add on", whatsapp: "Chat on", telegram: "Chat on", messenger: "Chat on", wechat: "Chat on",
  line: "Chat on", viber: "Chat on", youtube: "Watch on", linkedin: "Connect on", reddit: "Join on",
};

export function SocialMediaPreview({ values, selectedSocials, open, onToggle }: Props & { selectedSocials: string[] }) {
  const page = usePageMode();
  const stored = parseStoredFile(values.photo ?? "");
  const photo = fileSrc(stored) ?? (page ? undefined : "/previews/portrait.jpg");
  const photoStyle = stored ? cropStyle(stored) : { objectFit: "cover" as const };
  const name = (values.headline ?? "").trim() || (page ? "" : "Kaia Bennett");
  const bio =
    (values.description ?? "").trim() ||
    (page ? "" : "Creating a brighter, more connected world through content, community and good ideas.");
  const desk = useDesktop();
  const socs = page ? filledSocials(values) : selectedSocials.length ? selectedSocials : desk ? sampleSocialsDesktop : sampleSocials;
  const label = (k: string) => (desk && socAction[k] ? `${socAction[k]} ` : "") + (socialByKey[k]?.name ?? k);
  const links = filledLinks(values.links ?? "");

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <Thumb src={photo ?? ""} round style={photoStyle} />
          <BarText open={open} title="Your Social Media Preview" base="See how your profile page looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-[243.4px] bg-mc-soc-bg pb-[13.8px]">
        <i className="absolute -top-[60.8px] -right-[48.7px] block h-[154.1px] w-[154.1px] rounded-full border-[21.1px] border-white/45" />
        <i className="absolute -bottom-[73px] -left-[56.8px] block h-[170.4px] w-[170.4px] rounded-full border-[24.3px] border-white/45" />
        <Chip round className="top-[8.1px] left-[8.1px] text-primary-dark">{qrGlyph}</Chip>
        <span className="absolute top-[9.7px] right-[9.7px] text-muted [&>svg]:block [&>svg]:h-[13px] [&>svg]:w-[13px]">
          <svg {...svgProps}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </span>
        <span className="relative mx-auto mt-[19.5px] flex h-[61.7px] w-[61.7px] items-center justify-center overflow-hidden rounded-full border-[2.8px] border-white bg-mc-pv-band shadow-mc-soc-photo">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="block h-full w-full" style={photoStyle} />
          ) : (
            // No photo on a hosted page: the initial (unmocked).
            <span className="text-[20px] leading-none font-bold text-white">{name.charAt(0).toUpperCase()}</span>
          )}
        </span>
        <h5 className="relative mt-[9.4px] flex items-center justify-center gap-[5px] px-[12.6px] text-[12.57px] leading-[normal] font-bold tracking-[-0.13px] text-mc-soc-name">
          <span className="block min-w-0 truncate">{name}</span>
          {/* Desktop drops the verified tick (`createDsk2 .pvwSoc .nm > svg`). */}
          <svg {...svgProps} className={`block h-[13.2px] w-[13.2px] shrink-0 text-mc-verified ${desk ? "hidden" : ""}`}>
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </h5>
        {/* Their `.qot`: the bio between big blue quote marks. */}
        {bio && (
        <div className="relative mx-[16.2px] mt-[9.7px]">
          <span className="absolute -top-[7.5px] -left-[5.5px] z-[1] font-serif text-[25.1px] leading-none text-mc-quote">“</span>
          <div className="rounded-[8.9px] bg-white/95 px-[8.9px] py-[7.3px] shadow-mc-row">
            <p className="text-center text-[8.52px] leading-[13.63px] text-body">{bio}</p>
          </div>
          <span className="absolute -right-[4.5px] -bottom-[10.5px] z-[1] font-serif text-[25.1px] leading-none text-mc-quote">”</span>
        </div>
        )}
        <div className="relative px-[12.2px] pt-[12.7px] text-center text-[9.73px] leading-[normal] font-bold text-mc-soc-name">Find me on</div>
        <div className="relative px-[10.5px] pt-[7.3px]">
          {socs.map((k) => (
            <Row
              key={k}
              href={page ? socialHref(k, values[k] ?? "") : undefined}
              lead={
                <i className="m-[0.4px] flex h-[17.8px] w-[17.8px] shrink-0 items-center justify-center rounded-full" style={{ background: socialByKey[k]?.color }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/create/soc/${k}.svg`} alt="" className="block h-[9.7px] w-[9.7px]" />
                </i>
              }
            >
              {label(k)}
            </Row>
          ))}
          {/* Desktop parity: custom links, once there are any. Unmocked. */}
          {links.map((l, i) => (
            <Row key={`l${i}`} href={page ? hrefOf(l.url) : undefined} lead={<i className="m-[0.4px] block h-[17.8px] w-[17.8px] shrink-0 rounded-full bg-mc-well" />}>
              {linkCaption(l)}
            </Row>
          ))}
        </div>
      </Phone>
      <Sample>Example preview. Your profiles replace it as you type.</Sample>
    </PreviewCard>
  );
}

/** Their `.lrow`. */
function Row({ lead, href, children }: { lead: ReactNode; href?: string; children: ReactNode }) {
  return (
    <RowLink href={href} className="flex items-center rounded-full bg-white px-[8.1px] py-[5.7px] shadow-mc-row [&+&]:mt-[6.5px]">
      {lead}
      <span className="min-w-0 flex-1 truncate px-[6.8px] text-left text-[9.73px] leading-[normal] font-semibold text-body">{children}</span>
      <span className="shrink-0 text-faint [&>svg]:block [&>svg]:h-[11.4px] [&>svg]:w-[11.4px]">{chevronRight}</span>
    </RowLink>
  );
}

/* ---- Menu ------------------------------------------------------------------ */

const sampleMenu = [
  { name: "Garden Bruschetta", price: "$9", desc: "Heirloom tomato, basil, sourdough" },
  { name: "Truffle Pasta", price: "$18", desc: "Hand-cut tagliatelle, parmesan" },
  { name: "Seared Salmon", price: "$24", desc: "Lemon butter, seasonal greens" },
  { name: "Chocolate Tart", price: "$11", desc: "Sea salt, vanilla cream" },
];

const utensils = (
  <svg {...svgProps}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

export function MenuPreview({ values, open, onToggle }: Props) {
  const page = usePageMode();
  // create_desktop_menu.html (`createDsk2 .pvwMenu`): same slim phone, larger
  // type; values are its em over the zoom.
  const desk = useDesktop();
  const coverFile = parseStoredFile(values.cover ?? "");
  const cover = fileSrc(coverFile) ?? (page ? undefined : "/previews/food.jpg");
  const coverStyle = coverFile ? cropStyle(coverFile) : { objectFit: "cover" as const };
  const title = (values.title ?? "").trim() || (page ? "" : "Bella Italia Menu");
  const badge = ((values.title ?? "").trim() || (page ? "" : "Bella Italia")).replace(/\s+menu$/i, "");
  const desc = (values.description ?? "").trim() || (page ? "" : "Fresh, seasonal, and made to order.");
  const cat = (values.category ?? "").trim();
  // Their script lists an item once it has both a name and a price.
  // Headings stay in, so the list can break into sections.
  const all = parseMenuItems(values.items).map((i) => ({ ...i, name: i.name.trim(), price: i.price.trim(), desc: i.desc.trim() }));
  const mine = all.filter((i) => (i.heading ? i.name : i.name && i.price));
  const items: MenuItem[] = mine.some((i) => !i.heading) || page ? mine : sampleMenu;

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <Thumb src={cover ?? ""} style={coverStyle} />
          <BarText open={open} title="Your Menu Preview" base="See how your digital menu looks" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-[243.4px] bg-white">
        {/* On a hosted page: the cover only if there is one. The badge is
            the menu's title less a trailing "menu" (2026-10-29 sync; it used
            to be a hard-coded "Bella Italia"). */}
        {cover && (
          <div className={`relative overflow-hidden rounded-t-[11.4px] ${desk ? "mx-[9.73px] mt-[9.73px] h-[121.68px]" : "mx-[8.1px] mt-[8.1px] h-[69px]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
            {badge && (
              <span className={`absolute bottom-[7.3px] left-[8.1px] flex items-center gap-[4.1px] rounded-full bg-white/92 px-[8.1px] py-[3.2px] leading-[normal] ${desk ? "text-[9.33px]" : "text-[8.11px]"} font-semibold text-ink [&>svg]:block [&>svg]:h-[8.9px] [&>svg]:w-[8.9px] [&>svg]:text-primary`}>
                {utensils}
                {badge}
              </span>
            )}
          </div>
        )}
        <div className={`text-left ${desk ? "px-[12.98px] pt-[11.36px]" : "px-[11.4px] pt-[9.7px]"}`}>
          <h5 className={`leading-[normal] font-bold text-ink ${desk ? "text-[16.22px] tracking-[-0.16px]" : "text-[12.17px] tracking-[-0.12px]"}`}>{title}</h5>
          {desc && <p className={`text-muted ${desk ? "mt-[3.16px] text-[10.55px] leading-[15.8px] italic" : "mt-[3px] text-[8.52px] leading-[12.8px]"}`}>{desc}</p>}
        </div>
        <div className={`h-px bg-mc-pv-ic-line ${desk ? "mx-[12.98px] mt-[10.55px]" : "mx-[11.4px] mt-[8.9px]"}`} />
        {cat && (
          <p className={`text-left text-[8.11px] leading-[normal] font-bold tracking-[0.65px] text-faint uppercase ${desk ? "px-[12.98px] pt-[11.36px]" : "px-[11.4px] pt-[10.5px]"}`}>{cat}</p>
        )}
        <div className={`text-left ${desk ? "px-[12.98px] pt-[1.62px]" : "px-[11.4px] pt-[1.6px]"}`}>
          {items.map((it, i) =>
            it.heading ? (
              <p key={i} className={`text-[8.11px] leading-[normal] font-bold tracking-[0.65px] text-faint uppercase ${desk ? "pt-[14.6px]" : "pt-[12.2px]"}`}>{it.name}</p>
            ) : (
            <div key={i} className={desk ? "mt-[12.17px]" : "mt-[9.7px]"}>
              <div className="flex items-baseline gap-[4.1px]">
                <span className={`max-w-[70%] shrink-0 truncate leading-[normal] font-semibold text-ink ${desk ? "text-[12.17px]" : "text-[9.73px]"}`}>{it.name}</span>
                <span className="flex-1 -translate-y-[2px] border-b border-dotted border-mc-menu-dots" />
                <span className={`shrink-0 leading-[normal] font-bold text-black ${desk ? "text-[12.17px]" : "text-[9.73px]"}`}>{it.price}</span>
              </div>
              {it.desc && <p className={`mt-[1.9px] text-muted ${desk ? "text-[9.73px] leading-[13.63px]" : "text-[7.71px] leading-[10.8px]"}`}>{it.desc}</p>}
            </div>
            ),
          )}
        </div>
        {/* The page IS the full menu; the button only makes sense in the
            preview's cut-down card. */}
        {page ? (
          <div className="h-[13.6px]" />
        ) : (
          <div className={`flex items-center justify-center gap-[4.3px] rounded-full bg-mc-tile leading-[normal] font-medium text-muted [&>svg]:block ${desk ? "mx-[17.52px] my-[19.71px] p-[9.31px] text-[10.95px] [&>svg]:h-[13.6px] [&>svg]:w-[13.6px]" : "mx-[11.9px] mt-[12.8px] mb-[13.6px] p-[6.4px] text-[8.52px] [&>svg]:h-[10.6px] [&>svg]:w-[10.6px]"}`}>
            {utensils}
            View full menu
          </div>
        )}
      </Phone>
      <Sample>Example preview. Your menu items replace it as you type.</Sample>
    </PreviewCard>
  );
}

/* ---- WiFi ------------------------------------------------------------------ */

/**
 * As their file has it: a sample code, the network name and its security.
 * The real code is drawn at download, which is what the caption says.
 */
export function WifiPreview({ values, open, onToggle }: Props) {
  const ssid = (values.ssid ?? "").trim() || "CozyCornerWiFi";
  const enc = values.encryption || "WPA";
  const desk = useDesktop();
  // The real code once the network is complete (JB, 2026-10-30), the file's
  // sample picture until then. It is drawn here and never sent anywhere.
  const w = wifiIssues(values);
  const real = !w.ssid && !w.password ? encodeQr("wifi", values) : "";
  const qrBox = desk ? "h-[170.35px] w-[170.35px]" : "h-[137.9px] w-[137.9px]";
  const pass = values.password ?? "";
  let meta = enc === "nopass" ? "Open network · No password" : `${enc === "WEP" ? "WEP" : "WPA/WPA2"} · Password protected`;
  if (values.hidden === "true") meta += " · Hidden network";

  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <Thumb src="/previews/wifi-qr.png" />
          <BarText open={open} title="Your WiFi QR Preview" base="Tap to expand your QR code" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className={`bg-white px-[13px] py-[14.6px] text-center ${desk ? "" : "max-w-[243.4px]"}`}>
        {real ? (
          <QrPreview
            value={real}
            style={defaultQrStyle}
            size={400}
            className={`mx-auto block overflow-hidden rounded-[11.4px] border border-mc-pv-ic-line bg-white p-[6px] [&>svg]:h-full [&>svg]:w-full ${qrBox}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/previews/wifi-qr.png" alt="" className={`mx-auto block rounded-[11.4px] border border-mc-pv-ic-line ${qrBox}`} />
        )}
        <div className="mt-[11.4px] flex items-center justify-center gap-[5.7px] px-[5.7px] text-[11.36px] leading-[normal] font-bold text-ink">
          <svg {...svgProps} className="block h-[13.1px] w-[13.1px] shrink-0 text-brand-dark">
            <path d="M12 20h.01" />
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <path d="M5 12.859a10 10 0 0 1 14 0" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          </svg>
          <span className="block min-w-0 truncate">{ssid}</span>
        </div>
        {desk ? (
          <>
            {/* create_desktop_wifi.html's `.meta2` and `.winfo` rows. */}
            <p className="mt-[4.75px] text-center text-[10.55px] leading-[14.77px] text-muted">Scan to connect to WiFi</p>
            <div className="mx-[1.6px] mt-[12.98px] mb-[3.24px] border-t border-[#edf0f4] text-left">
              {[
                {
                  label: "Network",
                  value: ssid,
                  icon: (
                    <>
                      <path d="M12 20h.01" />
                      <path d="M2 8.82a15 15 0 0 1 20 0" />
                      <path d="M5 12.859a10 10 0 0 1 14 0" />
                      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                    </>
                  ),
                },
                {
                  label: "Security",
                  value: enc === "nopass" ? "Open network" : enc === "WEP" ? "WEP" : "WPA/WPA2",
                  icon: (
                    <>
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </>
                  ),
                },
                {
                  label: "Password",
                  // Never the password itself: dots, as their script draws.
                  // Ten for the sample, as the file has it; then their
                  // script's 8–14 by length.
                  value: enc === "nopass" ? "None" : "\u2022".repeat(pass ? Math.min(Math.max(pass.length, 8), 14) : 10),
                  icon: (
                    <>
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                    </>
                  ),
                },
              ].map((r, j) => (
                <div key={r.label} className={`flex items-center gap-[8.92px] py-[9.33px] ${j ? "border-t border-[#edf0f4]" : ""}`}>
                  <i className="flex h-[29.2px] w-[29.2px] shrink-0 items-center justify-center rounded-[8.11px] bg-[#e0f4f3] text-[#0d9488] not-italic">
                    <svg {...svgProps} className="block h-[13.79px] w-[13.79px]">
                      {r.icon}
                    </svg>
                  </i>
                  <span className="min-w-0">
                    <em className="block text-[8.92px] leading-[11.6px] text-faint not-italic">{r.label}</em>
                    <b className="mt-[1.64px] block truncate text-[10.95px] leading-[14.78px] font-semibold text-ink">{r.value}</b>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-[3.6px] text-[8.92px] leading-[normal] text-muted">{meta}</p>
        )}
      </Phone>
      <Sample>Sample code shown. Your final WiFi code is generated at the download step.</Sample>
    </PreviewCard>
  );
}

/* ---- Video ----------------------------------------------------------------- */

const sizeTxt = (b: number) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec) % 60).padStart(2, "0")}`;

export function VideoPreview({ values, open, onToggle }: Props) {
  const stored = parseStoredFile(values.file ?? "");
  const url = fileSrc(stored);
  const page = usePageMode();
  // create_desktop_video.html adds the title under the player and the file's
  // details under the caption (`.vt`, `.vmeta`); the sample's values until a
  // video is in.
  const desk = useDesktop();
  const [played, setPlayed] = useState<number | undefined>();
  const duration = (stored as { duration?: number } | null)?.duration ?? played;
  const title = (values.title ?? "").trim() || (page ? "" : "Happy Moments");
  const ext = stored ? (stored.name.split(".").pop() || "MP4").toUpperCase() : "MP4";
  const meta = [
    { label: "File name", value: stored ? stored.name : "Happy Moments.mp4", d: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></> },
    { label: "File size", value: stored ? sizeTxt(stored.size) : "24.5 MB", d: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></> },
    { label: "Duration", value: stored ? (duration !== undefined ? clock(duration) : "—") : "0:24", d: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
    { label: "Format", value: ext, d: <><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></> },
  ];
  return (
    <PreviewCard
      open={open}
      onToggle={onToggle}
      bar={
        <>
          <Thumb src="/create/video.svg" />
          <BarText open={open} title="Your Video Preview" base="Tap to view your video" />
          <BarCaret open={open} />
        </>
      }
    >
      <Phone className="max-w-full bg-white p-[9.7px]">
        <div className="relative overflow-hidden rounded-[9.7px] bg-ink">
          {url ? (
            // The uploaded file itself, played by the phone's own player.
            // `playsInline` keeps iOS from jumping to fullscreen on play.
            // Never autoplays; the poster is the first frame grabbed at upload.
            <video
              key={url}
              controls
              playsInline
              preload="metadata"
              src={url}
              poster={(stored as { thumb?: string } | null)?.thumb}
              onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setPlayed(Math.round(e.currentTarget.duration))}
              className="block max-h-[194.7px] w-full bg-ink"
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/previews/video-thumb.jpg" alt="" className="block w-full" />
              <span className="absolute top-1/2 left-1/2 flex h-[37.3px] w-[37.3px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-mc-play">
                <svg {...svgProps} fill="currentColor" strokeWidth="1" className="ml-[2px] block h-[16.2px] w-[16.2px]">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </span>
            </>
          )}
        </div>
        {desk && title && (
          <h5 className="mt-[10.22px] mb-[1.14px] text-center text-[11.36px] leading-[15.33px] font-bold text-ink">{title}</h5>
        )}
      </Phone>
      <Sample>Example preview. Your video plays here once uploaded.</Sample>
      {desk && (
        <div className="mt-[11.36px] rounded-[9.73px] border border-[#eceff4] bg-[#f6f8fb] px-[12.17px] py-[2.43px]">
          {meta.map((r, j) => (
            <div key={r.label} className={`flex items-center gap-[7.3px] py-[8.92px] ${j ? "border-t border-[#e8ecf2]" : ""}`}>
              <svg {...svgProps} className="block h-[12.98px] w-[12.98px] shrink-0 text-muted">
                {r.d}
              </svg>
              <span className="text-[10.55px] leading-[normal] text-prose">{r.label}</span>
              <b className="min-w-0 flex-1 truncate text-right text-[10.55px] leading-[normal] font-semibold text-ink">{r.value}</b>
            </div>
          ))}
        </div>
      )}
      <ScanNote>Scanning opens the video in your device’s browser. It will not download automatically.</ScanNote>
    </PreviewCard>
  );
}
