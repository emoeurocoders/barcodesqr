import {
  Globe,
  Contact,
  FileText,
  Image as ImageIcon,
  Video,
  Smartphone,
  Palette,
  Sparkles,
  FileImage,
  Code,
  Download,
} from "lucide-react";

/** Step 1 tiles keep each format's own accent, matching the type picker. */
const qrTypes = [
  { icon: Globe, label: "Website", color: "#3670f4" },
  { icon: Contact, label: "vCard", color: "#5d6ded" },
  { icon: FileText, label: "PDF", color: "#d52025" },
  { icon: ImageIcon, label: "Image", color: "#3d994c" },
  { icon: Video, label: "Video", color: "#db4243" },
  { icon: Smartphone, label: "App Link", color: "#2aa7c5" },
];

const swatches = [
  "#11b1a7",
  "#2563eb",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
];

const formats = [
  { icon: FileImage, label: "PNG" },
  { icon: Code, label: "SVG" },
  { icon: FileImage, label: "JPEG" },
];

const cardClass =
  "flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-soft";
const visualClass =
  "flex flex-1 flex-col justify-center rounded-xl bg-bg-alt/70 p-5";

function StepCaption({
  step,
  title,
  body,
}: {
  step: number;
  title: string;
  body: string;
}) {
  return (
    <div className="pt-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {step}
        </span>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/**
 * Steps 2 and 3 as main_mobile.html draws them: a numbered caption over a demo
 * card, twice. There is no section heading on mobile and no step 1 — the
 * designer moved "Choose your QR code type" into the hero and dropped
 * "Create a QR code in 3 simple steps" with its sub-line, so the numbering now
 * runs across two sections. Desktop keeps all three flat cards and the heading.
 *
 * Everything inside sizes in `em` off a 2.1vw root, which is how their file
 * scales this block — see the fluid-root note on `container-home`.
 */
const swatchesMobile = [
  { color: "#2575e7", on: true },
  { color: "#24c9aa", on: false },
  { color: "#9560e9", on: false },
  { color: "#f25d72", on: false },
  { color: "#f5a91f", on: false },
  { color: "#222936", on: false },
];

/** Their PNG/JPEG glyph — one image icon reused, in two different accents. */
function ImageGlyph({ className }: { className?: string }) {
  return (
    <StepGlyph className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </StepGlyph>
  );
}

function StepGlyph({
  className,
  children,
  viewBox = "0 0 24 24",
  strokeWidth = "2",
}: {
  className?: string;
  children: React.ReactNode;
  viewBox?: string;
  strokeWidth?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <StepGlyph className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </StepGlyph>
  );
}

const downloadFormats = [
  {
    label: "PNG",
    blurb: "Best for web and social",
    fg: "#782be4",
    bg: "#f1e9ff",
    Icon: ImageGlyph,
  },
  {
    label: "SVG",
    blurb: "Scalable for any size",
    fg: "#079b63",
    bg: "#e4f8ef",
    Icon: ({ className }: { className?: string }) => (
      <StepGlyph className={className}>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="m13 6-2 12" />
      </StepGlyph>
    ),
  },
  {
    label: "JPEG",
    blurb: "Perfect for print",
    fg: "#e4770b",
    bg: "#fff1df",
    Icon: ImageGlyph,
  },
];

function MobileStepCaption({
  step,
  title,
  body,
}: {
  step: number;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start">
      <span className="flex h-[1.92em] w-[1.92em] shrink-0 items-center justify-center rounded-full bg-hero-num-tile text-[2.95em] font-extrabold text-primary">
        {step}
      </span>
      <div className="min-w-0 pl-[1.7em]">
        <h3 className="text-[2.83em] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink">
          {title}
        </h3>
        <p className="mt-[0.42em] max-w-[20em] text-[1.72em] leading-[1.5] text-muted">
          {body}
        </p>
      </div>
    </div>
  );
}

function MobileSteps() {
  return (
    <div className="md:hidden">
      <article className="text-[2.1vw] leading-[normal]">
        <MobileStepCaption
          step={2}
          title="Customize your QR code"
          body="Add your colors, shapes, a frame and your logo to match your brand."
        />

        <div className="mt-[2.46em] rounded-[2.2em] border border-steps-card-line bg-gradient-to-b from-steps-demo-from to-steps-demo-to p-[2.7em]">
          {/* Plain QR → branded QR */}
          <div className="flex items-center justify-between gap-[1.2em]">
            <div className="flex min-w-0 flex-col items-center">
              <span className="block w-[14em] rounded-[1.6em] border border-steps-thumb-line bg-white p-[1.35em]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/steps-qr-plain.svg"
                  alt="Plain QR code"
                  className="block w-full"
                />
              </span>
              <p className="mt-[0.7em] whitespace-nowrap text-[1.48em] text-hero-badge-ink">
                Plain QR
              </p>
            </div>

            <span className="mb-[2.4em] w-[3.45em] shrink-0 text-steps-arrow">
              <ArrowGlyph className="block h-auto w-full" />
            </span>

            <div className="flex min-w-0 flex-col items-center">
              <span className="relative block w-[16em] rounded-[1.6em] border border-steps-thumb-on-line bg-white p-[1.35em] shadow-[0_2px_4px_rgba(37,99,235,0.12)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/steps-qr-brand.svg"
                  alt="Branded QR code"
                  className="block w-full"
                />
                <span className="absolute left-1/2 top-1/2 flex h-[5.5em] w-[5.5em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1em] bg-white text-primary">
                  <StepGlyph className="h-[3.3em] w-[3.3em]">
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </StepGlyph>
                </span>
              </span>
              <p className="mt-[0.7em] whitespace-nowrap text-[1.48em] text-hero-badge-ink">
                Your Branded QR
              </p>
            </div>
          </div>

          {/* Colours */}
          <div className="mt-[2.46em] border-t border-steps-rule pt-[2.2em]">
            <p className="text-[1.85em] font-bold text-ink">Colors</p>
            <div className="mt-[1.2em] flex items-center justify-between">
              {swatchesMobile.map(({ color, on }) => (
                <span
                  key={color}
                  className={`h-[3.7em] w-[3.7em] rounded-full border-2 border-white ${
                    on
                      ? "shadow-[0_0_0_3px_var(--color-steps-swatch-halo),0_0_0_5px_var(--color-steps-swatch-on)]"
                      : "shadow-[0_0_0_1px_var(--color-steps-swatch-ring)]"
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Add Logo / Styles */}
          <div className="mt-[2.2em] grid grid-cols-2 gap-[1.23em]">
            <span className="flex min-h-[6.4em] items-center justify-center gap-[1em] rounded-[1.48em] border border-steps-btn-line bg-white px-[1.2em] text-hero-badge-ink">
              <ImageGlyph className="h-[2.58em] w-[2.58em] shrink-0" />
              <span className="whitespace-nowrap text-[1.72em] font-bold text-ink">
                Add Logo
              </span>
            </span>
            <span className="flex min-h-[6.4em] items-center justify-center gap-[1em] rounded-[1.48em] border border-steps-btn-line bg-white px-[1.2em] text-hero-badge-ink">
              <StepGlyph
                viewBox="0 0 21 21"
                strokeWidth="1.6"
                className="h-[2.58em] w-[2.58em] shrink-0"
              >
                <path d="M10.5 2.625L11.55 5.95L14.875 7L11.55 8.05L10.5 11.375L9.45 8.05L6.125 7L9.45 5.95L10.5 2.625ZM4.375 13.125L5.075 15.05L7 15.75L5.075 16.45L4.375 18.375L3.675 16.45L1.75 15.75L3.675 15.05L4.375 13.125ZM15.75 11.375L16.625 14L19.25 14.875L16.625 15.75L15.75 18.375L14.875 15.75L12.25 14.875L14.875 14L15.75 11.375Z" />
              </StepGlyph>
              <span className="whitespace-nowrap text-[1.72em] font-bold text-ink">
                Styles
              </span>
              <span className="flex w-[1.85em] text-ink">
                <ArrowGlyph className="h-auto w-full" />
              </span>
            </span>
          </div>
        </div>
      </article>

      <article className="mt-[4.7em] text-[2.1vw] leading-[normal]">
        <MobileStepCaption
          step={3}
          title="Download & share"
          body="Export print-ready PNG, JPG or SVG, then track scans over time."
        />

        <div className="mt-[2.46em] rounded-[2.2em] border border-steps-card-line bg-white p-[2.7em]">
          <div className="grid grid-cols-3 gap-[1em]">
            {downloadFormats.map(({ label, blurb, fg, bg, Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-[1.48em] border border-hero-card-line px-[0.6em] py-[1.72em] text-center"
              >
                <span
                  className="flex h-[5.17em] w-[5.17em] shrink-0 items-center justify-center rounded-full"
                  style={{ color: fg, background: bg }}
                >
                  <Icon className="h-[2.7em] w-[2.7em]" />
                </span>
                <p className="mt-[1em] text-[1.85em] font-bold text-ink">
                  {label}
                </p>
                <p className="mt-[0.46em] px-[0.4em] text-[1.35em] leading-[1.35] text-muted">
                  {blurb}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-[1.85em] text-center text-[1.6em] text-muted">
            Choose the best format for print or digital use.
          </p>
        </div>
      </article>
    </div>
  );
}

export function Steps() {
  return (
    <section
      id="steps"
      className="scroll-mt-[84px] border-b border-hero-card-line bg-white md:scroll-mt-20 md:border-b-0"
    >
      <div className="container-home pb-16 pt-[59px] md:py-20">
        <MobileSteps />

        <div className="hidden md:block">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Create a QR code in 3 simple steps
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          From idea to a scannable, branded QR code in under a minute.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Step 1 — pick a type */}
          <div className={cardClass}>
            <div className={visualClass}>
              <div className="grid grid-cols-3 gap-2.5">
                {qrTypes.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-line/70 bg-white p-2.5"
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                    <span className="text-[10px] font-semibold text-ink">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <StepCaption
              step={1}
              title="Select your QR code type"
              body="Pick from 20+ types — website, vCard, WiFi, PDF, menu and more."
            />
          </div>

          {/* Step 2 — customize */}
          <div className={cardClass}>
            <div className={`${visualClass} items-center text-center`}>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                <Palette className="h-3.5 w-3.5 text-primary" />
                Colors
              </p>
              <div className="mt-2.5 flex gap-2">
                {swatches.map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border-2 border-white shadow-soft"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="mt-3.5 flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-ink">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  Add logo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/70 bg-white px-3 py-1.5 text-xs font-semibold text-ink">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Styles
                </span>
              </div>
            </div>
            <StepCaption
              step={2}
              title="Customize your QR code"
              body="Add your colors, shapes, a frame and your logo to match your brand."
            />
          </div>

          {/* Step 3 — download */}
          <div className={cardClass}>
            <div className={visualClass}>
              <div className="flex gap-2.5">
                {formats.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-line/70 bg-white p-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-semibold text-ink">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Download className="h-3.5 w-3.5" />
                High-quality export
              </span>
            </div>
            <StepCaption
              step={3}
              title="Download & share"
              body="Export print-ready PNG, JPG or SVG, then track scans over time."
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
