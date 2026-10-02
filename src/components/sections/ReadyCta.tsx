import Link from "next/link";
import { mobileCtaClass } from "./Hero";

/**
 * The mobile panel puts a QR glyph in a rounded tile where desktop shows
 * `/ready-qr.svg` (the designer's main_ready_qr_ico.svg, byte for byte). Copied from their file rather than reached for in lucide —
 * it is the same mark the header and the hero card use.
 */
function ReadyQrGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ReadyCta() {
  return (
    <section className="bg-white pb-[10vw] md:pb-[45px]">
      <div className="container-wide-home">
        {/* main_mobile.html: a centred column on a cooler panel. */}
        <div className="flex flex-col items-center rounded-[2.2em] border border-hero-divider bg-ready-panel px-[3em] py-[3.7em] text-center text-[2.1vw] leading-[normal] md:hidden">
          <div className="flex h-[7.15em] w-[7.15em] shrink-0 items-center justify-center rounded-[2em] border border-ready-tile-line bg-hero-num-tile text-primary">
            <ReadyQrGlyph className="h-[3.8em] w-[3.8em]" />
          </div>
          <div className="mt-[2em] flex flex-col items-center">
            <h4 className="max-w-[8.4em] text-[3.57em] font-extrabold leading-[1.1em] tracking-[-0.035em] text-black">
              Ready to create your QR code?
            </h4>
            <p className="mt-[0.75em] max-w-[16em] text-[1.85em] leading-[1.5em] text-muted">
              Choose a QR code type and start creating in seconds.
            </p>
          </div>
          <div className="mt-[2.4em] w-full">
            {/* genBtn9, with their `#mainReady .rgt .btn` trimming the
                vertical padding to 1.05em and the arrow to 1.2em. */}
            <Link
              href="/create"
              data-mob-cta="end"
              className={`${mobileCtaClass} max-w-[37em] py-[1.05em]`}
            >
              Create Your QR Code
              <ArrowRightGlyph className="h-[1.2em] w-[1.2em]" />
            </Link>
          </div>
        </div>

        {/*
          mainB.html. Their paddings and margins are `em` against a 10px body,
          hence text-[10px] on the row. Below 992px it stacks and centres.
        */}
        <div className="hidden items-center rounded-[16px] border border-hero-chip-line bg-help-panel pb-[26px] pl-[30px] pr-[40px] pt-[26px] text-[10px] md:flex to-992:flex-col to-992:px-[2.4em] to-992:py-[4em] to-992:text-center">
          <div className="relative h-[200px] w-[212px] flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ready-qr.svg" alt="ico" width={212} height={204} />
          </div>
          <div className="ml-[3.6em] to-1080:ml-[1.6em] to-992:mx-0 to-992:mt-[1.8em] to-992:flex to-992:flex-col to-992:items-center">
            <h4 className="max-w-[9em] text-[35px] font-extrabold leading-[1.15em] tracking-[-0.02em] text-black">
              Ready to create your QR code?
            </h4>
            <p className="mt-[0.9em] max-w-[14em] p-0 text-[18px] leading-[1.55em] text-muted">
              Choose a QR code type and start creating in seconds.
            </p>
          </div>
          <div className="ml-auto flex flex-none flex-col items-center justify-center self-stretch border-l border-hero-chip-line pl-[4.5em] to-992:ml-0 to-992:mt-[2em] to-992:self-auto to-992:border-l-0 to-992:pl-0">
            <Link
              href="/create"
              className="inline-flex items-center gap-[0.7em] rounded-[0.7em] bg-primary px-[3em] py-[1.25em] text-[17px] font-medium leading-[1em] text-on-accent transition-colors hover:bg-primary-press"
            >
              Create Your QR Code
              <ArrowRightGlyph className="h-[1.2em] w-[1.2em]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
