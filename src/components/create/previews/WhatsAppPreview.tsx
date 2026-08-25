"use client";

import { Phone, Video, Plus, Sticker, Camera, Mic } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  phone: "+1 123 456 7890",
  message:
    "Hi! 👋 I just scanned your QR code and I'd love to hear more — can you fill me in?",
};

const BUBBLE = "#d9fdd3";

/**
 * Step-2 preview for the WhatsApp type: the chat a scan opens, with the
 * pre-filled message already sitting in the thread.
 */
export function WhatsAppPreview({ values }: { values: Values }) {
  const dial = (values.phoneCountry ?? "+1").split("-")[0];
  const number = values.phone?.trim();
  const phone = number ? `${dial} ${number}` : sample.phone;
  const message = values.message?.trim() || sample.message;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col" style={{ background: "#e9e3d9" }}>
        <div
          className="flex items-center gap-2 px-3 pb-3 pt-5"
          style={{ background: "#075e54" }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
            <span
              className="grid h-6 w-6 place-items-center rounded-full"
              style={{ background: "#25d366" }}
            >
              <Phone className="h-3 w-3 text-white" />
            </span>
          </span>
          <span className="flex-1 truncate text-xs font-bold text-white">
            {phone}
          </span>
          <Video className="h-4 w-4 text-white" />
          <Phone className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1 px-2.5 pt-4">
          <div className="relative ml-auto w-fit max-w-[78%]">
            <div
              className="rounded-md rounded-tr-none px-2.5 py-1.5 shadow-sm"
              style={{ background: BUBBLE }}
            >
              <span
                className="line-clamp-4 text-[11px] leading-snug"
                style={{ color: "#111b21" }}
              >
                {message}
              </span>
              <span
                className="mt-0.5 flex items-center justify-end gap-0.5 text-[8px]"
                style={{ color: "#8696a0" }}
              >
                17:09
                <span style={{ color: "#53bdeb" }}>✓✓</span>
              </span>
            </div>
            <span
              aria-hidden="true"
              className="absolute -right-1.5 top-0 h-3 w-3"
              style={{ background: BUBBLE }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 pb-3">
          <Plus className="h-4 w-4 shrink-0" style={{ color: "#54656f" }} />
          <div className="flex flex-1 items-center justify-between rounded-full bg-white px-3 py-1.5">
            <span className="text-[10px] text-faint">Message</span>
            <Sticker className="h-3.5 w-3.5" style={{ color: "#54656f" }} />
          </div>
          <Camera className="h-4 w-4 shrink-0" style={{ color: "#54656f" }} />
          <Mic className="h-4 w-4 shrink-0" style={{ color: "#54656f" }} />
        </div>

        <div className="h-4 shrink-0 bg-white" />
      </div>
    </PhoneFrame>
  );
}
