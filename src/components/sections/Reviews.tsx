"use client";

import { useRef } from "react";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";

const RATING = "4.87";
const REVIEW_COUNT = 1477;

const reviews = [
  {
    name: "Sofia M.",
    quote:
      "We update our menu QR every week without reprinting a thing. The editable links alone are worth it.",
    meta: "Lisbon, PT · 1d ago",
  },
  {
    name: "Daniel R.",
    quote:
      "The analytics dashboard finally lets us see which campaign posters actually get scanned.",
    meta: "Austin, US · 1d ago",
  },
  {
    name: "Mei L.",
    quote:
      "Designed a branded code with our logo and brand colors in a couple of minutes. Looks fantastic on print.",
    meta: "Singapore, SG · 2d ago",
  },
  {
    name: "Jonas K.",
    quote:
      "Great range of QR types. I use the vCard and WiFi codes constantly at events.",
    meta: "Berlin, DE · 3d ago",
  },
  {
    name: "Amara O.",
    quote:
      "Switched from a free generator because I needed to fix a typo in a printed link. Saved the whole run.",
    meta: "Toronto, CA · 4d ago",
  },
  {
    name: "Lucía F.",
    quote:
      "High-res SVG exports print beautifully on our packaging. Support replied within the hour.",
    meta: "Madrid, ES · 5d ago",
  },
];

function Stars({ label }: { label?: string }) {
  return (
    <span
      className="inline-flex"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-4 w-4 fill-star text-star" />
      ))}
    </span>
  );
}

export function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  };

  return (
    <section id="reviews" className="scroll-mt-20 bg-white">
      <div className="container-page py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Why our customers choose BarcodesQR
        </h2>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-semibold text-ink">Excellent</span>
          <Stars />
          <span className="text-sm text-muted">
            {RATING} based on {REVIEW_COUNT} reviews
          </span>
        </div>

        <div className="relative mt-10">
          <div className="mb-3 flex justify-end gap-2">
            <button
              aria-label="Previous reviews"
              onClick={() => scrollBy(-1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-muted shadow-soft hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next reviews"
              onClick={() => scrollBy(1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-muted shadow-soft hover:text-ink"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={trackRef}
            className="scroll-thin flex snap-x gap-5 overflow-x-auto pb-2"
          >
            {reviews.map((review) => (
              <figure
                key={review.name}
                className="flex min-w-[280px] max-w-[280px] snap-start flex-col rounded-2xl border border-line bg-bg p-5"
              >
                <div className="flex items-center justify-between">
                  <figcaption className="font-semibold text-ink">
                    {review.name}
                  </figcaption>
                  <Stars label="5 stars" />
                </div>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-brand">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified customer
                </span>
                <blockquote className="mt-3 flex-1 text-sm text-body">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <p className="mt-3 text-xs text-faint">{review.meta}</p>
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          Powered by independent verified reviews
        </p>
      </div>
    </section>
  );
}
