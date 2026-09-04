"use client";

import { useState } from "react";
import { Check, Smartphone } from "lucide-react";

import { PaywallShell } from "@/components/paywall/PaywallShell";
import {
  ChartIcon,
  DownloadIcon,
  HeadphonesIcon,
  PencilIcon,
  RocketIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "./ReviewIcons";

/**
 * "How was your experience with BarcodesQR?" — the designer's #mainRating.
 *
 * Ported to their numbers: a 10px base with `em` throughout, so the whole
 * modal scales from one font-size at each breakpoint. That is also the answer
 * to it feeling large — the designer has since tightened it at source (stars
 * 4em -> 3.8em, gaps and textarea shorter) and steps the base down again at
 * 767px and below, which is reproduced here rather than re-invented.
 *
 * Stars are radio inputs and the likes are checkboxes, as in their markup, so
 * the control works from the keyboard and reads correctly to a screen reader.
 * Their CSS hides the inputs and styles the label; the same is done here.
 */

const STARS = [1, 2, 3, 4, 5] as const;

const LIKES = [
  { id: "easy", label: "Easy to use", Icon: RocketIcon },
  { id: "fast", label: "Fast setup", Icon: ZapIcon },
  { id: "design", label: "Clean design", Icon: SparklesIcon },
  { id: "custom", label: "QR customization", Icon: PencilIcon },
  { id: "analytics", label: "Analytics", Icon: ChartIcon },
  { id: "quality", label: "Download quality", Icon: DownloadIcon },
  { id: "mobile", label: "Mobile friendly", Icon: Smartphone },
  { id: "support", label: "Helpful support", Icon: HeadphonesIcon },
] as const;

export type ReviewFeedback = {
  rating: number;
  likes: string[];
  comment: string;
};

export function ReviewModal({
  onSubmit,
  onDismiss,
}: {
  onSubmit: (feedback: ReviewFeedback) => void;
  /** "Maybe later", the X, Esc, or a backdrop click. */
  onDismiss: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const toggle = (id: string) =>
    setLikes((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );

  return (
    <PaywallShell
      onClose={onDismiss}
      // Their .modal: 740 wide, dropping to 480 below 767px.
      maxWidth="max-w-[740px] to-767:max-w-[480px]"
    >
      <div className="flex flex-col px-[36px] pb-[30px] pt-[34px] text-[10px] to-767:px-[2em] to-767:py-[2.6em]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt="BarcodesQR"
            className="mx-auto block w-[162px]"
          />
        </div>

        <h4 className="mx-auto mt-[16px] max-w-[12.5em] p-0 text-center text-[33px] font-bold leading-[1.2em] tracking-[-0.025em] text-black to-767:text-[31px] to-479:text-[6.4vw]">
          How was your experience with BarcodesQR?
        </h4>
        <p className="mt-[8px] p-0 text-center text-[16px] leading-[1.6em] text-muted to-767:mx-auto to-767:mt-[0.5em] to-767:max-w-[21em] to-479:text-[3.3vw]">
          Your feedback helps us improve BarcodesQR for everyone.
        </p>

        {/* Only the controls sit inside the form, as in their markup. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ rating, likes, comment: comment.trim() });
          }}
          className="flex flex-col"
        >
          {/*
          Their stars colour every star up to and including the checked one,
          via `:has(~ .star input:checked)`. Same outcome from state here.
        */}
          <div className="mt-[1.8em] flex justify-center gap-[3em] to-767:gap-[2.6em] to-767:text-[0.9em]">
            {STARS.map((n) => (
              <label
                key={n}
                className={`relative flex cursor-pointer ${
                  n <= rating ? "text-primary" : "text-faint"
                }`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  // aria-label rather than hidden text: their radios carry no
                  // label at all, and an attribute leaves the DOM identical.
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />
                <StarIcon
                  className={`block h-[3.8em] w-[3.8em] ${n <= rating ? "fill-current" : ""}`}
                />
              </label>
            ))}
          </div>

          <div className="mt-[2.3em] border-t border-[#e7eaef]" />

          <div className="mt-[1.8em]">
            <h5 className="p-0 text-[17px] font-bold leading-[1.3em] text-ink to-420:text-[4vw]">
              What did you like?
            </h5>
            <p className="mt-[4px] p-0 text-[13.5px] leading-[1.4em] text-muted to-420:text-[3.2vw]">
              Select all that apply
            </p>

            <div className="mt-[1.4em] flex flex-wrap gap-[1em] text-[10px] to-767:text-[9px] to-479:text-[2.1vw]">
              {LIKES.map(({ id, label, Icon }) => {
                const on = likes.includes(id);
                return (
                  <label
                    key={id}
                    className={`relative box-border flex h-[4.6em] grow cursor-pointer items-center rounded-[1.2em] border px-[1em] to-479:px-[1.6em] ${
                      on
                        ? "border-[#d5e0ef] bg-help-tile"
                        : "border-[#d1d5db] bg-white hover:border-faint"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(id)}
                      className="pointer-events-none absolute h-0 w-0 opacity-0"
                    />
                    <span className="flex shrink-0 text-prose">
                      <Icon className="block h-[1.8em] w-[1.8em]" />
                    </span>
                    <span className="whitespace-nowrap pl-[0.5em] text-[1.35em] font-semibold leading-[1.2em] text-body">
                      {label}
                    </span>
                    {/* Always in the DOM, as in their markup; shown only when
                        checked, as their CSS does it. */}
                    <span
                      className={`absolute -right-[0.6em] -top-[0.6em] h-[1.8em] w-[1.8em] items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_2px_#ffffff] ${
                        on ? "flex" : "hidden"
                      }`}
                    >
                      <Check className="block h-[1em] w-[1em]" />
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-[1.8em]">
            <h5 className="p-0 text-[17px] font-bold leading-[1.3em] text-ink to-420:text-[4vw]">
              Anything else to share?{" "}
              <span className="text-[13.5px] font-normal text-muted">
                (Optional)
              </span>
            </h5>
            <textarea
              id="reviewComment"
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              placeholder="Add a quick comment..."
              className="mt-[8px] block min-h-[116.5px] w-full resize-y rounded-[12px] border border-[#d1d5db] bg-white px-[14px] py-[12px] text-[15px] leading-[1.5em] text-ink outline-none placeholder:text-faint focus:border-primary to-767:min-h-[115px] to-767:text-[16px]"
            />
          </div>

          <div className="mt-[24px] flex items-center justify-between">
            {/*
              Their <a href="#">, kept as an anchor. The href is what makes it
              keyboard reachable, so matching them costs nothing here — though
              it does announce as a link rather than a button, which is listed
              in the handover.
            */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onDismiss();
              }}
              className="cursor-pointer text-[16px] font-medium text-primary hover:text-primary-press to-479:text-[14px]"
            >
              Maybe later
            </a>
            {/*
              Their <button class="btn genBtn4 btnC3">, not the .btnSubmit rule
              also present in their CSS — that one is unused here and would
              have made the button 56px instead of the 50px they render.
              Padding-based, so the height follows the font at each breakpoint.
            */}
            <button
              type="submit"
              className="cursor-pointer rounded-[0.7em] bg-primary px-[3em] py-[1.05em] text-center text-[16px] font-medium capitalize leading-[1em] text-white transition-colors hover:bg-primary-press to-767:px-[1.4em] to-479:text-[14px]"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </PaywallShell>
  );
}
