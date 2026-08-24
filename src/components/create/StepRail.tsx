import { QrCode, SquarePen, ShieldLock, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; step: string; title: string }[] = [
  { icon: QrCode, step: "Step 1", title: "Choose QR type" },
  { icon: SquarePen, step: "Step 2", title: "Complete Content" },
  { icon: ShieldLock, step: "Step 3", title: "Customize & Protect" },
];

export function StepRail({ current = 1 }: { current?: number }) {
  return (
    <ol className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-6 pb-[18px] pt-[17px]">
      {steps.map(({ icon: Icon, step, title }, i) => {
        const active = i + 1 === current;
        const last = i === steps.length - 1;

        return (
          <li
            key={step}
            className={`flex items-center gap-3 ${last ? "" : "flex-1"}`}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                active ? "bg-brand text-white" : "bg-bg-alt text-faint"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>

            {/* Labels collapse away on the narrowest screens, leaving the icons. */}
            <span className="hidden min-w-0 sm:block">
              <span className="block text-xs text-faint">{step}</span>
              <span
                className={`block text-sm font-bold leading-tight ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                {title}
              </span>
            </span>

            {!last && (
              <>
                {/* Rule between steps on wide screens… */}
                <span
                  aria-hidden="true"
                  className="ml-2 hidden h-px flex-1 bg-line md:block"
                />
                {/* …and a chevron once they stack tighter. */}
                <ChevronRight
                  aria-hidden="true"
                  className="ml-auto h-4 w-4 shrink-0 text-line md:hidden"
                />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
