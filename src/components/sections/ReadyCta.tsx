import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * The mobile panel puts a QR glyph in a rounded tile where desktop shows
 * `/ready-qr.svg`. Copied from their file rather than reached for in lucide —
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

export function ReadyCta() {
  return (
    <section className="md:order-2 bg-white">
      <div className="container-home pb-[54px] pt-[15px] md:pb-20 md:pt-0">
        <div className="flex flex-col items-center gap-0 rounded-[2.2em] border border-hero-divider bg-ready-panel px-[3em] py-[3.7em] text-center text-[2.1vw] leading-[normal] md:gap-8 md:leading-normal md:rounded-2xl md:border-line/80 md:bg-bg md:px-8 md:py-10 md:text-[1rem] md:flex-row md:gap-12 md:px-12 md:text-left">
          <span className="flex h-[7.15em] w-[7.15em] shrink-0 items-center justify-center rounded-[2em] border border-ready-tile-line bg-hero-num-tile text-primary md:hidden">
            <ReadyQrGlyph className="h-[3.8em] w-[3.8em]" />
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ready-qr.svg"
            alt=""
            aria-hidden="true"
            className="hidden h-32 w-32 shrink-0 md:block md:h-40 md:w-40"
          />

          <div className="mt-[2em] flex flex-col items-center md:mt-0 md:block md:flex-1">
            <h2 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              <span className="block max-w-[8.4em] text-[7.497vw] leading-[1.1] tracking-[-0.035em] md:hidden">
                Ready to create your QR code?
              </span>
              <span className="hidden md:inline">
                Ready to create your QR code?
              </span>
            </h2>
            <p className="mt-3 max-w-sm leading-relaxed text-muted">
              <span className="block max-w-[16em] text-[1.85em] leading-[1.5] md:hidden">
                Choose a QR code type and start creating in seconds.
              </span>
              <span className="hidden md:inline">
                Choose a QR code type and start creating in seconds.
              </span>
            </p>
          </div>

          <div className="mt-[2.4em] w-full shrink-0 md:mt-0 md:w-auto md:border-l md:border-line md:pl-12">
            <Link
              href="/create"
              className="mx-auto flex w-full max-w-[37em] items-center justify-center gap-2 rounded-btn bg-primary py-[1.05em] text-[13px] font-medium leading-none text-on-accent transition-colors hover:bg-primary-press md:hidden"
            >
              Create Your QR Code
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/create" className="hidden md:inline-block">
              <Button size="lg" className="px-8">
                Create QR Code
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
