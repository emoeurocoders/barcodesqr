import { QrCode, Pencil, Palette, ChevronRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; step: string; title: string }[] = [
  { icon: QrCode, step: "Step 1", title: "Choose QR type" },
  { icon: Pencil, step: "Step 2", title: "Complete Content" },
  { icon: Palette, step: "Step 3", title: "Customize & Protect" },
];

/**
 * The three-step header above the creator.
 *
 * Measured against the live creator rather than `html_files/create.html`: the
 * mockup only ever draws step 1, and its 80px rail would push every step-2 row
 * 15px below where the product puts it. Agreed with the PM, 2026-08-25.
 */
export function StepRail({ current = 1 }: { current?: number }) {
  return (
    <header className="shrink-0 border-b border-line bg-white">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex items-center">
          {steps.map(({ icon: Icon, step, title }, i) => {
            const active = i + 1 === current;
            const done = i + 1 < current;
            const last = i === steps.length - 1;

            return (
              <li
                key={step}
                className="flex flex-1 items-center last:flex-none"
                aria-current={active ? "step" : undefined}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      active || done
                        ? "bg-brand text-white"
                        : "bg-bg-alt text-faint"
                    }`}
                  >
                    {/* A finished step swaps its glyph for a tick. */}
                    {done ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>

                  {/* Labels collapse away on the narrowest screens. */}
                  <div
                    className={`hidden sm:block ${
                      active || done ? "" : "opacity-60"
                    }`}
                  >
                    <p className="text-xs font-medium text-muted">{step}</p>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                  </div>
                </div>

                {!last && (
                  <ChevronRight
                    aria-hidden="true"
                    className="mx-3 h-5 w-5 flex-1 text-line sm:mx-4"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
