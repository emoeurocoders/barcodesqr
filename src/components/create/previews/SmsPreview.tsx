"use client";

import { User, ChevronRight, Plus, Mic } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  phone: "+1 123 456 78",
  message: "Hi there! I scanned your code…",
};

/**
 * Step-2 preview for the SMS type: the message a scan opens, already
 * addressed and written, waiting to be sent.
 */
export function SmsPreview({ values }: { values: Values }) {
  const dial = (values.phoneCountry ?? "+1").split("-")[0];
  const number = values.phone?.trim();
  const phone = number ? `${dial} ${number}` : sample.phone;
  const message = values.message?.trim() || sample.message;

  return (
    <PhoneFrame>
      <div
        className="relative flex h-full flex-col"
        style={{ background: "#fbfbfc" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full"
            style={{ border: "26px solid rgba(240, 241, 242, 0.9)" }}
          />
          <div
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full"
            style={{ border: "30px solid rgba(240, 241, 242, 0.9)" }}
          />
        </div>

        <div className="relative flex flex-col items-center pt-8">
          <span
            className="grid h-11 w-11 place-items-center rounded-full"
            style={{ background: "linear-gradient(#9bb1d5, #8799c7)" }}
          >
            <User className="h-6 w-6 text-white" fill="white" />
          </span>
          <span className="mt-1.5 flex items-center gap-0.5 rounded-full bg-white px-2.5 py-1 shadow-sm">
            <span className="text-[11px] font-bold text-ink">{phone}</span>
            <ChevronRight
              className="h-3 w-3"
              style={{ color: "#c7cbd1" }}
            />
          </span>
        </div>

        <div className="relative flex-1 px-3.5 pt-4">
          <div className="relative ml-auto w-fit max-w-[56%]">
            <div
              className="rounded-[16px] px-3 py-2 text-[12px] leading-snug text-white"
              style={{ background: "#3478f6" }}
            >
              <span className="line-clamp-2">{message}</span>
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-px -right-0.5 h-2 w-2"
              style={{ background: "#3478f6" }}
            />
          </div>
        </div>

        <div className="relative flex items-center gap-2 px-3.5 pb-5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-sm">
            <Plus className="h-4 w-4" style={{ color: "#8e8e93" }} />
          </span>
          <div
            className="flex flex-1 items-center justify-between rounded-full border bg-white px-3 py-1.5"
            style={{ borderColor: "#ecedef" }}
          >
            <span className="text-[12px]" style={{ color: "#aeb3ba" }}>
              Text message
            </span>
            <Mic className="h-3.5 w-3.5" style={{ color: "#aeb3ba" }} />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
