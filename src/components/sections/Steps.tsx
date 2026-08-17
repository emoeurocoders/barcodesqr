import {
  Globe,
  FileText,
  Video,
  MessageCircle,
  Image as ImageIcon,
  Wifi,
  Palette,
  Sparkles,
  FileImage,
  Code,
  Download,
} from "lucide-react";

const qrTypes = [
  { icon: Globe, label: "Website" },
  { icon: FileText, label: "PDF" },
  { icon: Video, label: "Video" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: ImageIcon, label: "Image" },
  { icon: Wifi, label: "WiFi" },
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
  "flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft";
const visualClass =
  "flex flex-1 flex-col justify-center bg-gradient-to-br from-brand-soft to-primary-soft/40 p-6";

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
    <div className="p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {step}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export function Steps() {
  return (
    <section className="bg-bg">
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
              <div className="grid grid-cols-3 gap-2">
                {qrTypes.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 rounded-lg bg-white p-2 shadow-soft"
                  >
                    <Icon className="h-4 w-4 text-brand" />
                    <span className="text-[10px] font-medium text-ink">
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
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink">
                <Palette className="h-3.5 w-3.5 text-brand" />
                Colors
              </p>
              <div className="mt-2 flex gap-2">
                {swatches.map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border-2 border-white shadow-soft"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-soft">
                  <ImageIcon className="h-3.5 w-3.5 text-brand" />
                  Add logo
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-soft">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
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
              <div className="flex gap-2">
                {formats.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-white p-3 shadow-soft"
                  >
                    <Icon className="h-4 w-4 text-brand" />
                    <span className="text-[11px] font-semibold text-ink">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand">
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
