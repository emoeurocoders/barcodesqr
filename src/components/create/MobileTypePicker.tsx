"use client";

import { useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { designerTypeIcons } from "./designerTypeIcons";
import { Slide } from "./mobile/ui";

/**
 * Step 1 below `md`, ported from create_mobile.html (the 2026-10-15
 * revision, which replaced the radio list + Continue button).
 *
 * Every card is a link straight into its form. Seven show up front;
 * "Explore 16 More QR Types" slides the other sixteen open beneath it. The cards' order
 * and wording are the mobile file's own, not the desktop picker's, so they
 * are listed here rather than read from `qrTypes`.
 *
 * Every number is the mockup's computed value at 390px. Their stylesheet
 * sizes this page in `vw`, so it scales with the screen; ours is fixed at
 * the 390 rendering, as the mobile homepage is.
 */

type Card = { value: string; label: string; desc: string; tint: string };

const first: Card[] = [
  { value: "website", label: "Website", desc: "Open a website or landing page", tint: "rgba(37, 99, 235, 0.08)" },
  { value: "vcard", label: "vCard", desc: "Share a digital business card", tint: "rgba(37, 99, 235, 0.08)" },
  { value: "multilink", label: "Multi-Link", desc: "Share several links at once", tint: "rgba(124, 58, 237, 0.08)" },
  { value: "social", label: "Social Media", desc: "Share all your social profiles", tint: "rgba(236, 72, 153, 0.08)" },
  { value: "applink", label: "App Link", desc: "Send users to the right app store", tint: "rgba(16, 185, 129, 0.08)" },
  { value: "pdf", label: "PDF", desc: "Open or download a PDF file", tint: "rgba(220, 38, 38, 0.08)" },
  { value: "image", label: "Image", desc: "Display an image or photo", tint: "rgba(22, 163, 74, 0.08)" },
];

const rest: Card[] = [
  { value: "whatsapp", label: "WhatsApp", desc: "Start a WhatsApp chat", tint: "rgba(37, 211, 102, 0.08)" },
  { value: "menu", label: "Menu", desc: "Share your digital menu", tint: "rgba(249, 115, 22, 0.08)" },
  { value: "wifi", label: "WiFi", desc: "Connect to a WiFi network", tint: "rgba(14, 165, 233, 0.08)" },
  { value: "video", label: "Video", desc: "Play a video with one scan", tint: "rgba(239, 68, 68, 0.08)" },
  { value: "location", label: "Google Maps", desc: "Share a location", tint: "rgba(234, 67, 53, 0.08)" },
  { value: "email", label: "Email", desc: "Send an email message", tint: "rgba(139, 92, 246, 0.08)" },
  { value: "review", label: "Google Review", desc: "Get more reviews on Google", tint: "rgba(220, 60, 42, 0.08)" },
  { value: "sms", label: "SMS", desc: "Send a text message", tint: "rgba(37, 99, 235, 0.08)" },
  { value: "phone", label: "Phone", desc: "Call a phone number", tint: "rgba(22, 163, 74, 0.08)" },
  { value: "text", label: "Plain Text", desc: "Show text instantly", tint: "rgba(107, 114, 128, 0.08)" },
  { value: "payment", label: "Payment", desc: "Accept payments", tint: "rgba(124, 58, 237, 0.08)" },
  { value: "mp3", label: "Audio", desc: "Play an audio file", tint: "rgba(245, 158, 11, 0.08)" },
  { value: "coupon", label: "Coupon", desc: "Share a discount", tint: "rgba(239, 68, 68, 0.08)" },
  { value: "feedback", label: "Feedback", desc: "Collect feedback", tint: "rgba(245, 158, 11, 0.08)" },
  { value: "business", label: "Business", desc: "Share business info", tint: "rgba(37, 99, 235, 0.08)" },
  { value: "event", label: "Event", desc: "Promote your event", tint: "rgba(59, 130, 246, 0.08)" },
];

/** Every type the mobile picker offers — all 23, each exactly once. */
export const mobilePickerTypes = [...first, ...rest].map((c) => c.value);

const railSteps = ["Choose", "Customize", "Download"];

/**
 * Their `.top`: numbered circles joined by a grey bar, the first one live.
 *
 * The one part of this page sized `min(px at 390, vw)`: their rail scales
 * with the screen (`1.67vw`), and at fixed px its three labels overflow a
 * 320px phone by 7px. Identical at 390 and up.
 */
function NumberRail() {
  return (
    <div className="flex">
      {railSteps.map((label, i) => {
        const on = i === 0;
        const last = i === railSteps.length - 1;
        return (
          <div
            key={label}
            className={`flex items-center text-left ${last ? "flex-none" : "flex-auto"}`}
          >
            <div
              className={`flex h-[min(29.9px,7.667vw)] w-[min(29.9px,7.667vw)] shrink-0 items-center justify-center rounded-full text-[length:min(11.72px,3.005vw)] font-bold ${
                on ? "bg-primary text-white" : "bg-mc-num text-prose"
              }`}
            >
              {i + 1}
            </div>
            <h5
              className={`ml-[min(7.2px,1.846vw)] max-w-[min(70.3px,18.026vw)] text-[length:min(11.72px,3.005vw)] leading-[min(14.07px,3.608vw)] ${
                on ? "font-bold text-primary" : "font-medium text-muted"
              }`}
            >
              {label}
            </h5>
            {/* Their `.stp:not(:last-child):after` connector. */}
            {!last && (
              <span
                aria-hidden="true"
                className="mx-[min(6.5px,1.667vw)] block h-[min(1.63px,0.418vw)] min-w-[min(7.8px,2.000vw)] flex-1 bg-mc-rule"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Their `.chv`: right-pointing on a type, down-pointing on the expander. */
function Chevron({
  down,
  open,
  stroke = "#9CA3AF",
}: {
  down?: boolean;
  open?: boolean;
  stroke?: string;
}) {
  return (
    <div className="ml-[3.7px] flex shrink-0">
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block h-[15.8px] w-[15.8px] transition-transform duration-300 ${
          open ? "rotate-180" : ""
        }`}
      >
        <path
          d={down ? "M4.25 6.375L8.5 10.625L12.75 6.375" : "M6.375 4.25L10.625 8.5L6.375 12.75"}
          stroke={stroke}
          strokeWidth="1.41667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * The whole card is the link. The mockup has no pressed state; JB asked for
 * clear tap feedback, so it borrows the picker's selected look (blue border,
 * pale blue fill) while held.
 */
const cardLi =
  "rounded-[11.1px] border border-mc-card-line bg-white transition-colors duration-100 has-[a:active]:border-primary has-[a:active]:bg-mc-on";
const cardA =
  "flex cursor-pointer items-center p-[11.138px] [-webkit-tap-highlight-color:transparent]";

function CardBody({
  icon,
  tint,
  title,
  desc,
  titleClass = "font-bold text-black",
}: {
  icon: ReactNode;
  tint: string;
  title: ReactNode;
  desc: string;
  titleClass?: string;
}) {
  return (
    <>
      <div
        className="flex h-[40.84px] w-[40.84px] shrink-0 items-center justify-center rounded-full"
        style={{ background: tint }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-[4.6px] pl-[7.4px]">
        <h5 className={`flex items-center text-[13.92px] leading-[normal] ${titleClass}`}>
          {title}
        </h5>
        <p className="mt-[2.8px] text-[11.6px] leading-[16.82px] font-medium text-muted">
          {desc}
        </p>
      </div>
    </>
  );
}

function TypeCard({
  card,
  onChoose,
}: {
  card: Card;
  onChoose: (v: string) => void;
}) {
  const Glyph = designerTypeIcons[card.value];
  return (
    <li className={cardLi}>
      <a
        href={`/create?type=${card.value}`}
        onClick={(e) => {
          // A real address (new tab, long-press copy), but in-app it is a
          // history push rather than a page load — see CreateWizard.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onChoose(card.value);
        }}
        className={cardA}
      >
        <CardBody
          icon={<Glyph className="h-[23.2px] w-[23.2px]" />}
          tint={card.tint}
          title={card.label}
          desc={card.desc}
        />
        <Chevron />
      </a>
    </li>
  );
}

export function MobileTypePicker({
  onChoose,
}: {
  onChoose: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const moreRow = useRef<HTMLLIElement>(null);

  const toggle = () => {
    const closing = open;
    setOpen(!open);
    // JB: collapsing returns you to the expander. If the list was
    // scrolled far down, the page shortens under you; bring the row back
    // into view — and leave the page alone if it already is.
    if (closing) {
      requestAnimationFrame(() =>
        moreRow.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      );
    }
  };

  return (
    <div className="bg-white px-[14.6px] py-[12.2px]">
      <NumberRail />

      <div className="py-[12.2px]">
        <h4 className="text-center text-[26.79px] leading-[normal] font-extrabold tracking-[-1.34px] text-black">
          Choose your QR code type
        </h4>
        <p className="mt-[6.1px] text-center text-[12.29px] leading-[normal] font-medium text-muted">
          Choose what you want to share, then create your QR code.
        </p>

        <ul className="mt-[11.6px] grid gap-[14px]">
          {first.map((c) => (
            <TypeCard key={c.value} card={c} onChoose={onChoose} />
          ))}
          {/*
            JB, 2026-10-19 — the expander was "blending in": a light blue
            card set 12px apart from the seven, "Explore 16 More QR Types",
            and "Show Fewer QR Types" with the chevron turned up once open.
            One control, the whole card; no second heading. No mockup file
            carries it — the colours and copy are his note, the grid glyph is
            from his reference image (lucide's LayoutGrid).
          */}
          <li
            ref={moreRow}
            className="mt-[12px] scroll-my-[12px] rounded-[11.1px] border border-mc-more-line bg-mc-more transition-colors duration-100 has-[a:active]:border-primary"
          >
            <a
              href="#"
              aria-expanded={open}
              aria-controls="more-qr-types"
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              className={cardA}
            >
              <CardBody
                icon={<LayoutGrid className="h-[23.2px] w-[23.2px] text-primary" strokeWidth={2} />}
                tint="rgba(37, 99, 235, 0.1)"
                titleClass="font-semibold text-primary-dark"
                title={open ? "Show Fewer QR Types" : "Explore 16 More QR Types"}
                desc="WhatsApp, WiFi, Video, and more"
              />
              <Chevron down open={open} stroke="#1D4ED8" />
            </a>
          </li>
        </ul>

        {/* Their `.xtr`, slid open with `slideToggle(260)`. */}
        <div id="more-qr-types">
          <Slide open={open} duration="duration-[260ms]">
            <ul className="mt-[14px] grid gap-[14px]">
              {rest.map((c) => (
                <TypeCard key={c.value} card={c} onChoose={onChoose} />
              ))}
            </ul>
          </Slide>
        </div>
      </div>
    </div>
  );
}
