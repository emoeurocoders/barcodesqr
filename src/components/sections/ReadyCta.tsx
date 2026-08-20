import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReadyCta() {
  return (
    <section className="bg-white">
      <div className="container-page pb-16 md:pb-20">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-line/80 bg-bg px-8 py-10 text-center md:flex-row md:gap-12 md:px-12 md:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ready-qr.svg"
            alt=""
            aria-hidden="true"
            className="h-32 w-32 shrink-0 md:h-40 md:w-40"
          />

          <div className="md:flex-1">
            <h2 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              Ready to create your QR code?
            </h2>
            <p className="mt-3 max-w-sm leading-relaxed text-muted">
              Choose a QR code type and start creating in seconds.
            </p>
          </div>

          <div className="shrink-0 md:border-l md:border-line md:pl-12">
            <Link href="/create">
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
