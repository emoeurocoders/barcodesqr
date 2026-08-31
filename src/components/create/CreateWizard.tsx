"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// `Download` is shelved with step 3.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepRail } from "./StepRail";
import { TypePicker } from "./TypePicker";
import { StepContent } from "./StepContent";
// Shelved with step 3: import { StepCustomize } from "./StepCustomize";
import { PreviewPanel } from "./PreviewPanel";
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
import { encodeQr } from "./encodeQr";
import { isComplete } from "./validate";
import { Button } from "@/components/ui/Button";
import { Paywall } from "@/components/paywall/Paywall";
import { usePaywall } from "@/components/paywall/usePaywall";

type Values = Record<string, string>;

const defaultName = (type: string) => {
  const meta = allTypes.find((t) => t.value === type);
  // The creator names the code after what step 2 calls the format, not what
  // step 1's list calls it — "My Location QR Code", never "My Google Maps…".
  return `My ${meta?.stepLabel ?? meta?.label ?? "QR"} QR Code`;
};

// Completion lives in validate.ts now: every *visible* required field filled,
// and nothing filled-but-malformed — so a URL without a TLD blocks Next.

export function CreateWizard({ entitled }: { entitled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [type, setType] = useState("website");
  const [values, setValues] = useState<Values>({});
  const [name, setName] = useState(defaultName("website"));
  // The style is still read by step 2's preview; only the customiser wrote to
  // it, so the setter is shelved with step 3.
  const [style] = useState<QrStyle>(defaultQrStyle);

  /* --- STEP 3 STATE — SHELVED ---------------------------------------------
     Restore alongside the two blocks below.

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
   */
  const finishStepTwo = () => {
    if (entitled) router.push("/dashboard");
    else paywall.show();
  };

  // Choosing a type advances immediately — on the live creator one click on a
  // format takes you into its form. Selecting and then hunting for a Next
  // button below a 23-card grid is how you end up unable to build anything.
  const chooseType = (next: string) => {
    setType(next);
    setValues({});
    setName(defaultName(next));
    setStep(2);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <StepRail current={step} />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {/* Step 1 runs full width; steps 2 and 3 sit in a narrower centred
          column, which is what makes the form read as a card rather than a
          sheet. Both match the live creator. */}
      {step === 1 ? (
        <div className="px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <TypePicker selected={type} onSelect={chooseType} />
            <PreviewPanel />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
                  the `step === 2 ?` ternaries back around both, and point
                  `finishStepTwo` at setStep(3) again.

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
        </div>
      )}
      </main>

      {/* Footer actions — pinned to the bottom of the shell */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-6 lg:px-8">
        {step === 1 ? (
          <Link href="/">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline-primary"
            size="md"
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}

        {step === 1 ? (
          <span />
        ) : (
          <Button size="lg" disabled={!complete} onClick={finishStepTwo}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* --- STEP 3 FOOTER — SHELVED ------------------------------------
            Kept against the PM changing their mind about dropping the
            customise step. Restore alongside the step-3 branch in <main>.

            <div className="flex flex-wrap items-center justify-end gap-2">
              {(["png", "jpeg", "svg"] as const).map((ext) => (
                <Button
                  key={ext}
                  size="lg"
                  variant={ext === "png" ? "primary" : "outline"}
                  onClick={entitled ? () => download?.(ext) : paywall.open}
                >
                  <Download className="h-4 w-4" />
                  {ext.toUpperCase()}
                </Button>
              ))}
            </div>
        ------------------------------------------------------------------ */}
      </div>

      <Paywall
        open={paywall.open}
        qrValue={qrValue}
        qrStyle={style}
        onClose={paywall.close}
      />
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
  if (type === "image") return <ImagePreview />;
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
