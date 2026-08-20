import { QrCode, Pencil, Palette, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; step: string; title: string }[] = [
  { icon: QrCode, step: "Step 1", title: "Choose QR type" },
  { icon: Pencil, step: "Step 2", title: "Complete Content" },
  { icon: Palette, step: "Step 3", title: "Customize & Protect" },
];

export function StepRail({ current = 1 }: { current?: number }) {
  return (
    <ol className="flex items-center gap-3 border-b border-line/80 px-6 py-4 md:gap-6 md:px-8">
      {steps.map(({ icon: Icon, step, title }, i) => {
        const active = i + 1 === current;
        return (
          <li
            key={step}
            className="flex flex-1 items-center gap-3"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                active ? "bg-brand text-white" : "bg-bg-alt text-faint"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <span className="min-w-0">
              <span className="block text-xs text-faint">{step}</span>
              <span
                className={`block truncate text-sm font-bold ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                {title}
              </span>
            </span>

            {i < steps.length - 1 && (
              <ChevronRight
                className="ml-auto hidden h-4 w-4 shrink-0 text-line md:block"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
