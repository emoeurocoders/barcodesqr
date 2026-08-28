import { Star } from "lucide-react";

/**
 * Step-2 preview for the Google Review type: the review sheet a scan opens.
 *
 * BUILT FROM A SCREENSHOT, not from the designer's file. `create-step2.html`
 * declares this panel as a single image —
 * `assets/images/create2_rgt_tmb_review.svg` — and that asset 404s on the
 * staging host, which is the "missing side section" the PM reported. The
 * layout, palette and copy here are read off the screenshot they attached.
 * If the SVG ever lands, diff this against it and prefer the designer's.
 *
 * It is also the only type whose preview is not a phone: the mockup frames
 * this one as a flat tinted card (`.prv`, 330x446, #f7f7fc), which is what
 * the screenshot shows, so that is what this reproduces. Every other type
 * follows the live creator's phone mock-up instead.
 */

const GHOST = "#dfe0f0";
const BAR = "#e3e5f2";
const BAR_DARK = "#d6d9ea";

/** A grey placeholder line. */
function Bar({ w, className = "" }: { w: string; className?: string }) {
  return (
    <div
      className={`h-2 rounded-full ${className}`}
      style={{ width: w, background: BAR }}
    />
  );
}

export function GoogleReviewPreview() {
  return (
    <div
      className="relative mx-auto aspect-[33/44.6] w-full max-w-[330px] overflow-hidden rounded-2xl border"
      style={{ background: "#f7f7fc", borderColor: "#dedee9" }}
    >
      {/* The word behind everything, plus the marks around it */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[13%] -translate-x-1/2 select-none text-[62px] font-black leading-none tracking-tight"
        style={{ color: GHOST }}
      >
        review
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-[7%] select-none text-[11px] font-semibold"
        style={{ color: GHOST }}
      >
        #review
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-[5%] select-none font-serif text-[44px] leading-none"
        style={{ color: GHOST }}
      >
        &ldquo;
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[6%] right-5 select-none font-serif text-[44px] leading-none"
        style={{ color: GHOST }}
      >
        &rdquo;
      </span>

      {/* Stars scattered behind the card */}
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-[27%] h-12 w-12"
        fill={GHOST}
        style={{ color: GHOST }}
      />
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 bottom-[18%] h-16 w-16"
        fill={GHOST}
        style={{ color: GHOST }}
      />
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[7%] left-[38%] h-9 w-9"
        fill={GHOST}
        style={{ color: GHOST }}
      />

      {/* The sheet itself, sitting below the wordmark rather than over it */}
      <div className="absolute left-1/2 top-[28%] z-10 w-[76%] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-soft">
        <p className="text-center text-[15px] font-bold text-ink">
          Leave us a review
        </p>

        <div className="mt-2 flex justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="h-[18px] w-[18px]"
              fill="#f9b000"
              style={{ color: "#f9b000" }}
            />
          ))}
        </div>

        {/* Who is reviewing */}
        <div className="mt-4 flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{ background: BAR }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={BAR_DARK}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <Bar w="100%" />
        </div>

        {/* What they wrote */}
        <div
          className="mt-3 space-y-2 rounded-lg p-3"
          style={{ background: "#f2f3fa" }}
        >
          <Bar w="100%" />
          <Bar w="100%" />
          <Bar w="62%" />
        </div>

        {/* Post it */}
        <div
          className="mt-3 flex items-center justify-center gap-2 rounded-lg py-2.5"
          style={{ background: "#a5a7e0" }}
        >
          <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
          <span className="h-1.5 w-24 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
