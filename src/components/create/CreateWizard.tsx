"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveQrCode, updateQrCode } from "@/app/actions/qr";
import { stashPendingQr } from "@/lib/pendingQr";
// `Download` is shelved with step 3.
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { StepRail } from "./StepRail";
import { MobileTypePicker } from "./MobileTypePicker";
import { DesktopTypePicker } from "./DesktopTypePicker";
import { CreateHeader } from "./CreateHeader";
import { MainSlimFooter } from "@/components/layout/MainSlimFooter";
import {
  MobileFallbackStepTwo,
  MobileStepTwo,
} from "./mobile/MobileStepTwo";
import { mobileTypes } from "./mobile/forms";
import { useIsMobile } from "./useIsMobile";
import { StepContent } from "./StepContent";
// Shelved with step 3: import { StepCustomize } from "./StepCustomize";
import { VCardPreview } from "./VCardPreview";
import { MultiLinkPreview } from "./MultiLinkPreview";
import { SocialPreview } from "./SocialPreview";
import { PdfPreview } from "./previews/PdfPreview";
import { ImagePreview } from "./previews/ImagePreview";
import { VideoPreview } from "./previews/VideoPreview";
import { AudioPreview } from "./previews/AudioPreview";
import { WebsitePreview } from "./previews/WebsitePreview";
import { AppLinkPreview } from "./previews/AppLinkPreview";
import { EmailPreview } from "./previews/EmailPreview";
import { SmsPreview } from "./previews/SmsPreview";
import { WhatsAppPreview } from "./previews/WhatsAppPreview";
import { CallPreview } from "./previews/CallPreview";
import { TextPreview } from "./previews/TextPreview";
import { LocationPreview } from "./previews/LocationPreview";
import { MenuPreview } from "./previews/MenuPreview";
import { CouponPreview } from "./previews/CouponPreview";
import { FeedbackPreview } from "./previews/FeedbackPreview";
import { PaymentPreview } from "./previews/PaymentPreview";
import { EventPreview } from "./previews/EventPreview";
import { BusinessPreview } from "./previews/BusinessPreview";
import { WifiPreview } from "./previews/WifiPreview";
import { GoogleReviewPreview } from "./previews/GoogleReviewPreview";
import { QrPreview, defaultQrStyle } from "./QrPreview";
import type { QrStyle } from "./QrPreview";
import { allTypes } from "./qrTypes";
import { encodeQr, isDynamic } from "./encodeQr";
import { isComplete } from "./validate";
import { Button } from "@/components/ui/Button";
import { Paywall } from "@/components/paywall/Paywall";
import { usePaywall } from "@/components/paywall/usePaywall";

type Values = Record<string, string>;

const defaultName = (type: string) => {
  const meta = allTypes.find((t) => t.value === type);
  // The creator names the code after what step 2 calls the format, not what
  // step 1's list calls it — "My Text QR Code", not "My Plain Text…". Both
  // layouts agree on every name now (Google Maps was the last exception).
  return `My ${meta?.stepLabel ?? meta?.label ?? "QR"} QR Code`;
};

// Completion lives in validate.ts now: every *visible* required field filled,
// and nothing filled-but-malformed — so a URL without a TLD blocks Next.

/** A saved code reopened from the dashboard's "Edit". */
export type EditingCode = { id: string; type: string; name: string; values: Values };

