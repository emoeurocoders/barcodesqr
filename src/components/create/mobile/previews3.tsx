"use client";

import type { ReactNode } from "react";
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
          <div className="relative mx-[8.1px] mt-[8.1px] h-[69px] overflow-hidden rounded-t-[11.4px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="block h-full w-full" style={coverStyle} />
            {badge && (
              <span className="absolute bottom-[7.3px] left-[8.1px] flex items-center gap-[4.1px] rounded-full bg-white/92 px-[8.1px] py-[3.2px] text-[8.11px] leading-[normal] font-semibold text-ink [&>svg]:block [&>svg]:h-[8.9px] [&>svg]:w-[8.9px] [&>svg]:text-primary">
                {utensils}
                {badge}
              </span>
            )}
          </div>
        )}
        <div className="px-[11.4px] pt-[9.7px] text-left">
          <h5 className="text-[12.17px] leading-[normal] font-bold tracking-[-0.12px] text-ink">{title}</h5>
          {desc && <p className="mt-[3px] text-[8.52px] leading-[12.8px] text-muted">{desc}</p>}
        </div>
        <div className="mx-[11.4px] mt-[8.9px] h-px bg-mc-pv-ic-line" />
        {cat && (
          <p className="px-[11.4px] pt-[10.5px] text-left text-[8.11px] leading-[normal] font-bold tracking-[0.65px] text-faint uppercase">{cat}</p>
        )}
        <div className="px-[11.4px] pt-[1.6px] text-left">
          {items.map((it, i) =>
            it.heading ? (
              <p key={i} className="pt-[12.2px] text-[8.11px] leading-[normal] font-bold tracking-[0.65px] text-faint uppercase">{it.name}</p>
            ) : (
            <div key={i} className="mt-[9.7px]">
              <div className="flex items-baseline gap-[4.1px]">
                <span className="max-w-[70%] shrink-0 truncate text-[9.73px] leading-[normal] font-semibold text-ink">{it.name}</span>
                <span className="flex-1 -translate-y-[2px] border-b border-dotted border-mc-menu-dots" />
                <span className="shrink-0 text-[9.73px] leading-[normal] font-bold text-black">{it.price}</span>
              </div>
              {it.desc && <p className="mt-[1.9px] text-[7.71px] leading-[10.8px] text-muted">{it.desc}</p>}
            </div>
            ),
          )}
        </div>
        {/* The page IS the full menu; the button only makes sense in the
            preview's cut-down card. */}
        {page ? (
          <div className="h-[13.6px]" />
        ) : (
          <div className="mx-[11.9px] mt-[12.8px] mb-[13.6px] flex items-center justify-center gap-[4.3px] rounded-full bg-mc-tile p-[6.4px] text-[8.52px] leading-[normal] font-medium text-muted [&>svg]:block [&>svg]:h-[10.6px] [&>svg]:w-[10.6px]">
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
      <Phone className="max-w-[243.4px] bg-white px-[13px] py-[14.6px] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/previews/wifi-qr.png" alt="" className="mx-auto block h-[137.9px] w-[137.9px] rounded-[11.4px] border border-mc-pv-ic-line" />
        <div className="mt-[11.4px] flex items-center justify-center gap-[5.7px] px-[5.7px] text-[11.36px] leading-[normal] font-bold text-ink">
          <svg {...svgProps} className="block h-[13.1px] w-[13.1px] shrink-0 text-brand-dark">
            <path d="M12 20h.01" />
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <path d="M5 12.859a10 10 0 0 1 14 0" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          </svg>
          <span className="block min-w-0 truncate">{ssid}</span>
        </div>
        <p className="mt-[3.6px] text-[8.92px] leading-[normal] text-muted">{meta}</p>
      </Phone>
      <Sample>Sample code shown. Your final WiFi code is generated at the download step.</Sample>
    </PreviewCard>
  );
}

/* ---- Video ----------------------------------------------------------------- */

export function VideoPreview({ values, open, onToggle }: Props) {
  const stored = parseStoredFile(values.file ?? "");
  const url = fileSrc(stored);
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
            <video key={url} controls playsInline preload="metadata" src={url} className="block max-h-[194.7px] w-full bg-ink" />
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
      </Phone>
      <Sample>Example preview. Your video plays here once uploaded.</Sample>
      <ScanNote>Scanning opens the video in your device’s browser. It will not download automatically.</ScanNote>
    </PreviewCard>
  );
}
