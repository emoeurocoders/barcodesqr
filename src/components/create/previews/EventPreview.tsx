"use client";

import { Clock, MapPin, User } from "lucide-react";
import { CalendarDaysIcon } from "@/components/ui/CreatorIcons";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  title: "Product Launch",
  month: "Jun",
  day: "09",
  time: "6:00 PM",
  location: "Online",
  description:
    "Join us for a first look at what we've been building — live demos, Q&A, and a few surprises.",
};

/** The stand-in faces on the attendee stack. */
const going = ["#9bb1d5", "#e1a37c", "#8fbf9f"];

/** "Jun" / "09" / "6:00 PM" from the datetime the form collects. */
function whenParts(startsAt?: string) {
  if (!startsAt) return null;
  const d = new Date(startsAt);
  if (Number.isNaN(d.getTime())) return null;
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: String(d.getDate()).padStart(2, "0"),
    time: d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

/**
 * Step-2 preview for the Event type: the invitation a scan opens.
 *
 * The attendee count is the creator's sample and stays fixed — there is no
 * RSVP service behind it yet, and a made-up live number would be a lie.
 */
export function EventPreview({ values }: { values: Values }) {
  const title = values.eventTitle?.trim() || sample.title;
  const location = values.location?.trim() || sample.location;
  const description = values.description?.trim() || sample.description;
  const when = whenParts(values.startsAt) ?? sample;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-bg">
        <div className="relative h-20 shrink-0 bg-gradient-to-r from-brand to-primary">
          <div className="absolute -bottom-6 left-4 flex flex-col items-center rounded-xl border border-line bg-white px-3 py-1.5 shadow-soft">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-brand">
              {when.month}
            </span>
            <span className="-mt-0.5 text-xl font-bold leading-tight text-ink">
              {when.day}
            </span>
          </div>
        </div>

        <div className="flex-1 px-4 pt-9">
          <h2 className="text-lg font-bold leading-snug tracking-heading text-ink">
            {title}
          </h2>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft">
                <Clock className="h-3.5 w-3.5 text-brand" />
              </span>
              <span className="text-xs text-muted">{when.time}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft">
                <MapPin className="h-3.5 w-3.5 text-brand" />
              </span>
              <span className="flex-1 truncate text-xs text-muted">
                {location}
              </span>
            </div>
          </div>

          <p className="mt-3.5 line-clamp-3 text-[11px] leading-relaxed text-body">
            {description}
          </p>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 shadow-soft">
            <span className="flex -space-x-2">
              {going.map((c) => (
                <span
                  key={c}
                  className="grid h-6 w-6 place-items-center rounded-full ring-2 ring-white"
                  style={{ background: c }}
                >
                  <User className="h-3 w-3 text-white" fill="white" />
                </span>
              ))}
            </span>
            <span className="text-[10px] font-semibold text-ink">
              +24 going
            </span>
            <span className="ml-auto text-[9px] text-faint">RSVP open</span>
          </div>
        </div>

        <div className="px-4 pb-5 pt-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark py-2.5 text-[13px] font-semibold text-white shadow-pop"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Add to calendar
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