export function CreateWizard({
  entitled,
  editing,
}: {
  entitled: boolean;
  editing?: EditingCode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const isMobile = useIsMobile();

  /**
   * Which step is showing lives in the URL: step 2 is `/create?type=vcard`,
   * step 1 is `/create`. Picking a type pushes a history entry, so a phone's
   * own back button returns to the picker instead of leaving the creator,
   * and a form can be linked to directly. Pushed with `history.pushState`,
   * which Next syncs into `useSearchParams` without a server round trip.
   */
  const urlType = params.get("type");
  const step = urlType && allTypes.some((t) => t.value === urlType) ? 2 : 1;

  // The last type chosen; the open form's type when on step 2.
  const [picked, setPicked] = useState("website");
  const type = step === 2 ? urlType! : picked;

  /**
   * What has been typed, kept per type. Going Back and reopening the same
   * type finds it as it was left (JB: back navigation must not lose entered
   * data); opening a different type starts that type fresh.
   */
  const [draft, setDraft] = useState<{ type: string; values: Values; name: string }>(
    editing
      ? { type: editing.type, values: editing.values, name: editing.name }
      : { type: "website", values: {}, name: defaultName("website") },
  );
  // Editing applies to the saved code's own type only; anything else on the
  // URL is an ordinary new code.
  const isEditing = !!editing && step === 2 && type === editing.type;
  const current =
    draft.type === type ? draft : { type, values: {}, name: defaultName(type) };
  const values = current.values;
  const name = current.name;
  const setValues: Dispatch<SetStateAction<Values>> = (u) =>
    setDraft((d) => {
      const base = d.type === type ? d : { type, values: {}, name: defaultName(type) };
      return { ...base, values: typeof u === "function" ? u(base.values) : u };
    });
  const setName = (v: string) =>
    setDraft((d) => {
      const base = d.type === type ? d : { type, values: {}, name: defaultName(type) };
      return { ...base, name: v };
    });

  /** Whether step 2 was reached from this page, i.e. there is a step 1 to go back to. */
  const pushed = useRef(false);

  // The style is still read by step 2's preview; only the customiser wrote to
  // it, so the setter is shelved with step 3.
  const [style] = useState<QrStyle>(defaultQrStyle);

  /* --- STEP 3 STATE — SHELVED ---------------------------------------------
     Restore alongside the two blocks below.

     WHEN THE DOWNLOAD IS RESTORED, call markDownloaded() from
     lib/reviewPrompt.ts inside the download handler, on SUCCESS only:

       import { markDownloaded } from "@/lib/reviewPrompt";
       ...
       onClick={() => { download?.(ext); markDownloaded(); }}

     That is the trigger for the review modal. It records eligibility and
     nothing else — the modal deliberately does NOT open here. It opens on the
     next dashboard view, so the ask never lands on top of the download the
     customer just came for. See lib/reviewPrompt.ts.

     const [style, setStyle] = useState<QrStyle>(defaultQrStyle);
     const [password, setPassword] = useState("");

     // The exporter handed up by the QR renderer once it has a canvas to
     // read. State rather than a ref: the download buttons' behaviour
     // depends on whether it has arrived, and that is what state is for.
     const [download, setDownload] = useState<
       ((ext: "png" | "jpeg" | "svg") => void) | null
     >(null);
  ----------------------------------------------------------------------- */

  const qrValue = useMemo(() => encodeQr(type, values), [type, values]);
  const complete = isComplete(type, values);

  /**
   * Downloading is the moment the code is finished, so that is where the
   * paywall belongs — not on step 1's Continue, where the mockup could only
   * put it because a static page has nowhere else to go.
   */
  const paywall = usePaywall();

  /**
   * Step 2's Next is the gate. The code is fully described by this point, so
   * it is the last moment that is honest to ask for money — later, and we
   * have let someone customise something they cannot have.
   *
   * With step 3 shelved there is nowhere further to send someone who has
   * already paid, so they go to the dashboard, which is where their codes
   * live and where checkout drops them anyway.
   *
   * Someone who has paid gets the code saved here and now. Anyone else gets
   * it stashed in the browser first: every way out of the paywall ends on the
   * dashboard, which claims the stash once they are signed in and paid.
   */
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const finishStepTwo = async () => {
    if (saving) return;
    const draft = { type, name: name.trim() || defaultName(type), values };
    if (isEditing) {
      setSaving(true);
      setSaveError(null);
      const res = await updateQrCode({ id: editing!.id, name: draft.name, values });
      if ("id" in res) {
        router.push(`/dashboard?updated=${encodeURIComponent(res.id)}`);
      } else {
        setSaving(false);
        setSaveError(res.error);
      }
      return;
    }
    if (!entitled) {
      stashPendingQr(draft);
      paywall.show();
      return;
    }
    setSaving(true);
    setSaveError(null);
    const res = await saveQrCode(draft);
    if ("id" in res) {
      router.push(`/dashboard?new=${encodeURIComponent(res.id)}`);
    } else {
      setSaving(false);
      setSaveError(res.error);
    }
  };

  // Choosing a type advances immediately — on the live creator one click on a
  // format takes you into its form, and the 2026-10-15 mobile picker does the
  // same. Selecting and then hunting for a Next button below a 23-card grid
  // is how you end up unable to build anything.
  const chooseType = (next: string) => {
    setPicked(next);
    // A second push of the same entry would make Back pop to a copy of the
    // form.
    if (new URLSearchParams(window.location.search).get("type") === next) return;
    pushed.current = true;
    window.history.pushState(null, "", `/create?type=${encodeURIComponent(next)}`);
  };

  // The page itself scrolls (on desktop too, since step 1 became a page), so
  // a new step would otherwise open wherever the last one was left.
  useEffect(() => {
    // Instant: the site scrolls smoothly, and gliding up a 2,000px page
    // reads as the new step loading from the bottom.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Back pops our own history entry, so the browser's back and ours agree.
  // Arriving straight on `?type=` there is none to pop — replace instead of
  // walking the visitor off the site.
  const back = () => {
    // Editing started on the dashboard; that is where Back goes.
    if (isEditing) {
      router.push("/dashboard");
      return;
    }
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "/create");
    }
  };

  // The desktop step-2 body. Below `md` it is also what the types without a
  // mobile mockup yet still use, inside the mobile rail and footer.
  const stepTwoBody = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <StepContent
          type={type}
          values={values}
          setValues={setValues}
          name={name}
          setName={setName}
        />
        {/* --- STEP 3 — SHELVED ------------------------------------
            Customise & Protect, kept whole against the PM changing
            their mind. Restore this and the footer block below, put
            the `step === 2 ?` ternaries back around both, and have
            `finishStepTwo` push step 3 — the step now lives in the URL
            (`?type=`), so add a `&step=3` the way `chooseType` pushes.

            <StepCustomize
              style={style}
              setStyle={setStyle}
              password={password}
              setPassword={setPassword}
            />
        --------------------------------------------------------- */}
      </div>

      <aside className="order-first lg:order-none lg:sticky lg:top-6 lg:self-start">
        <ContentPreview
          type={type}
          values={values}
          qrValue={qrValue}
          style={style}
        />
        {/* --- STEP 3 PREVIEW — SHELVED ----------------------------
            <SidePreview
              qrValue={qrValue}
              style={style}
              // Wrapped: a bare function passed to a setter is read
              // as an updater, and React would call it with the old
              // value.
              onReady={(fn) => setDownload(() => fn)}
            />
        --------------------------------------------------------- */}
      </aside>
    </div>
  );

  const paywallLayer = (
    <Paywall
      open={paywall.open}
      qrValue={qrValue}
      qrStyle={style}
      onClose={paywall.close}
    />
  );

  // Step 1 at `md` and up is create_desktop.html (2026-10-21): a page, not
  // the full-screen card — its own header with the steps and Back to Home,
  // the 23-format grid on the grey page, the slim footer. Step 2 keeps the
  // card until its desktop redesign lands (the createDsk2 rules are already
  // in the synced CSS, but no page uses them yet).
  if (step === 1) {
    return (
      <div className="flex min-h-dvh flex-col bg-white md:bg-cd-page">
        <div className="md:hidden">
          <MobileTypePicker onChoose={chooseType} />
        </div>
        <div className="hidden min-h-dvh flex-col md:flex">
          <CreateHeader current={1} />
          <section className="flex-1 bg-cd-page py-5">
            <DesktopTypePicker onChoose={chooseType} />
          </section>
          <MainSlimFooter />
        </div>
        {paywallLayer}
      </div>
    );
  }

  return (
    // Desktop: a full-screen card with its own scrolling body and a pinned
    // footer. Below `md` (create_mobile*.html) none of that — the page
    // scrolls as a page.
    <div className="bg-white md:flex md:h-dvh md:flex-col md:bg-bg-alt md:p-4">
    <div className="bg-white md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-hidden md:rounded-2xl md:border md:border-line">
      <div className="hidden md:block">
        <StepRail current={step} />
      </div>

      <main className="md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain">
      {/*
        Editing a saved code. Unmocked — the designer has no edit flow — so
        it borrows the info-note look. What it says depends on the type: a
        static code carries its content, so the image changes and must be
        downloaded again; a hosted one keeps its image.
      */}
      {isEditing && (
        <div className="mx-[14.6px] mt-3 flex items-start gap-2 rounded-xl border border-mc-note-line bg-mc-note px-3 py-2.5 text-[13px] leading-snug text-prose md:mx-auto md:mt-6 md:max-w-6xl md:px-4">
          <Info className="mt-px h-4 w-4 shrink-0 text-primary" />
          <p>
            <b className="font-semibold text-mc-note-ink">Editing “{editing!.name}”.</b>{" "}
            {isDynamic(type)
              ? "Saving updates what this code shows. The QR image stays the same."
              : "This code holds its content directly, so saving changes the QR image. Download it again afterwards — copies already printed keep the old content."}
          </p>
        </div>
      )}
      {/* Step 2 sits in a narrower centred column, which is what makes the
          form read as a card rather than a sheet. */}
      {isMobile && mobileTypes.has(type) ? (
        <MobileStepTwo
          type={type}
          values={values}
          setValues={setValues}
          name={name}
          setName={setName}
          onBack={back}
          onNext={finishStepTwo}
        />
      ) : isMobile ? (
        <MobileFallbackStepTwo
          complete={complete}
          onBack={back}
          onNext={finishStepTwo}
        >
          {stepTwoBody}
        </MobileFallbackStepTwo>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {stepTwoBody}
        </div>
      )}
      </main>

      {/* Footer actions — pinned to the bottom of the shell. Desktop only:
          the mobile steps carry their own (cards that go straight into a form
          on step 1, the sticky Back/Next on step 2). */}
      <div className="hidden shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-6 md:flex lg:px-8">
        <Button
          variant="outline-primary"
          size="md"
          onClick={back}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button size="lg" disabled={!complete || saving} onClick={finishStepTwo}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* --- STEP 3 FOOTER — SHELVED ------------------------------------
            Kept against the PM changing their mind about dropping the
            customise step. Restore alongside the step-3 branch in <main>.

            <div className="flex flex-wrap items-center justify-end gap-2">
              {(["png", "jpeg", "svg"] as const).map((ext) => (
                <Button
                  key={ext}
                  size="lg"
                  variant={ext === "png" ? "primary" : "outline"}
                  // markDownloaded() belongs here — see the note above.
                  onClick={entitled ? () => download?.(ext) : paywall.open}
                >
                  <Download className="h-4 w-4" />
                  {ext.toUpperCase()}
                </Button>
              ))}
            </div>
        ------------------------------------------------------------------ */}
      </div>

      {/* Saving runs on Next; this only shows if it fails. */}
      {saveError && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-md rounded-xl bg-ink px-4 py-3 text-center text-sm text-white shadow-pop"
        >
          {saveError}
        </div>
      )}

      {paywallLayer}
    </div>
    </div>
  );
}

