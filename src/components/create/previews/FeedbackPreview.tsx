import { Star } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

const GHOST = "#dfe0e9";
const BAR = "#c8ccda";
const FIELD = "#eef0f6";

/**
 * Step-2 preview for the Feedback type: the review form a scan opens.
 *
 * The written review is drawn as placeholder bars rather than invented copy —
 * the words belong to whoever scans it, and the creator leaves them blank too.
 */
export function FeedbackPreview() {
  return (
    <PhoneFrame>
      <div
        className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4"
        style={{ background: "#f5f5f7" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -top-2 select-none text-[130px] font-black leading-none"
          style={{ color: GHOST }}
        >
          rev
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 -right-12 select-none text-[130px] font-black leading-none"
          style={{ color: GHOST }}
        >
          iew
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-8 top-[88px] z-[1] select-none text-[10px] font-semibold text-white"
        >
          #review
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-[13%] z-[1] font-serif text-5xl text-white"
        >
          &ldquo;
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[28%] right-5 z-[1] font-serif text-5xl text-white"
        >
          &rdquo;
        </span>

        <div className="relative z-10 -mt-5 w-[85%] rounded-2xl bg-white p-3.5 shadow-pop">
          <p
            className="text-center text-[13px] font-bold"
            style={{ color: "#1f2937" }}
          >
            Write a review
          </p>

          <div className="mt-2.5 flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-5 w-5"
                fill={i < 4 ? "#F9B000" : "#C8CCDA"}
                style={{ color: i < 4 ? "#F9B000" : "#C8CCDA" }}
              />
            ))}
          </div>

          <div
            className="mt-3 space-y-1.5 rounded-lg p-2.5"
            style={{ background: FIELD }}
          >
            <div
              className="h-1.5 w-[35%] rounded-full"
              style={{ background: BAR }}
            />
            <div
              className="h-1.5 w-[95%] rounded-full"
              style={{ background: BAR }}
            />
            <div
              className="h-1.5 w-[95%] rounded-full"
              style={{ background: BAR }}
            />
            <div
              className="h-1.5 w-[85%] rounded-full"
              style={{ background: BAR }}
            />
          </div>

          <div
            className="mt-3 grid h-8 place-items-center rounded-full"
            style={{ background: FIELD }}
          >
            <div
              className="h-1.5 w-[35%] rounded-full"
              style={{ background: BAR }}
            />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
