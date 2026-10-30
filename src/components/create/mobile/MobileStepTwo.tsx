"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { allTypes, mobileTypeTitle } from "../qrTypes";
import { designerTypeIcons } from "../designerTypeIcons";
import { socials } from "./socials";
import {
  MultiLinkForm,
  Sep,
  VCardForm,
  WebsiteForm,
  checksFor,
  socialChecks,
  initiallyOpen,
} from "./forms";
import { FormHeader, NameField } from "./fields";
import type { FormState } from "./forms";
import { MultiLinkPreview, VCardPreview, WebsitePreview } from "./previews";
import { AppLinkForm, ImageForm, PdfForm, WhatsAppForm } from "./forms2";
import {
  MenuForm,
  SocialMediaForm,
  VideoForm,
  WifiForm,
  checksForBatch3,
  socialMediaOrder,
  socialMediaOrderDesktop,
} from "./forms3";
import {
  MenuPreview,
  SocialMediaPreview,
  VideoPreview,
  WifiPreview,
} from "./previews3";
import { EmailForm, MapsForm, ReviewForm, SmsForm, checksForBatch4 } from "./forms4";
import { EmailPreview, MapsPreview, ReviewPreview, SmsPreview } from "./previews4";
import { AudioForm, PaymentForm, PhoneForm, PlainTextForm, checksForBatch5 } from "./forms5";
import { AudioPreview, PaymentPreview, PhonePreview, PlainTextPreview } from "./previews5";
import { BusinessForm, CouponForm, EventForm, FeedbackForm, checksForBatch6 } from "./forms6";
import { BusinessPreview, CouponPreview, EventPreview, FeedbackPreview } from "./previews6";
import {
  AppLinkPreview,
  ImagePreview,
  PdfPreview,
  WhatsAppPreview,
} from "./previews2";

/**
 * Where a mobile file introduces its form in other words than desktop's step
 * 2 (`stepDesc`). Only the ones that differ.
 */
const mobileHeaderDesc: Record<string, string> = {
  pdf: "Share a PDF document with one QR code",
  image: "Display an image or photo gallery",
  location: "Share a location or address",
  phone: "Call a phone number with one scan",
  text: "Share a message with one scan",
  payment: "Share a payment link with one QR code",
  coupon: "Share a special offer with customers",
};
import { ArrowLeft, ArrowRight, outlineBtn, smallBtn } from "./ui";
import { DesktopLayout, DesktopPreview } from "./pageMode";
import { CreateHeader } from "../CreateHeader";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";

const hdrSvg = {
  width: "25",
  height: "25",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[22.7px] w-[22.7px]",
};

/**
 * Where a mobile file heads its form with a different glyph from the step-1
 * picker's — copied from each file's `.hdr .ico`.
 */
