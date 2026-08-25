import { CreditCard } from "lucide-react";
import { PhoneFrame } from "../PhonePreview";

const MUTED = "#6f6f6f";

/**
 * Step-2 preview for the Payment type: the receipt shown after a scan is
 * paid. Amount, date and cardholder are the creator's sample values — the
 * real ones come from the provider, not from us.
 */
export function PaymentPreview() {
  return (
    <PhoneFrame>
      <div
        className="flex h-full flex-col items-center px-4 pt-20"
        style={{ background: "linear-gradient(#f9f9f9, #f4f5fa)" }}
      >
        <div className="w-[94%]">
          <div className="relative rounded-t-xl bg-white px-4 pt-4 shadow-pop">
            <p className="text-center text-2xl leading-none">🎉</p>
            <p
              className="mt-2 text-center text-[15px] font-bold"
              style={{ color: "#000000" }}
            >
              Thank you!
            </p>
            <p
              className="mt-0.5 text-center text-[10px]"
              style={{ color: MUTED }}
            >
              Payment successfully completed
            </p>

            {/* Tear line with a notch punched out of each edge */}
            <div className="relative -mx-4 mt-3">
              <div
                className="h-px"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #9e9e9e 0px, #9e9e9e 6px, transparent 6px, transparent 12px)",
                }}
              />
              <span
                className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full"
                style={{ background: "#f5f6fa" }}
              />
              <span
                className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full"
                style={{ background: "#f5f6fa" }}
              />
            </div>

            <div className="pt-3">
              <p className="text-[10px]" style={{ color: MUTED }}>
                Amount
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: "#000000" }}
              >
                $35.00
              </p>

              <p className="mt-2 text-[10px]" style={{ color: MUTED }}>
                Date &amp; Time
              </p>
              <p
                className="text-[12px] font-semibold"
                style={{ color: "#000000" }}
              >
                19 Apr 2026 10:15
              </p>

              <div
                className="mb-1 mt-3 flex items-center gap-2.5 rounded-lg p-2.5"
                style={{ background: "#f8f9fd" }}
              >
                <CreditCard
                  className="h-5 w-5 shrink-0"
                  style={{ color: MUTED }}
                />
                <span className="min-w-0">
                  <span
                    className="block truncate text-[11px] font-bold"
                    style={{ color: "#000000" }}
                  >
                    John Doe
                  </span>
                  <span
                    className="block text-[10px]"
                    style={{ color: MUTED }}
                  >
                    **** 8274
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* The torn bottom edge of the receipt */}
          <div
            className="h-3 w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 13px -5px, #ffffff 13px, transparent 14px)",
              backgroundSize: "26px 12px",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>
      </div>
    </PhoneFrame>
  );
}
