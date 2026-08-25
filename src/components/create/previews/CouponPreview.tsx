"use client";

import { Tag, Ticket, Copy, Clock } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  business: "The Matcha Den",
  title: "Welcome offer",
  discount: "20% OFF",
  code: "SAVE20",
  expiry: "Expires Dec 31, 2026",
  terms: "One per customer. Cannot be combined with other offers.",
};

/**
 * Step-2 preview for the Coupon type: the voucher a scan opens, punched
 * through the middle like a torn ticket.
 */
export function CouponPreview({ values }: { values: Values }) {
  const title = values.title?.trim() || sample.title;
  const discount = values.discount?.trim() || sample.discount;
  const code = values.code?.trim() || sample.code;
  const terms = values.terms?.trim() || sample.terms;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col items-center justify-center px-4">
        <div className="mb-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          <Tag className="h-3.5 w-3.5 text-brand" />
          Exclusive coupon
        </div>

        <div className="relative w-full rounded-2xl bg-white p-4 shadow-pop">
          <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-faint">
            {sample.business}
          </div>

          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold text-ink">
                {title}
              </div>
              <div className="mt-1.5 text-3xl font-black leading-none tracking-tight text-brand">
                {discount}
              </div>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Ticket className="h-5 w-5" />
            </span>
          </div>

          {/* The tear line, with a notch punched out of each edge */}
          <div className="relative -mx-4 my-3.5">
            <div className="border-t border-dashed border-line" />
            <span
              className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full"
              style={{ background: "#f7f8fb" }}
            />
            <span
              className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full"
              style={{ background: "#f7f8fb" }}
            />
          </div>

          <div className="text-[9px] font-medium uppercase tracking-wider text-faint">
            Promo code
          </div>
          <div
            className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-dashed border-line px-3 py-2"
            style={{ background: "#f8f9fd" }}
          >
            <span className="truncate font-mono text-sm font-bold tracking-widest text-ink">
              {code}
            </span>
            <Copy className="h-3.5 w-3.5 shrink-0 text-muted" />
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{sample.expiry}</span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-[11px] font-semibold text-white">
            <Copy className="h-3.5 w-3.5" />
            Copy code
          </div>

          <p className="mt-3 border-t border-line-soft pt-2 text-center text-[8.5px] leading-snug text-faint">
            {terms}
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
