import { Info } from "lucide-react";

/**
 * JB's printing tip (2026-11-26), shown where codes are downloaded after
 * checkout — the ready banner and under the codes list — and deliberately
 * not on step 3, which he wants kept uncluttered. Measured simulations
 * (LAUNCH.md, "Print size guidance") back the 3 cm figure; it is a guide,
 * which the second sentence says. Unmocked.
 */
export function PrintTip({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[13px] leading-[1.5] text-muted ${className}`}>
      <Info className="mt-[2px] h-[15px] w-[15px] shrink-0 text-faint" aria-hidden="true" />
      <span>
        <b className="font-semibold text-body">Printing tip:</b> For detailed contact cards or QR codes with logos,
        start at 3 cm or larger and test your printed QR before distribution. More complex designs may require a
        larger size. Sizes refer to the full printed design, including any frame, and are a guide rather than a
        guarantee.
      </span>
    </p>
  );
}
