"use client";

import { UtensilsCrossed } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

type Values = Record<string, string>;

/** Sample content, shown until the matching field is filled in. */
const sample = {
  business: "Olive & Thyme",
  title: "Our Menu",
  description: "Fresh, seasonal, and made to order.",
};

/** The creator's sample courses — we have no menu data to list yet. */
const dishes: { name: string; price: string; desc: string }[] = [
  {
    name: "Garden Bruschetta",
    price: "$9",
    desc: "Heirloom tomato, basil, sourdough",
  },
  {
    name: "Truffle Pasta",
    price: "$18",
    desc: "Hand-cut tagliatelle, parmesan",
  },
  {
    name: "Seared Salmon",
    price: "$24",
    desc: "Lemon butter, seasonal greens",
  },
  { name: "Citrus Salad", price: "$12", desc: "Fennel, mint, olive oil" },
  { name: "Chocolate Tart", price: "$11", desc: "Sea salt, vanilla cream" },
];

/**
 * Step-2 preview for the Menu type: the digital menu a scan opens.
 */
export function MenuPreview({ values }: { values: Values }) {
  const title = values.title?.trim() || sample.title;
  const description = values.description?.trim() || sample.description;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <div className="relative mx-2.5 mt-2.5 h-24 shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/previews/food.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full"
              style={{ objectFit: "cover", objectPosition: "50% 50%" }}
            />
          </div>
          <span className="absolute bottom-2 left-2.5 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-ink backdrop-blur">
            <UtensilsCrossed className="h-3 w-3 text-brand" />
            {sample.business}
          </span>
        </div>

        <div className="px-4 pt-3">
          <h2 className="truncate text-base font-bold leading-tight tracking-heading text-ink">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted">
            {description}
          </p>
          <div className="mt-2.5 h-px w-full bg-line" />
        </div>

        <div className="flex-1 space-y-3.5 px-4 pt-3">
          {dishes.map((d) => (
            <div key={d.name}>
              <div className="flex items-baseline gap-1.5">
                <span className="shrink-0 text-[12px] font-semibold text-ink">
                  {d.name}
                </span>
                <span className="h-px flex-1 translate-y-[-2px] border-b border-dotted border-line" />
                <span className="shrink-0 text-[12px] font-bold text-brand">
                  {d.price}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[9px] leading-snug text-muted">
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-bg-alt py-2 text-[10px] font-medium text-muted">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            View full menu
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