const mobileHeaderIcon: Record<string, ReactNode> = {
  phone: (
    <svg {...hdrSvg} stroke="#16A34A">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  text: (
    <svg {...hdrSvg} stroke="#4B5563">
      <path d="M12 4v16"></path>
      <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"></path>
      <path d="M9 20h6"></path>
    </svg>
  ),
  event: (
    <svg {...hdrSvg} stroke="#0E7490">
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  ),
  feedback: (
    <svg {...hdrSvg} stroke="#4B5563">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
    </svg>
  ),
  mp3: (
    <svg {...hdrSvg} stroke="#6366F1">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  ),
};

type Values = Record<string, string>;

/* ---- Rail ------------------------------------------------------------------ */

const railChevron = (stroke: string) => (
  <div className="flex grow items-center justify-center">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[16.5px] w-[16.5px]">
      <g>
        <path d="M6.375 4.25L10.625 8.5L6.375 12.75" stroke={stroke} strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);

/**
 * Step 2's rail on mobile (their `.createMob2 .top`): three icon circles and
 * the chevrons between them, labels hidden. Step 1 is done (a tick), step 2
 * is current, step 3 waits in pale grey.
 *
 * The labels are still in the markup for screen readers, as in their file —
 * and they are the PM's renamed wording from 2026-10-12, not the stale
 * strings the mockup still carries, since nobody sees them here.
 */
export function IconRail() {
  const circle = "flex h-[28.7px] w-[28.7px] items-center justify-center rounded-full [&>svg]:block [&>svg]:h-[13.7px] [&>svg]:w-[13.7px]";
  return (
    <ol className="flex items-center justify-between pt-[2.4px] pb-[3.7px]">
      <li className="flex shrink-0">
        <div className={`${circle} bg-primary text-white`}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 5.25L7.875 14.875L3.5 10.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="sr-only">Step 1: Choose QR Type</span>
      </li>
      {railChevron("currentColor")}
      <li className="flex shrink-0" aria-current="step">
        <div className={`${circle} bg-primary text-white`}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M10.5 2.625H4.375C3.91087 2.625 3.46575 2.80937 3.13756 3.13756C2.80937 3.46575 2.625 3.91087 2.625 4.375V16.625C2.625 17.0891 2.80937 17.5342 3.13756 17.8624C3.46575 18.1906 3.91087 18.375 4.375 18.375H16.625C17.0891 18.375 17.5342 18.1906 17.8624 17.8624C18.1906 17.5342 18.375 17.0891 18.375 16.625V10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.1 2.275C16.4481 1.9269 16.9202 1.73134 17.4125 1.73134C17.9048 1.73134 18.3769 1.9269 18.725 2.275C19.0731 2.6231 19.2687 3.09522 19.2687 3.5875C19.2687 4.07978 19.0731 4.5519 18.725 4.9L10.85 12.775L7.35 13.65L8.225 10.15L16.1 2.275Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        <span className="sr-only">Step 2: Add Content</span>
      </li>
      {railChevron("#9CA3AF")}
      <li className="flex shrink-0">
        <div className={`${circle} bg-mc-step-off`}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M17.5 11.375C17.5 15.75 14.4375 17.9375 10.7975 19.2062C10.6069 19.2708 10.3998 19.2678 10.2113 19.1975C6.5625 17.9375 3.5 15.75 3.5 11.375V5.25C3.5 5.01794 3.59219 4.79538 3.75628 4.63128C3.92038 4.46719 4.14294 4.375 4.375 4.375C6.125 4.375 8.3125 3.325 9.835 1.995C9.91714 1.89894 10.0191 1.82182 10.1339 1.76894C10.2487 1.71606 10.3736 1.68868 10.5 1.68868C10.6264 1.68868 10.7513 1.71606 10.8661 1.76894C10.9809 1.82182 11.0829 1.89894 11.165 1.995C12.6963 3.33375 14.875 4.375 16.625 4.375C16.8571 4.375 17.0796 4.46719 17.2437 4.63128C17.4078 4.79538 17.5 5.01794 17.5 5.25V11.375Z" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        <span className="sr-only">Step 3: Customize &amp; Download</span>
      </li>
    </ol>
  );
}

/* ---- Footer ---------------------------------------------------------------- */

/**
 * Their `.ftr`: Back and Next, stuck to the bottom of the screen while the
 * form scrolls under it.
 *
 * While a field has focus it drops back into the flow (their `body.crKb`) —
 * on a phone the keyboard is up then, and a bar pinned above it would sit on
 * top of the very field being typed in.
 */
export function MobileFooter({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const isField = (el: Element | null) =>
      !!el && el.matches("input:not([type=radio]):not([type=checkbox]):not([type=file]), textarea, select");
    const onIn = (e: FocusEvent) => {
      if (isField(e.target as Element)) setTyping(true);
    };
    // Their 80ms grace, so tabbing from one field to the next does not make
    // the bar flicker back in between.
    let t: ReturnType<typeof setTimeout> | undefined;
    const onOut = () => {
      clearTimeout(t);
      t = setTimeout(() => setTyping(isField(document.activeElement)), 80);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      clearTimeout(t);
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div
      className={`${typing ? "static" : "sticky"} bottom-0 z-[11] mt-[12.2px] flex items-center justify-between border-t border-mc-art-line bg-white py-[8.5px]`}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
        className={outlineBtn}
      >
        <ArrowLeft />
        Back
      </a>
      <a
        href="#"
        aria-disabled={nextDisabled || undefined}
        onClick={(e) => {
          e.preventDefault();
          if (!nextDisabled) onNext();
        }}
        className={`${smallBtn} bg-primary px-[23.4px] text-white hover:bg-primary-press ${
          nextDisabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        Next
        <ArrowRight />
      </a>
    </div>
  );
}

/* ---- Desktop (create_desktop_*.html) ----------------------------------------- */

/**
 * The desktop files are the mobile form at a fixed 10px em where mobile's
 * is 8.112px (2.08vw at 390). So the same components are drawn zoomed by
 * 10/8.112 — one form, two sizes. The handful of sizes the files fix in px
 * (inputs, labels, the header's subtitle weight) are set back through the
 * variables in ui.tsx, divided by that zoom so they land on the file's px.
 */
const Z = 10 / 8.112;
const DESK_ZOOM = {
  zoom: Z,
  "--mc-in-h": `${46.94 / Z}px`,
  "--mc-in-fs": `${15 / Z}px`,
  "--mc-in-px": `${15 / Z}px`,
  "--mc-in-mt": `${9 / Z}px`,
  "--mc-ta-h": `${96 / Z}px`,
  "--mc-ta-py": `${10.5 / Z}px`,
  "--mc-lb": `${14 / Z}px`,
  "--mc-hd-w": "400",
} as React.CSSProperties;

/** Each desktop file's `.pvh` heading, its tip, and a caption that differs from mobile's. */
const desktopPreview: Record<string, { title: string; tip?: string; caption?: string }> = {
  website: {
    title: "Website Preview",
    tip: "A sample layout. Your real website opens when the code is scanned.",
    caption: "This is a preview of your website link.",
  },
  vcard: { title: "vCard Preview", tip: "This is how your digital business card will look after scanning." },
  multilink: { title: "Multi-Link Preview" },
  social: { title: "Social Media Preview" },
  applink: { title: "App Link Preview" },
  pdf: { title: "PDF Preview", caption: "Example cover. Your PDF replaces it once uploaded." },
};

/** The types whose desktop step 2 is create_desktop_*.html so far (JB, 2026-10-29). */
export const desktopTypes = new Set(Object.keys(desktopPreview));

const deskSteps = [
  // The PM's names (2026-10-12), as on step 1's header; the files still
  // carry "Complete Content" / "Customize & Protect".
  { step: "Step 1", title: "Choose QR Type" },
  { step: "Step 2", title: "Add Content" },
  { step: "Step 3", title: "Customize & Download" },
];

/** Their `.crd > .top` on desktop: icon, "Step n" and its name, joined by rules. */
function DesktopRail() {
  const icons = [
    <path key="a" d="M17.5 5.25L7.875 14.875L3.5 10.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
    <g key="b">
      <path d="M10.5 2.625H4.375C3.91087 2.625 3.46575 2.80937 3.13756 3.13756C2.80937 3.46575 2.625 3.91087 2.625 4.375V16.625C2.625 17.0891 2.80937 17.5342 3.13756 17.8624C3.46575 18.1906 3.91087 18.375 4.375 18.375H16.625C17.0891 18.375 17.5342 18.1906 17.8624 17.8624C18.1906 17.5342 18.375 17.0891 18.375 16.625V10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.1 2.275C16.4481 1.9269 16.9202 1.73134 17.4125 1.73134C17.9048 1.73134 18.3769 1.9269 18.725 2.275C19.0731 2.6231 19.2687 3.09522 19.2687 3.5875C19.2687 4.07978 19.0731 4.5519 18.725 4.9L10.85 12.775L7.35 13.65L8.225 10.15L16.1 2.275Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    <path key="c" d="M17.5 11.375C17.5 15.75 14.4375 17.9375 10.7975 19.2062C10.6069 19.2708 10.3998 19.2678 10.2113 19.1975C6.5625 17.9375 3.5 15.75 3.5 11.375V5.25C3.5 5.01794 3.59219 4.79538 3.75628 4.63128C3.92038 4.46719 4.14294 4.375 4.375 4.375C6.125 4.375 8.3125 3.325 9.835 1.995C9.91714 1.89894 10.0191 1.82182 10.1339 1.76894C10.2487 1.71606 10.3736 1.68868 10.5 1.68868C10.6264 1.68868 10.7513 1.71606 10.8661 1.76894C10.9809 1.82182 11.0829 1.89894 11.165 1.995C12.6963 3.33375 14.875 4.375 16.625 4.375C16.8571 4.375 17.0796 4.46719 17.2437 4.63128C17.4078 4.79538 17.5 5.01794 17.5 5.25V11.375Z" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />,
  ];
  return (
    <ol className="flex items-center border-b border-[#eceef2] px-6 pt-[17px] pb-[18px]">
      {deskSteps.map((st, i) => {
        const on = i < 2;
        const last = i === deskSteps.length - 1;
        return (
          <li
            key={st.step}
            aria-current={i === 1 ? "step" : undefined}
            className={`flex items-center ${last ? "" : "flex-1 after:mx-[18px] after:h-px after:flex-1 after:bg-[#e5e9ee] after:content-['']"}`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${on ? "bg-primary text-white" : "bg-[#f1f3f5] text-muted"}`}>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[21px] w-[21px]">
                {icons[i]}
              </svg>
            </div>
            <div className="pl-[9px]">
              <p className="text-[13px] leading-[normal] text-faint">{st.step}</p>
              <h5 className={`mt-[2.02px] text-[15.5px] leading-[normal] font-bold ${on ? "text-ink" : "text-muted"}`}>{st.title}</h5>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const deskBtn =
  "inline-flex h-[42px] cursor-pointer items-center justify-center gap-[9px] rounded-[10.5px] px-[27px] text-[15px] leading-[15px] font-medium transition-colors [&>svg]:block [&>svg]:h-[18px] [&>svg]:w-[18px]";

/** Their `.ftr`: Back (outline) and Next (blue), under the card. */
function DesktopFooter({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-b-[18px] border-t border-[#eceef2] bg-[#fbfcfd] px-5 pt-[14px] pb-[14px]">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
        className={`${deskBtn} border border-primary bg-white text-primary hover:bg-primary hover:text-white`}
      >
        <ArrowLeft />
        Back
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
        className={`${deskBtn} bg-primary text-white hover:bg-primary-press`}
      >
        Next
        <ArrowRight />
      </a>
    </div>
  );
}

/* ---- The page -------------------------------------------------------------- */

/**
 * Step 2 below `md` for the three types create_mobile_*.html covers so far:
 * rail, the collapsible preview, the form card, and the footer.
 *
 * Next is always live (JB: "validate on click rather than disabling
 * upfront"). Pressing it with something missing shows every problem at once,
 * opens the accordion holding the first, and scrolls that field to the middle
 * of the screen with the cursor in it. Errors then clear as they are fixed.
 */
export function MobileStepTwo({
  type,
  values,
  setValues,
  name,
  setName,
  onBack,
  onNext,
  layout = "mobile",
  notice,
}: {
  type: string;
  values: Values;
  setValues: React.Dispatch<React.SetStateAction<Values>>;
  name: string;
  setName: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  /** "desktop": create_desktop_*.html's two-column page, same form. */
  layout?: "mobile" | "desktop";
  /** Shown above the card on desktop (the editing note). */
  notice?: ReactNode;
}) {
  const meta = allTypes.find((t) => t.value === type);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState<string[]>(initiallyOpen[type] ?? []);
  const [submitted, setSubmitted] = useState(false);
  const [moreSocials, setMoreSocials] = useState(false);
  // Which platforms are switched on. Seeded from whatever already has a
  // value, so coming back to the form shows the fields that were filled.
  const [socialsOn, setSocialsOn] = useState<string[]>(() =>
    socials.filter((p) => (values[p.key] ?? "").trim()).map((p) => p.key),
  );

  // Batches 3 and 4 join here rather than inside `checksFor`: batch 3 imports
  // batch 1's pickers, and the two modules would otherwise import each other.
  const checks = useMemo(
    () => [
      ...checksFor(type, values),
      ...checksForBatch3(type, values),
      ...checksForBatch4(type, values),
      ...checksForBatch5(type, values),
      ...checksForBatch6(type, values),
      ...socialChecks(type, values, socialsOn),
      // Last, so a missing name is only scrolled to once the form is right.
      { id: "qrName", msg: name.trim() ? null : "Please name your QR code." },
    ],
    [type, values, name, socialsOn],
  );
  const errors = useMemo(() => {
    if (!submitted) return {};
    return Object.fromEntries(
      checks.filter((c) => c.msg).map((c) => [c.key ?? c.id, c.msg as string]),
    );
  }, [checks, submitted]);

  const s: FormState = {
    values,
    set: (k, v) => setValues((cur) => ({ ...cur, [k]: v })),
    update: (k, fn) => setValues((cur) => ({ ...cur, [k]: fn(cur[k] ?? "") })),
    patch: (fn) => setValues((cur) => fn(cur)),
    errors,
    isOpen: (acc) => open.includes(acc),
    toggle: (acc) =>
      setOpen((cur) => (cur.includes(acc) ? cur.filter((a) => a !== acc) : [...cur, acc])),
    socialsOn,
    setSocialsOn,
    moreSocials,
    setMoreSocials,
  };

  const next = () => {
    setSubmitted(true);
    const first = checks.find((c) => c.msg);
    if (!first) {
      onNext();
      return;
    }
    const wasClosed = first.acc && !open.includes(first.acc);
    if (first.acc && wasClosed) setOpen((cur) => [...cur, first.acc!]);
    // After the accordion has finished opening (their 240ms).
    setTimeout(
      () => {
        const el = document.getElementById(first.id);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      wasClosed ? 240 : 0,
    );
  };

  const Glyph = designerTypeIcons[type];
  let preview: ReactNode = null;
  let form: ReactNode = null;
  if (type === "website") {
    preview = <WebsitePreview values={values} open={previewOpen} onToggle={() => setPreviewOpen(!previewOpen)} />;
    form = <WebsiteForm s={s} />;
  } else if (type === "vcard") {
    preview = <VCardPreview values={values} selectedSocials={socialsOn} open={previewOpen} onToggle={() => setPreviewOpen(!previewOpen)} />;
    form = <VCardForm s={s} />;
  } else if (type === "multilink") {
    preview = <MultiLinkPreview values={values} selectedSocials={socialsOn} open={previewOpen} onToggle={() => setPreviewOpen(!previewOpen)} />;
    form = <MultiLinkForm s={s} />;
 } else {
    const p = { values, open: previewOpen, onToggle: () => setPreviewOpen(!previewOpen) };
    if (type === "applink") {
      preview = <AppLinkPreview {...p} />;
      form = <AppLinkForm s={s} />;
    } else if (type === "pdf") {
      preview = <PdfPreview {...p} />;
      form = <PdfForm s={s} />;
    } else if (type === "image") {
      preview = <ImagePreview {...p} />;
      form = <ImageForm s={s} />;
    } else if (type === "whatsapp") {
      preview = <WhatsAppPreview {...p} />;
      form = <WhatsAppForm s={s} />;
    } else if (type === "social") {
      // The preview lists platforms in the order the picker shows them.
      const ordered = (layout === "desktop" ? socialMediaOrderDesktop : socialMediaOrder).filter((k) => socialsOn.includes(k));
      preview = <SocialMediaPreview {...p} selectedSocials={ordered} />;
      form = <SocialMediaForm s={s} />;
    } else if (type === "menu") {
      preview = <MenuPreview {...p} />;
      form = <MenuForm s={s} />;
    } else if (type === "wifi") {
      preview = <WifiPreview {...p} />;
      form = <WifiForm s={s} />;
    } else if (type === "video") {
      preview = <VideoPreview {...p} />;
      form = <VideoForm s={s} />;
    } else if (type === "location") {
      preview = <MapsPreview {...p} />;
      form = <MapsForm s={s} />;
    } else if (type === "email") {
      preview = <EmailPreview {...p} />;
      form = <EmailForm s={s} />;
    } else if (type === "review") {
      preview = <ReviewPreview {...p} />;
      form = <ReviewForm s={s} />;
    } else if (type === "sms") {
      preview = <SmsPreview {...p} />;
      form = <SmsForm s={s} />;
    } else if (type === "phone") {
      preview = <PhonePreview {...p} />;
      form = <PhoneForm s={s} />;
    } else if (type === "text") {
      preview = <PlainTextPreview {...p} />;
      form = <PlainTextForm s={s} />;
    } else if (type === "payment") {
      preview = <PaymentPreview {...p} />;
      form = <PaymentForm s={s} />;
    } else if (type === "mp3") {
      preview = <AudioPreview {...p} />;
      form = <AudioForm s={s} />;    } else if (type === "event") {
      preview = <EventPreview {...p} />;
      form = <EventForm s={s} />;
    } else if (type === "coupon") {
      preview = <CouponPreview {...p} />;
      form = <CouponForm s={s} />;
    } else if (type === "feedback") {
      preview = <FeedbackPreview {...p} />;
      form = <FeedbackForm s={s} />;
    } else if (type === "business") {
      preview = <BusinessPreview {...p} selectedSocials={socialsOn} />;
      form = <BusinessForm s={s} />;
    }
  }

  const header = (
    <FormHeader
      icon={mobileHeaderIcon[type] ?? (Glyph ? <Glyph className="h-[22.7px] w-[22.7px]" /> : null)}
      title={mobileTypeTitle[type] ?? meta?.stepLabel ?? meta?.label ?? type}
      desc={mobileHeaderDesc[type] ?? meta?.stepDesc ?? meta?.desc ?? ""}
    />
  );

  if (layout === "desktop") {
    const d = desktopPreview[type] ?? { title: `${meta?.label ?? ""} Preview` };
    return (
      <div className="flex min-h-dvh flex-col bg-cd-page">
        <CreateHeader logoOnly />
        <section className="flex-1 py-5">
          <div className="mx-auto max-w-[1240px] px-5">
            {notice && <div className="mb-4 [&>div]:!mx-0 [&>div]:!mt-0 [&>div]:!max-w-none">{notice}</div>}
            <DesktopLayout.Provider value={true}>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              className="rounded-[18px] border border-cd-card-line bg-white shadow-[0_1px_2px_0_rgba(14,19,17,0.04)]"
            >
              <DesktopRail />
              {/* Their `.btm`: the form, and the preview beside it — below
                  it from 992px down. */}
              <div className="flex items-stretch p-5 [@media(max-width:992px)]:flex-col">
                <div className="min-w-0 flex-1" style={DESK_ZOOM}>
                  {/* Stretched to the preview column's height, as their `.btm`. */}
                  <div className="h-full rounded-[13px] border border-mc-line bg-white px-[17px] pt-[16.2px] pb-[17px]">
                    {header}
                    <Sep />
                    {form}
                    <Sep />
                    <NameField name={name} setName={setName} error={errors.qrName} />
                  </div>
                </div>
                <div className="ml-5 w-[350px] shrink-0 [@media(max-width:992px)]:mt-5 [@media(max-width:992px)]:ml-0 [@media(max-width:992px)]:w-full">
                  <div className="sticky top-[80px] [@media(max-width:992px)]:static">
                    <div className="mx-auto [@media(max-width:992px)]:max-w-[400px]" style={{ zoom: Z }}>
                      <DesktopPreview.Provider value={d}>{preview}</DesktopPreview.Provider>
                    </div>
                  </div>
                </div>
              </div>
              <DesktopFooter onBack={onBack} onNext={next} />
              <button type="submit" hidden />
            </form>
            </DesktopLayout.Provider>
          </div>
        </section>
        <MainSlimFooter />
      </div>
    );
  }

  return (
    // A real form, as theirs is, so the keyboard's Go/Enter runs the same
    // check as Next.
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="bg-white px-[14.6px] pt-[12.2px]"
    >
      <IconRail />
      {preview}
      <div className="mt-[13px] rounded-[13px] border border-mc-line bg-white px-[17px] pt-[16.2px] pb-[17px]">
        {header}
        <Sep />
        {form}
        <Sep />
        <NameField name={name} setName={setName} error={errors.qrName} />
      </div>
      <MobileFooter onBack={onBack} onNext={next} />
      {/* Lets the keyboard's Go key submit; the footer is an <a>, as theirs. */}
      <button type="submit" hidden />
    </form>
  );
}

/**
 * Step 2 below `md` for the twenty types the mobile mockups do not cover yet:
 * the mobile rail and footer around the existing form, which already
 * stacks at this width. Next keeps its old rule here — disabled until the
 * form is complete — because the click-to-validate flow needs per-field
 * wiring each type only gets when its mockup arrives.
 */
export function MobileFallbackStepTwo({
  complete,
  onBack,
  onNext,
  children,
}: {
  complete: boolean;
  onBack: () => void;
  onNext: () => void;
  children: ReactNode;
}) {
  return (
    <div className="bg-white px-[14.6px] pt-[12.2px]">
      <IconRail />
      <div className="mt-[13px]">{children}</div>
      <MobileFooter onBack={onBack} onNext={onNext} nextDisabled={!complete} />
    </div>
  );
}
