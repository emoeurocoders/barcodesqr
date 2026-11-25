"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  CORNERS,
  DEFAULT_DESIGN,
  FRAMES,
  FRAME_TEXT_MAX,
  PATTERNS,
  THEMES,
  designIssue,
  frameHasText,
  normalizeHex,
  type QrDesign,
} from "@/lib/qrDesign";
import { CreateHeader } from "./CreateHeader";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";
import { QrPreview, ShapeSvg } from "./QrPreview";
import { cornerTile, patternTile } from "./qrArt";
import { UploadError, uploadQrLogo } from "./uploadFile";
import {
  IcoAi,
  IcoArrowRight,
  IcoBadgeTick,
  IcoBenefitTick,
  IcoBranded,
  IcoChevron,
  IcoCustom,
  IcoInfo,
  IcoNext,
  IcoPalette,
  IcoPhone,
  IcoPrev,
  IcoRemove,
  IcoReplace,
  IcoReset,
  IcoUpload,
} from "./designIcons";

/**
 * Step 3, "Customize & Download" — create_customize_desktop.html (JB,
 * 2026-11-24, Monday 5748799333). Desktop only; the mobile design is coming
 * separately.
 *
 * Everything the customer picks lives in the wizard (`DesignDraft`), so Back /
 * Edit Content and returning here keep it; Reset to Default resets the design
 * only and never touches step 2's content.
 *
 * The live preview, every frame thumbnail and the downloads are the one
 * renderer (qrArt.ts) on the customer's REAL content — JB: "the most
 * important test will be scanning the actual QR in the preview and confirming
 * that the downloaded file produces exactly the same result."
 */

/** The design plus the logo control's own state, kept by the wizard. */
export type DesignDraft = {
  design: QrDesign;
  /** The Logo toggle. Off keeps an uploaded logo, as the file does. */
  logoOn: boolean;
  logoUrl: string | null;
  logoName: string;
};

export const DEFAULT_DRAFT: DesignDraft = { design: DEFAULT_DESIGN, logoOn: false, logoUrl: null, logoName: "" };

/** The design as it will be saved and drawn: the logo only while switched on. */
export const effectiveDesign = (d: DesignDraft): QrDesign => ({
  ...d.design,
  logo: d.logoOn && d.logoUrl ? d.logoUrl : null,
});

/** A sample for the colour swatches: a real code at 32px is unreadable mush. */
const SWATCH_SAMPLE = "https://www.barcodesqr.com/";

/* ---- Small parts -------------------------------------------------------------- */

/** Their `.bdg`: the blue tick on whatever is selected. */
function Badge({ className }: { className: string }) {
  return (
    <span className={`absolute hidden h-[22px] w-[22px] items-center justify-center rounded-full bg-primary group-has-[input:checked]:flex ${className}`}>
      <IcoBadgeTick className="h-[13px] w-[13px]" />
    </span>
  );
}

/** Their `.til .itm`: a selectable tile around a hidden radio. */
const tile =
  "group relative box-border flex-none rounded-[12px] border border-cd-btn-line bg-white hover:border-cd-hover-line has-[input:checked]:border-primary has-[input:checked]:bg-cz-tile-on has-[input:checked]:shadow-[0_0_0_1px_var(--color-primary)] has-[input:focus-visible]:shadow-[0_0_0_3px_var(--color-cz-focus)]";
const tileLabel = "box-border flex h-full w-full cursor-pointer flex-col items-center justify-center";
const radio = "absolute h-px w-px opacity-0";

function Group({ children, first = false, className = "" }: { children: ReactNode; first?: boolean; className?: string }) {
  return <div className={`${first ? "pt-[16px]" : "mt-[18px] border-t border-cz-rule pt-[18px]"} ${className}`}>{children}</div>;
}

const h4 = "text-[16px] leading-[1.3em] font-bold text-ink";

/* ---- Frame carousel ------------------------------------------------------------- */