/**
 * Step 2's right-hand panel. Types with a designed preview show it filling in
 * as you type; the rest fall back to the live QR until their preview is built.
 */
function ContentPreview({
  type,
  values,
  qrValue,
  style,
}: {
  type: string;
  values: Record<string, string>;
  qrValue: string;
  style: QrStyle;
}) {
  if (type === "vcard") return <VCardPreview values={values} />;
  if (type === "multilink") return <MultiLinkPreview values={values} />;
  if (type === "social") return <SocialPreview values={values} />;
  if (type === "pdf") return <PdfPreview />;
  if (type === "image") return <ImagePreview values={values} />;
  if (type === "video") return <VideoPreview />;
  if (type === "mp3") return <AudioPreview />;
  if (type === "website") return <WebsitePreview values={values} />;
  if (type === "applink") return <AppLinkPreview />;
  if (type === "email") return <EmailPreview values={values} />;
  if (type === "sms") return <SmsPreview values={values} />;
  if (type === "whatsapp") return <WhatsAppPreview values={values} />;
  if (type === "phone") return <CallPreview values={values} />;
  if (type === "text") return <TextPreview values={values} />;
  if (type === "location") return <LocationPreview />;
  if (type === "menu") return <MenuPreview values={values} />;
  if (type === "coupon") return <CouponPreview values={values} />;
  if (type === "feedback") return <FeedbackPreview />;
  if (type === "payment") return <PaymentPreview />;
  if (type === "event") return <EventPreview values={values} />;
  if (type === "business") return <BusinessPreview values={values} />;
  if (type === "wifi") return <WifiPreview values={values} />;
  if (type === "review") return <GoogleReviewPreview />;
  return <SidePreview qrValue={qrValue} style={style} />;
}

/** Live QR alongside steps 2 and 3, framed the way the customiser asks. */
function SidePreview({
  qrValue,
  style,
  onReady,
}: {
  qrValue: string;
  style: QrStyle;
  onReady?: (fn: (ext: "png" | "jpeg" | "svg") => void) => void;
}) {
  const framed = style.frame !== null;

  return (
    <aside className="rounded-2xl border border-line bg-white p-5 text-center shadow-soft">
      <div
        className={`mx-auto w-fit ${
          framed ? "rounded-2xl border-2 p-3" : ""
        }`}
        style={framed ? { borderColor: style.fg, background: style.bg } : undefined}
      >
        {framed && style.frame === "top" && (
          <p
            className="mb-2 text-sm font-bold tracking-wide"
            style={{ color: style.fg }}
          >
            {style.caption}
          </p>
        )}

        <QrPreview
          value={qrValue}
          style={style}
          size={240}
          onReady={onReady}
          className="mx-auto"
        />

        {framed && style.frame !== "top" && (
          <p
            className="mt-2 text-sm font-bold tracking-wide"
            style={{ color: style.fg }}
          >
            {style.caption}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        {qrValue
          ? "Scan to test before you download."
          : "Fill in the details to see your code."}
      </p>
    </aside>
  );
}
