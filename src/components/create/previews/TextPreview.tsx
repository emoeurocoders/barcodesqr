"use client";

import { StickyNote, Share2, Copy } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the text is filled in. */
const sample =
  "Welcome to the workshop! 👋\n\nWi-Fi: CozyCornerWiFi\nSchedule: kickoff at 9:30, demos after lunch.\nParking: the garage on 5th St — first hour is free.\n\nQuestions? Find anyone in a teal lanyard.";

/**
 * Step-2 preview for the Text type: the note a scan opens.
 *
 * The timestamp is the creator's fixed sample, not a live clock — rendering
 * the real time would make every screenshot and diff differ from the last.
 */
export function TextPreview({ values }: { values: Values }) {
  const text = values.text?.trim() || sample;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col" style={{ background: "#f5f6f8" }}>
        <div className="flex items-center justify-between bg-white px-4 pb-3 pt-6 shadow-sm">
          <span className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand">
              <StickyNote className="h-3.5 w-3.5" />
            </span>
            <span className="text-[12px] font-bold text-ink">Note</span>
          </span>
          <Share2 className="h-4 w-4 text-faint" />
        </div>

        <div className="min-h-0 flex-1 px-3.5 pt-3.5">
          <div className="h-full overflow-hidden rounded-2xl bg-white p-4 shadow-soft">
            <p className="text-[9px] font-medium uppercase tracking-wider text-faint">
              Today · 9:12 AM
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-[12px] leading-relaxed text-ink">
              {text}
            </p>
          </div>
        </div>

        <div className="px-3.5 pb-5 pt-3">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-[11px] font-semibold text-white shadow-soft">
            <Copy className="h-3.5 w-3.5" />
            Copy text
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