function FrameCarousel({ value, draft, set }: { value: string; draft: DesignDraft; set: (f: QrDesign["frame"]) => void }) {
  const trk = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const measure = () => {
    const t = trk.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth - 1;
    setEnds({ start: t.scrollLeft <= 0, end: t.scrollLeft >= max });
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const step = (dir: 1 | -1) => {
    const t = trk.current;
    const itm = t?.querySelector("li");
    if (!t || !itm) return;
    t.scrollBy({ left: dir * (itm.getBoundingClientRect().width + 10) * 2, behavior: "smooth" });
  };
  // Their `.frmLst input` change: a picked tile comes fully into view, and
  // the first / last snap to the track's ends, clear of the edge fades.
  const reveal = (i: number) => {
    const t = trk.current;
    const itm = t?.querySelectorAll("li")[i];
    if (!t || !itm) return;
    const max = t.scrollWidth - t.clientWidth;
    const tr = t.getBoundingClientRect();
    const ir = itm.getBoundingClientRect();
    const pad = 36;
    let to = t.scrollLeft;
    if (i === 0) to = 0;
    else if (i === FRAMES.length - 1) to = max;
    else if (ir.left < tr.left + pad) to = t.scrollLeft - (tr.left + pad - ir.left);
    else if (ir.right > tr.right - pad) to = t.scrollLeft + (ir.right - (tr.right - pad));
    if (to !== t.scrollLeft) t.scrollTo({ left: Math.max(0, Math.min(max, to)), behavior: "smooth" });
  };
  const fade =
    ends.start && !ends.end
      ? "[mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent)]"
      : ends.end && !ends.start
        ? "[mask-image:linear-gradient(to_left,#000_calc(100%-32px),transparent)]"
        : !ends.start && !ends.end
          ? "[mask-image:linear-gradient(to_right,transparent,#000_32px,#000_calc(100%-32px),transparent)]"
          : "";
  const arw =
    "flex h-9 w-9 flex-none items-center justify-center rounded-full border border-cd-btn-line bg-white text-ink hover:border-cd-hover-line hover:text-primary [&>svg]:h-4 [&>svg]:w-4";
  return (
    <div className="mt-[10px] flex items-center">
      <a
        href="#"
        aria-label="Previous frames"
        onClick={(e) => {
          e.preventDefault();
          step(-1);
        }}
        className={`${arw} ml-5 ${ends.start ? "pointer-events-none opacity-35" : ""}`}
      >
        <IcoPrev />
      </a>
      <div ref={trk} onScroll={measure} className={`mx-[10px] min-w-0 flex-[1_1_0] overflow-x-auto px-[2px] py-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${fade}`}>
        <ul className="flex">
          {FRAMES.map((fr, i) => (
            <li key={fr.key} className={`${tile} h-[100px] w-[104px] [&+&]:ml-[10px]`}>
              <label className={`${tileLabel} px-[4px] py-[6px]`}>
                <input
                  type="radio"
                  name="cuFrm"
                  value={fr.key}
                  checked={draft.design.frame === fr.key}
                  onChange={() => {
                    set(fr.key);
                    reveal(i);
                  }}
                  className={radio}
                  aria-label={fr.label}
                />
                {/* The real code in this frame, at thumbnail size — the same
                    drawing as the preview, so the two cannot disagree. */}
                <QrPreview value={value} design={{ ...effectiveDesign(draft), frame: fr.key }} size={58} shadow className="w-[58px] flex-none" />
                {fr.key === "none" && <span className="mt-[6px] text-[12.5px] font-semibold whitespace-nowrap text-body">No Frame</span>}
                <Badge className="-top-2 -right-2 shadow-[0_0_0_2px_#ffffff]" />
              </label>
            </li>
          ))}
        </ul>
      </div>
      <a
        href="#"
        aria-label="More frames"
        onClick={(e) => {
          e.preventDefault();
          step(1);
        }}
        className={`${arw} ${ends.end ? "pointer-events-none opacity-35" : ""}`}
      >
        <IcoNext />
      </a>
    </div>
  );
}

/* ---- Advanced colours ------------------------------------------------------------ */

function ColorField({
  label,
  aria,
  value,
  onChange,
  invalid,
}: {
  label: string;
  aria: string;
  value: string;
  onChange: (hex: string) => void;
  invalid: boolean;
}) {
  // The text box keeps what is being typed; only a valid hex reaches the
  // design, and leaving an invalid one restores the current colour (their
  // `cuHex` input / blur handlers).
  const [text, setText] = useState(value.toUpperCase());
  const [bad, setBad] = useState(false);
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    setText(value.toUpperCase());
    setBad(false);
  }
  const id = `cu-${aria.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-body">
        {label}
      </label>
      <div className="mt-[6px] flex items-center">
        <input
          type="color"
          aria-label={aria}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="box-border h-10 w-10 flex-none cursor-pointer appearance-none rounded-[10px] border border-cz-input-line bg-white p-[3px] [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <input
          id={id}
          type="text"
          value={text}
          maxLength={7}
          spellCheck={false}
          aria-invalid={bad || invalid || undefined}
          onChange={(e) => {
            setText(e.target.value);
            const hex = normalizeHex(e.target.value);
            setBad(!hex);
            if (hex) onChange(hex);
          }}
          onBlur={() => {
            if (!normalizeHex(text)) {
              setText(value.toUpperCase());
              setBad(false);
            }
          }}
          className={`ml-2 box-border h-10 min-w-0 flex-[1_1_0] rounded-[10px] border bg-white px-[10px] text-[14px] text-ink uppercase outline-none focus:border-primary ${bad || invalid ? "border-cz-remove" : "border-cz-input-line"}`}
        />
      </div>
    </div>
  );
}

/* ---- Tooltip --------------------------------------------------------------------- */

function Tip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <span ref={ref} className="relative inline-flex">
      <a
        href="#"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className="flex items-center justify-center text-primary-dark"
      >
        <IcoInfo className="block h-[14px] w-[14px]" />
      </a>
      {open && (
        <span
          role="tooltip"
          className="absolute top-[calc(100%+0.9em)] -right-[0.8em] z-[11] box-border w-[21em] rounded-[0.8em] bg-cz-tip px-[1em] py-[0.75em] text-left text-[12.5px] leading-[1.5em] font-normal whitespace-normal text-white before:absolute before:right-[1.1em] before:bottom-full before:border-[0.45em] before:border-transparent before:border-b-cz-tip before:content-['']"
        >
          {children}
        </span>
      )}
    </span>
  );
}

/* ---- The step ------------------------------------------------------------------- */

export function StepDesign({
  type,
  value,
  draft,
  setDraft,
  entitled,
  pendingActivation,
  busy,
  error,
  onBack,
  onContinue,
}: {
  type: string;
  /** What the code encodes — the real content from step 2. */
  value: string;
  draft: DesignDraft;
  setDraft: (u: (d: DesignDraft) => DesignDraft) => void;
  /** Already paid: no "Subscription required" under the button. */
  entitled: boolean;
  /**
   * A new managed or hosted code: its short link only goes live once checkout
   * saves it, so the preview says so (JB, 2026-11-25: customers testing the
   * preview must not think the code is broken).
   */
  pendingActivation: boolean;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onContinue: () => void;
}) {
  const d = draft.design;
  const design = effectiveDesign(draft);
  const issue = designIssue(design);
  const setDesign = (patch: Partial<QrDesign>) => setDraft((x) => ({ ...x, design: { ...x.design, ...patch } }));
  // A hand-picked colour clears the theme highlight (their advanced inputs).
  const setColor = (k: "fg" | "bg" | "fr", hex: string) => setDesign({ [k]: hex, theme: null });

  const [advOpen, setAdvOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickLogo = async (file: File | undefined) => {
    if (!file) return;
    setLogoError(null);
    setUploading(true);
    const local = URL.createObjectURL(file);
    setLocalLogo(local);
    try {
      const url = await uploadQrLogo(type, file);
      setDraft((x) => ({ ...x, logoOn: true, logoUrl: url, logoName: file.name }));
    } catch (e) {
      setLocalLogo(null);
      setLogoError(e instanceof UploadError ? e.message : "That logo could not be uploaded.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const removeLogo = () => {
    setLocalLogo(null);
    setLogoError(null);
    setDraft((x) => ({ ...x, logoUrl: null, logoName: "" }));
  };
  // Reset to Default: the design only — never the content from step 2.
  const reset = () => {
    setAdvOpen(false);
    setLocalLogo(null);
    setLogoError(null);
    setDraft(() => DEFAULT_DRAFT);
  };

  const blocked = !!issue || uploading || busy;
  const thumb = localLogo ?? draft.logoUrl;

  return (
    <div className="flex min-h-dvh flex-col bg-cd-page">
      <CreateHeader current={3} backLabel="Back / Edit Content" onBack={onBack} />
      {/* The file's text runs at the font's own line height. */}
      <section className="flex-1 pt-5 pb-[30px] leading-[normal]">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="flex items-stretch [@media(max-width:992px)]:flex-col">
            {/* ---- ctl ---- */}
            <div className="min-w-0 flex-[1_1_0]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[34px] leading-[1.2em] font-extrabold tracking-[-0.02em] text-ink">Customize Your QR Code</h2>
                  <p className="mt-[0.5em] max-w-[36em] text-[16.5px] leading-[1.5em] text-muted">
                    Choose a design style, then personalize your QR code with frames, colors, patterns and more.
                  </p>
                </div>
              </div>

              {/* Design style. Custom is the working option; Branded waits
                  for its templates (JB) and AI is Coming Soon — both off. */}
              <ul className="mt-[22px] grid grid-cols-3 gap-[14px] [@media(max-width:768px)]:grid-cols-1">
                {[
                  { v: "custom", ico: <IcoCustom className="block h-[34px] w-[34px]" />, t: "Custom Designs", s: "Frames, colors, patterns and corners.", on: true },
                  { v: "branded", ico: <IcoBranded className="block h-[34px] w-[34px]" />, t: "Branded Designs", s: "Professional templates with your logo and brand colors.", on: false },
                  { v: "ai", ico: <IcoAi className="block h-[34px] w-[34px]" />, t: "AI Designs", s: "Generate unique QR artwork with AI.", on: false, soon: true },
                ].map((c) => (
                  <li
                    key={c.v}
                    className={`group relative rounded-[16px] border border-cd-card-line bg-white shadow-[0_1px_2px_0_rgba(14,19,17,0.04)] has-[input:enabled]:hover:border-cd-hover-line has-[input:checked]:border-primary has-[input:checked]:bg-cz-card-on has-[input:checked]:shadow-[0_0_0_1px_var(--color-primary)] has-[input:focus-visible]:shadow-[0_0_0_3px_var(--color-cz-focus)]`}
                  >
                    <label className={`box-border flex min-h-full items-start px-[14px] py-[16px] ${c.on ? "cursor-pointer" : "cursor-default"}`}>
                      <input type="radio" name="cuDsg" value={c.v} defaultChecked={c.v === "custom"} disabled={!c.on} className={radio} />
                      <span className={`flex h-10 w-10 flex-none items-center justify-center text-ink ${c.on ? "" : "opacity-55"}`}>{c.ico}</span>
                      <span className="min-w-0 pl-[10px]">
                        <span className={`flex flex-wrap items-center gap-[7px] text-[15.5px] leading-[1.3em] font-bold ${c.on ? "text-ink group-has-[input:checked]:text-primary-dark" : "text-muted"}`}>
                          {c.t}
                          {c.soon && (
                            <span className="rounded-full bg-cz-tag px-[0.7em] py-[0.2em] text-[11px] font-semibold whitespace-nowrap text-cz-tag-ink">Coming Soon</span>
                          )}
                        </span>
                        <span className={`mt-[0.3em] block text-[13.5px] leading-[1.45em] text-muted ${c.on ? "" : "opacity-55"}`}>{c.s}</span>
                      </span>
                      <Badge className="top-[14px] right-[14px]" />
                    </label>
                  </li>
                ))}
              </ul>

              {/* ---- Design Options ---- */}
              <div className="mt-5 rounded-[18px] border border-cd-card-line bg-white px-6 pt-[22px] pb-6 shadow-[0_1px_2px_0_rgba(14,19,17,0.04)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[21px] font-extrabold tracking-[-0.01em] text-ink">Design Options</h3>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      reset();
                    }}
                    className="inline-flex items-center gap-2 rounded-[12px] border border-cd-btn-line bg-white px-[14px] py-[9px] text-[14px] font-semibold whitespace-nowrap text-ink hover:border-cd-hover-line hover:text-primary [&>svg]:h-4 [&>svg]:w-4 [&>svg]:flex-none"
                  >
                    <IcoReset />
                    Reset to Default
                  </a>
                </div>

                <Group first>
                  <h4 className={h4}>Frame</h4>
                  <FrameCarousel value={value} draft={draft} set={(frame) => setDesign({ frame })} />
                  {frameHasText(d.frame) && (
                    <div className="mt-[10px] flex items-center">
                      <label htmlFor="cuFrmTxt" className="mr-3 text-[14px] font-semibold text-body">
                        Frame text
                      </label>
                      <input
                        id="cuFrmTxt"
                        type="text"
                        maxLength={FRAME_TEXT_MAX}
                        value={d.text}
                        onChange={(e) => setDesign({ text: e.target.value.slice(0, FRAME_TEXT_MAX) })}
                        className="box-border h-10 w-[200px] rounded-[10px] border border-cz-input-line bg-white px-3 text-[14px] text-ink outline-none focus:border-primary"
                      />
                      <span className="ml-[10px] text-[12.5px] text-faint">
                        {`${d.text.length}/${FRAME_TEXT_MAX}`}
                      </span>
                    </div>
                  )}
                </Group>

                <Group>
                  <div className="flex items-start justify-between [@media(max-width:1100px)]:flex-wrap">
                    <div className="min-w-0 pr-4">
                      <h4 className={h4}>
                        Colors <span className="font-normal text-body">(Theme)</span>
                      </h4>
                      <p className="mt-[0.3em] text-[14px] leading-[1.45em] text-muted">Choose a color combination that matches your style.</p>
                    </div>
                    <a
                      href="#"
                      aria-expanded={advOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        setAdvOpen((o) => !o);
                      }}
                      className={`inline-flex flex-none items-center gap-2 rounded-[12px] border bg-white px-[14px] py-[10px] text-[14.5px] font-semibold whitespace-nowrap hover:border-cd-hover-line hover:text-primary [@media(max-width:1100px)]:mt-3 ${advOpen ? "border-cd-hover-line text-primary" : "border-cd-btn-line text-ink"}`}
                    >
                      <IcoPalette className="h-[17px] w-[17px] flex-none" />
                      Advanced Colors
                      <IcoChevron className={`h-[14px] w-[14px] flex-none ${advOpen ? "rotate-180" : ""}`} />
                    </a>
                  </div>
                  <ul className="mt-[14px] flex flex-wrap gap-[10px]">
                    {THEMES.map((t) => (
                      <li key={t.key} className={`${tile} h-[84px] w-[84px]`}>
                        <label className={tileLabel}>
                          <input
                            type="radio"
                            name="cuClr"
                            value={t.key}
                            checked={d.theme === t.key}
                            onChange={() => setDesign({ fg: t.fg, bg: t.bg, fr: t.fr, theme: t.key })}
                            className={radio}
                          />
                          <QrPreview value={SWATCH_SAMPLE} design={{ ...DEFAULT_DESIGN, fg: t.fg, bg: t.bg }} plain size={32} className="h-8 w-8" />
                          <span className="mt-[6px] text-[12.5px] font-semibold whitespace-nowrap text-body">{t.label}</span>
                          <Badge className="-top-2 -right-2 shadow-[0_0_0_2px_#ffffff]" />
                        </label>
                      </li>
                    ))}
                  </ul>
                  {advOpen && (
                    <div className="mt-[14px] rounded-[12px] border border-cz-adv-line bg-cz-adv px-4 pt-[14px] pb-4">
                      <div className="grid grid-cols-3 gap-[14px] [@media(max-width:768px)]:grid-cols-1">
                        <ColorField label="Foreground" aria="Foreground color" value={d.fg} onChange={(h) => setColor("fg", h)} invalid={issue?.field === "fg"} />
                        <ColorField label="Background" aria="Background color" value={d.bg} onChange={(h) => setColor("bg", h)} invalid={false} />
                        <ColorField label="Frame" aria="Frame color" value={d.fr} onChange={(h) => setColor("fr", h)} invalid={issue?.field === "fr"} />
                      </div>
                      <p className="mt-3 text-[13px] leading-[1.5em] text-muted">
                        Keep a dark code on a light background for the most reliable scans. Light or low-contrast combinations may not scan on every phone, so always test the final download.
                      </p>
                    </div>
                  )}
                  {/* Unmocked: why Continue is off. */}
                  {issue && issue.field !== "pattern" && (
                    <p role="alert" className="mt-3 rounded-[10px] border border-cz-remove/30 bg-cz-remove/5 px-3 py-2 text-[13px] leading-[1.45em] text-cz-remove">
                      {issue.message}
                    </p>
                  )}
                </Group>

                <Group>
                  <div className="flex [@media(max-width:768px)]:flex-col">
                    <div className="min-w-0 flex-[1_1_0]">
                      <h4 className={h4}>
                        Pattern <span className="font-normal text-body">(QR style)</span>
                      </h4>
                      <ul className="mt-3 flex">
                        {PATTERNS.map((p) => (
                          <li key={p} className={`${tile} aspect-[68/60] w-[17.6%] flex-[0_0_17.6%] [&+&]:ml-[3%]`}>
                            <label className={tileLabel}>
                              <input type="radio" name="cuPat" value={p} checked={d.pattern === p} onChange={() => setDesign({ pattern: p })} className={radio} />
                              <ShapeSvg shapes={patternTile(p, 5, "#0e1311")} w={5} h={5} className="block h-auto w-[44%]" label={PATTERN_LABEL[p]} />
                              <Badge className="-top-2 -right-2 shadow-[0_0_0_2px_#ffffff]" />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="ml-[22px] min-w-0 flex-[1_1_0] border-l border-cz-rule pl-[22px] [@media(max-width:768px)]:mt-[18px] [@media(max-width:768px)]:ml-0 [@media(max-width:768px)]:border-l-0 [@media(max-width:768px)]:pl-0">
                      <h4 className={h4}>
                        Corners <span className="font-normal text-body">(eye style)</span>
                      </h4>
                      <ul className="mt-3 flex">
                        {CORNERS.map((c) => (
                          <li key={c} className={`${tile} aspect-[68/60] w-[17.6%] flex-[0_0_17.6%] [&+&]:ml-[3%]`}>
                            <label className={tileLabel}>
                              <input type="radio" name="cuCrn" value={c} checked={d.corners === c} onChange={() => setDesign({ corners: c })} className={radio} />
                              <ShapeSvg shapes={cornerTile(c, 7, "#0e1311")} w={7} h={7} className="block h-auto w-[44%]" label={CORNER_LABEL[c]} />
                              <Badge className="-top-2 -right-2 shadow-[0_0_0_2px_#ffffff]" />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {issue?.field === "pattern" && (
                    <p role="alert" className="mt-3 rounded-[10px] border border-cz-remove/30 bg-cz-remove/5 px-3 py-2 text-[13px] leading-[1.45em] text-cz-remove">
                      {issue.message}
                    </p>
                  )}
                </Group>

                <Group>
                  <div className="flex items-start">
                    <label className="relative mt-[2px] mr-[14px] box-border block h-[26px] w-[46px] flex-none cursor-pointer rounded-full bg-cd-btn-line p-[3px] has-[input:checked]:bg-primary has-[input:focus-visible]:shadow-[0_0_0_3px_var(--color-cz-focus)]">
                      <input
                        type="checkbox"
                        aria-label="Add a logo"
                        checked={draft.logoOn}
                        onChange={(e) => setDraft((x) => ({ ...x, logoOn: e.target.checked }))}
                        className="peer absolute h-px w-px opacity-0"
                      />
                      <i className="block h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(14,19,17,0.2)] transition-[margin] duration-150 ease-out peer-checked:ml-5" />
                    </label>
                    <div>
                      <h4 className={h4}>
                        Logo <span className="font-normal text-body">(Optional)</span>
                      </h4>
                      <p className="mt-[0.3em] text-[14px] leading-[1.45em] text-muted">Add your logo, icon or image to the center of your QR code.</p>
                    </div>
                  </div>
                  {draft.logoOn && (
                    <div className="mt-[14px]">
                      {thumb ? (
                        <div className="flex items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element -- a picked file / bucket URL, not an app asset */}
                          <img src={thumb} alt="Logo preview" className="box-border block h-14 w-14 flex-none rounded-[10px] border border-cz-thumb-line bg-white object-contain p-1" />
                          <div className="min-w-0 pl-[14px]">
                            <p className="overflow-hidden text-[14px] font-semibold text-ellipsis whitespace-nowrap text-ink">
                              {uploading ? "Uploading…" : draft.logoName}
                            </p>
                            <div className="mt-1 flex items-center">
                              <label htmlFor="cuLgoFile" className="inline-flex cursor-pointer items-center gap-[5px] text-[13px] font-semibold text-primary [&>svg]:h-[14px] [&>svg]:w-[14px]">
                                <IcoReplace />
                                Replace
                              </label>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeLogo();
                                }}
                                className="ml-4 inline-flex items-center gap-[5px] text-[13px] font-semibold text-cz-remove [&>svg]:h-[14px] [&>svg]:w-[14px]"
                              >
                                <IcoRemove />
                                Remove
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="cuLgoFile" className="relative block cursor-pointer rounded-[12px] border-2 border-dashed border-cz-upload-line px-[14px] py-[18px] text-center hover:border-cd-hover-line hover:bg-cd-hover">
                          <IcoUpload className="mx-auto block h-[26px] w-[26px] text-faint" />
                          <span className="mt-2 block text-[14px] font-semibold text-body">
                            <b className="font-semibold text-primary">Click to upload</b> your logo
                          </span>
                          <span className="mt-1 block text-[12.5px] text-faint">PNG, JPG or SVG &middot; Max 2 MB &middot; Square images work best</span>
                        </label>
                      )}
                      <input
                        ref={fileRef}
                        id="cuLgoFile"
                        type="file"
                        name="cuLgoFile"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={(e) => pickLogo(e.target.files?.[0])}
                        className="absolute h-px w-px opacity-0"
                      />
                      {logoError && (
                        <p role="alert" className="mt-2 text-[13px] text-cz-remove">
                          {logoError}
                        </p>
                      )}
                      <p className="mt-3 flex items-start text-[13px] leading-[1.5em] text-muted">
                        <IcoInfo className="mt-[2px] mr-[7px] h-[15px] w-[15px] flex-none text-faint" />
                        A logo covers part of the code, so keep it small and scan-test your final download with a phone before printing.
                      </p>
                    </div>
                  )}
                </Group>
              </div>
            </div>

            {/* ---- pvw ---- */}
            <div className="ml-6 flex w-[380px] flex-none items-stretch [@media(max-width:1100px)]:w-[340px] [@media(max-width:992px)]:mt-5 [@media(max-width:992px)]:ml-0 [@media(max-width:992px)]:w-full">
              <div className="w-full">
                <div className="sticky top-[103px] rounded-[18px] border border-cd-card-line bg-white px-6 pt-[22px] pb-6 shadow-[0_1px_2px_0_rgba(14,19,17,0.04)] [@media(max-width:992px)]:static">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[21px] font-extrabold tracking-[-0.01em] text-ink">Live Preview</h3>
                    <span className="inline-flex items-center gap-[6px] rounded-full bg-cz-card-on px-[11px] py-[6px] text-[12.5px] font-semibold whitespace-nowrap text-primary-dark">
                      Live Design Preview
                      <Tip label="About the live preview">
                        This is your real QR code with your content, in the design you picked. What you see here is exactly what you download.
                        {pendingActivation &&
                          " It goes live as soon as checkout is complete; until then, scanning it opens a “not active yet” page."}
                      </Tip>
                    </span>
                  </div>
                  <div className="mt-[18px] flex justify-center rounded-[16px] border border-cz-stage-line bg-[linear-gradient(180deg,#ebf6fa_0%,#eef6fa_60%,#f7fafd_100%)] px-6 py-7">
                    <QrPreview
                      value={value}
                      design={design}
                      size={270}
                      shadow
                      title="Your QR code"
                      className="w-full max-w-[270px] [@media(max-width:992px)]:max-w-[312px]"
                    />
                  </div>
                  {pendingActivation ? (
                    // Unmocked (JB, 2026-11-25): a tracked code's link is
                    // not live until checkout, and the preview must say so.
                    <p className="mt-[10px] text-center text-[12.5px] leading-[1.45em] text-faint">
                      This is your actual QR code.{" "}
                      <b className="font-semibold text-body">It activates as soon as checkout is complete</b> — scanning it now opens a “not active yet” page. The image won’t change.
                    </p>
                  ) : (
                    <p className="mt-[10px] text-center text-[12.5px] leading-[1.45em] text-faint">
                      This is your actual QR code. Scan it with your phone to test it before you continue.
                    </p>
                  )}
                  <div className="mt-4 flex items-center rounded-[14px] border border-cz-test-line bg-cz-test px-4 py-[13px]">
                    <span className="flex h-9 w-9 flex-none items-center justify-center text-primary-dark">
                      <IcoPhone className="h-auto w-full" />
                    </span>
                    <div className="min-w-0 pl-[10px]">
                      <p className="text-[15px] font-bold text-ink">Test your QR code</p>
                      <p className="mt-[2px] text-[13px] leading-[1.2em] text-prose">Scan with your phone camera to make sure it works.</p>
                    </div>
                  </div>
                  <ul className="mt-4 px-1">
                    {[
                      "High-contrast designs help improve scan reliability.",
                      "Save and manage your QR designs in your account.",
                      "Download in PNG, JPG or SVG after checkout.",
                    ].map((b) => (
                      <li key={b} className="flex items-start text-[14.5px] leading-[1.45em] text-body [&+&]:mt-2">
                        <IcoBenefitTick className="mt-[2px] mr-[10px] h-[17px] w-[17px] flex-none" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <a
                      href="#"
                      aria-disabled={blocked || undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!blocked) onContinue();
                      }}
                      className={`flex w-full items-center justify-center gap-[0.6em] rounded-[0.7em] px-[2.2em] py-[1.05em] text-[16px] leading-[1em] font-medium text-white capitalize transition-colors [&>svg]:h-[1.15em] [&>svg]:w-[1.15em] ${blocked ? "cursor-not-allowed bg-primary/50" : "bg-primary hover:bg-primary-press"}`}
                    >
                      {busy ? "Saving…" : "Continue to Download"}
                      <IcoArrowRight />
                    </a>
                  </div>
                  {error && (
                    <p role="alert" className="mt-[10px] text-center text-[13px] text-cz-remove">
                      {error}
                    </p>
                  )}
                  {!entitled && <p className="mt-[10px] text-center text-[13px] text-faint">Subscription required to download.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MainSlimFooter />
    </div>
  );
}

/** Their tiles' aria-labels, verbatim. */
const PATTERN_LABEL: Record<QrDesign["pattern"], string> = {
  square: "Square modules",
  dots: "Dot modules",
  rounded: "Rounded modules",
  fluid: "Fluid modules",
  small: "Small dot modules",
};
const CORNER_LABEL: Record<QrDesign["corners"], string> = {
  square: "Square corners",
  dot: "Rounded corners with dot",
  circle: "Circle corners",
  rounded: "Rounded corners",
  diamond: "Diamond corners",
};
