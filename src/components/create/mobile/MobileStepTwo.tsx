"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { allTypes } from "../qrTypes";
import { designerTypeIcons } from "../designerTypeIcons";
import { socials } from "./socials";
import {
  MultiLinkForm,
  NameField,
  FormHeader,
  Sep,
  VCardForm,
  WebsiteForm,
  checksFor,
  initiallyOpen,
} from "./forms";
import type { FormState } from "./forms";
import { MultiLinkPreview, VCardPreview, WebsitePreview } from "./previews";
import { ArrowLeft, ArrowRight, outlineBtn, smallBtn } from "./ui";

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
}: {
  type: string;
  values: Values;
  setValues: React.Dispatch<React.SetStateAction<Values>>;
  name: string;
  setName: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
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

  const checks = useMemo(() => checksFor(type, values), [type, values]);
  const errors = useMemo(() => {
    if (!submitted) return {};
    return Object.fromEntries(
      checks.filter((c) => c.msg).map((c) => [c.id, c.msg as string]),
    );
  }, [checks, submitted]);

  const s: FormState = {
    values,
    set: (k, v) => setValues((cur) => ({ ...cur, [k]: v })),
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
        <FormHeader
          icon={Glyph ? <Glyph className="h-[22.7px] w-[22.7px]" /> : null}
          title={meta?.stepLabel ?? meta?.label ?? type}
          desc={meta?.stepDesc ?? meta?.desc ?? ""}
        />
        <Sep />
        {form}
        <Sep />
        <NameField name={name} setName={setName} />
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
