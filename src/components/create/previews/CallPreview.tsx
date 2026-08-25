"use client";

import { User, Clock, MessageSquare, Phone } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the number is filled in. */
const sample = { phone: "+1 555 0123" };

/**
 * Step-2 preview for the Phone type: the incoming-call screen a scan brings
 * up, with the number already dialled.
 */
export function CallPreview({ values }: { values: Values }) {
  const phone = values.phone?.trim() || sample.phone;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center px-6 pb-5 pt-16">
        <span
          className="grid h-20 w-20 place-items-center rounded-full shadow-soft"
          style={{ background: "linear-gradient(#9bb1d5, #8799c7)" }}
        >
          <User className="h-10 w-10 text-white" fill="white" />
        </span>

        <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-faint">
          Incoming call
        </p>
        <p className="mt-1 text-center text-xl font-bold leading-tight text-ink">
          {phone}
        </p>
        <p className="mt-1 text-xs text-muted">mobile</p>

        <div className="mt-auto flex w-full items-center justify-center gap-3 pb-5">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-muted shadow-sm">
            <Clock className="h-3 w-3" />
            Remind Me
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-muted shadow-sm">
            <MessageSquare className="h-3 w-3" />
            Message
          </span>
        </div>

        <div className="flex w-full items-start justify-center gap-16 pb-3">
          <span className="flex flex-col items-center gap-1.5">
            <span
              className="grid h-14 w-14 place-items-center rounded-full text-white shadow-pop"
              style={{ background: "#ff453a" }}
            >
              <Phone className="h-6 w-6 rotate-[135deg]" />
            </span>
            <span className="text-[9px] font-medium text-muted">Decline</span>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span
              className="grid h-14 w-14 place-items-center rounded-full text-white shadow-pop"
              style={{ background: "#30d158" }}
            >
              <Phone className="h-6 w-6" />
            </span>
            <span className="text-[9px] font-medium text-muted">Accept</span>
          </span>
        </div>

        <div className="h-1 w-24 rounded-full bg-ink/15" />
      </div>
    </PhoneFrame>
  );
}
