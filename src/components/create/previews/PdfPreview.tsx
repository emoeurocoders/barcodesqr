import { ArrowDownLeft } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

/** The ring colour the creator scatters behind the document. */
const RING = "#e7eceb";

/**
 * Step-2 preview for the PDF type: the cover of the document a scan opens.
 *
 * The page itself is sample content — we have no uploaded file to render
 * until the hosting service exists, so the creator's placeholder cover is
 * reproduced as-is rather than left blank.
 */
export function PdfPreview() {
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
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

        <h3 className="relative pt-11 text-center text-lg font-bold tracking-heading text-ink">
          Place your PDF
        </h3>

        <div className="relative mx-auto mt-5 flex aspect-[3/4] w-[76%] flex-col rounded-xl bg-white p-3.5 shadow-pop">
          <div className="flex items-start justify-between">
            <span className="rounded-md bg-brand-darker px-2 py-0.5 text-[6px] font-bold uppercase tracking-[0.18em] text-white">
              Section 1
            </span>
            <span className="text-[58px] font-extralight leading-none text-brand-darker">
              01
            </span>
          </div>

          <p className="mt-0.5 text-right text-[4.5px] font-bold uppercase tracking-[0.2em] text-brand-darker">
            Guide your brand · All rights reserved
          </p>

          <p className="mx-auto mt-2 max-w-[68%] text-center text-[6px] leading-relaxed text-brand-darker">
            A quick look at your company&apos;s purpose, vision, and the plan
            that gets you there.
          </p>

          <div className="mt-auto flex items-end justify-between">
            <span className="text-[19px] font-light leading-tight">
              Executive
              <br />
              Summary
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full border">
              <ArrowDownLeft className="h-3 w-3" />
            </span>
          </div>
        </div>

        <p className="relative mt-3 text-center text-[11px] font-semibold text-ink">
          1 of 6
        </p>
      </div>
    </PhoneFrame>
  );
}
