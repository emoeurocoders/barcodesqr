import { QrCode, Download, Play } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

const RING = "#e5e5e6";

/**
 * Step-2 preview for the App Link type: the chooser a scan lands on, which
 * sends iOS and Android to their respective stores.
 *
 * The app's own name and blurb are drawn as placeholder bars — the creator
 * has no app metadata to show either, and inventing some would be worse.
 */
export function AppLinkPreview() {
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col items-center bg-white px-5 pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -left-16 -top-16 h-44 w-44 rounded-full"
            style={{ border: `20px solid ${RING}` }}
          />
          <div
            className="absolute -right-16 -top-8 h-40 w-40 rounded-full"
            style={{ border: `22px solid ${RING}` }}
          />
          <div
            className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full"
            style={{ border: `22px solid ${RING}` }}
          />
          <div
            className="absolute -bottom-12 -right-14 h-40 w-40 rounded-full"
            style={{ border: `18px solid ${RING}` }}
          />
        </div>

        <div className="relative grid h-20 w-20 place-items-center rounded-[1.4rem] bg-white shadow-pop">
          <QrCode className="h-10 w-10 text-brand-darker" />
        </div>

        <div className="relative mt-6 w-full rounded-2xl bg-white p-5 shadow-pop">
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-1.5 w-[38%] rounded-full"
              style={{ background: "#c7ccda" }}
            />
            <div
              className="h-1.5 w-[60%] rounded-full"
              style={{ background: "#d3d7e2" }}
            />
          </div>

          <div className="mt-4 space-y-2.5">
            <div
              className="flex items-center justify-center gap-2.5 rounded-full px-4 py-2.5"
              style={{ background: "#f1f3f7" }}
            >
              <Download className="h-5 w-5 shrink-0 text-ink" />
              <span className="leading-tight">
                <span className="block text-[8px] text-ink/70">
                  Download on the
                </span>
                <span className="block text-[13px] font-semibold text-ink">
                  App Store
                </span>
              </span>
            </div>

            <div
              className="flex items-center justify-center gap-2.5 rounded-full px-4 py-2.5"
              style={{ background: "#f1f3f7" }}
            >
              <Play className="h-5 w-5 shrink-0 text-ink" />
              <span className="leading-tight">
                <span className="block text-[8px] text-ink/70">Get it on</span>
                <span className="block text-[13px] font-semibold text-ink">
                  Google Play
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
