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

export function Steps() {
  return (
    <section className="bg-white">
      <div className="container-page py-16 md:py-20">
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
    </section>
  );
}
