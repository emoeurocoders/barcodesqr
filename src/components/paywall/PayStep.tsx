"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { QrPreview } from "@/components/create/QrPreview";
import type { QrStyle } from "@/components/create/QrPreview";
import {
  formatCardNumber,
  formatExpiry,
  formatCvc,
  validateCard,
} from "./cardValidation";
import type { CardErrors, CardFields } from "./cardValidation";
import { VisaMark, MastercardMark, CvcMark, CardMark } from "./PaymentMarks";
import { SecureIcon, InstantIcon, SupportIcon } from "./BrandMarks";

const benefits = [
  "Download your QR code in PNG, JPG, or SVG",
  "Edit your QR code anytime, even after printing",
  "Create unlimited QR codes",
  "Track scans, devices & locations with analytics",
  "Customize with colors, logos & frames",
];

const assurances: { icon: typeof SecureIcon; lines: [string, string] }[] = [
  { icon: SecureIcon, lines: ["Secure", "Checkout"] },
  { icon: InstantIcon, lines: ["Instant", "Download"] },
  { icon: SupportIcon, lines: ["24/7", "Support"] },
];

const inputClass =
  "block h-[41px] w-full rounded-[9px] border border-line bg-white px-[11px] text-[15px] text-ink placeholder:text-faint focus:border-primary focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[13.5px] font-medium text-body">{label}</p>
      <div className="relative mt-[5px]">{children}</div>
      {error && <small className="block pt-1 text-xs text-danger">{error}</small>}
    </div>
  );
}

/**
 * Step one of the paywall: what you get, what it costs, and the card form.
 *
 * The wallet buttons are rendered exactly as the designer drew them but are
 * inert — PayPal, Google Pay and Apple Pay each need their own SDK and
 * merchant account, and a button that looks live and does nothing is worse
 * than one that says so.
 */
export function PayStep({
  qrValue,
  qrStyle,
  onPaid,
}: {
  qrValue: string;
  qrStyle: QrStyle;
  onPaid: () => void;
}) {
  const [fields, setFields] = useState<CardFields>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [errors, setErrors] = useState<CardErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof CardFields, v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateCard(fields);
    setErrors(found);
    if (Object.keys(found).length) return;

    // No processor is wired up. The card never leaves this component: it is
    // not sent, stored or logged, and the state is dropped when the modal
    // unmounts. Advancing here stands in for a real authorisation.
    setSubmitting(true);
    onPaid();
  };

  return (
    <div className="flex flex-col items-stretch overflow-hidden lg:flex-row">
      {/* Left: what you just built */}
      <div className="flex shrink-0 flex-col border-line-soft px-[34px] py-6 lg:w-[46.7%] lg:border-r">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.svg"
          alt="BarcodesQR"
          className="block w-[196px]"
        />

        <div className="mb-[23px] mt-[18px]">
          <h2 className="mb-[6.5px] text-[32.5px] font-bold leading-[normal] tracking-heading text-ink">
            Your QR Code Is Ready!
          </h2>
          <p className="max-w-[26.2em] text-sm leading-[1.6em] text-body">
            You&apos;re one step away from downloading your QR code and
            accessing your account.
          </p>
        </div>

        <div className="mt-[19px] flex flex-1 flex-col items-center">
          <div className="w-[82.134%] max-w-[312px] overflow-hidden rounded-[14px] bg-white shadow-qr">
            <div className="rounded-t-[14px] border border-line p-5">
              <QrPreview
                value={qrValue}
                style={qrStyle}
                size={240}
                className="mx-auto w-full"
              />
            </div>
            <p className="bg-primary py-[11.9px] text-center text-[17px] font-bold leading-[normal] text-white">
              QR Preview
            </p>
          </div>

          <ul className="mt-[22px] flex justify-center">
            {assurances.map(({ icon: Icon, lines }, i) => (
              <li
                key={lines[0]}
                className={`flex items-center ${
                  i > 0 ? "ml-[17px] border-l border-[#d5e0ef] pl-[18px]" : ""
                }`}
              >
                <Icon className="h-[25px] w-[25px] shrink-0 text-primary" />
                <p className="pl-[9px] text-[13.5px] font-semibold leading-[1.35em] text-body">
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: the checkout */}
      <div className="min-w-0 flex-1 px-[34px] py-6">
        <h3 className="text-2xl font-bold leading-[normal] tracking-heading text-ink">
          Download Your QR Code
        </h3>

        <ul className="mt-2.5">
          {benefits.map((b) => (
            <li
              key={b}
              className="mt-[4.9px] flex items-start text-sm leading-[normal] text-body first:mt-0"
            >
              <Check className="mr-[10.5px] mt-[2.1px] h-[16.4px] w-[16.4px] shrink-0 text-brand" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-line py-[9px]">
          <p className="text-base font-semibold leading-[normal] text-body">
            Total due today
          </p>
          <p className="text-xl font-bold leading-[normal] tracking-heading text-ink">
            $1.00
          </p>
        </div>

        {/* Wallets — drawn per the design, inert until each SDK is wired. */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { key: "paypal", node: <PayPalMark /> },
            { key: "gpay", node: <GooglePayMark /> },
            { key: "apay", node: <ApplePayMark /> },
            { key: "card", node: <CardMark /> },
          ].map(({ key, node }) => (
            <button
              key={key}
              type="button"
              disabled
              title="Card is the only method wired up so far"
              className={`flex h-[44px] cursor-not-allowed items-center justify-center rounded-2xl ${
                key === "paypal"
                  ? "bg-[#ffc439]"
                  : key === "card"
                    ? "border border-primary bg-white"
                    : "bg-ink"
              }`}
            >
              {node}
            </button>
          ))}
        </div>

        <div className="my-2.5 flex items-center">
          <span className="h-px flex-1 bg-[#e2e6ec]" />
          <span className="px-3.5 text-[13.5px] text-muted">
            Or pay with card
          </span>
          <span className="h-px flex-1 bg-[#e2e6ec]" />
        </div>

        <form onSubmit={submit} noValidate>
          <Field label="Card number" error={errors.number}>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="cc-number"
              name="ccnumber"
              placeholder="1234-1234-1234-1234"
              value={fields.number}
              onChange={(e) => set("number", formatCardNumber(e.target.value))}
              className={`${inputClass} pr-[88px]`}
              aria-invalid={!!errors.number}
            />
            <span className="pointer-events-none absolute right-[11px] top-0 flex h-[41px] items-center gap-[5px]">
              <VisaMark />
              <MastercardMark />
            </span>
          </Field>

          <div className="mt-2.5 flex items-start gap-8">
            <Field label="Expiry date" error={errors.expiry}>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="cc-exp"
                name="ccexp"
                placeholder="MM/YY"
                value={fields.expiry}
                onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                className={inputClass}
                aria-invalid={!!errors.expiry}
              />
            </Field>

            <Field label="CVC" error={errors.cvc}>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="cc-csc"
                name="cvv"
                placeholder="(Back of card)"
                value={fields.cvc}
                onChange={(e) => set("cvc", formatCvc(e.target.value))}
                className={`${inputClass} pr-[53px]`}
                aria-invalid={!!errors.cvc}
              />
              <span className="pointer-events-none absolute right-[11px] top-0 flex h-[41px] items-center">
                <CvcMark />
              </span>
            </Field>
          </div>

          <div className="mt-2.5">
            <Field label="Name on Card" error={errors.name}>
              <input
                type="text"
                autoComplete="cc-name"
                name="name-first"
                placeholder="Full name"
                value={fields.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
                aria-invalid={!!errors.name}
              />
            </Field>
          </div>

          <div className="mt-3.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full cursor-pointer items-center justify-center gap-[0.6em] rounded-btn bg-primary py-[16.8px] text-base font-medium leading-[normal] text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
            >
              <Lock className="h-[17px] w-[17px]" />
              {submitting ? "Processing…" : "Pay $1.00"}
            </button>
          </div>
        </form>

        <p className="pt-2 text-center text-[13px] leading-[1.6em] text-body">
          7-day trial for $1.00. Renews at $39.95/month until canceled.
        </p>
        <p className="flex items-center justify-center px-0 pb-3 pt-0.5 text-[13px] leading-[normal] text-[#878c97]">
          <Lock className="mr-1.5 h-[19.5px] w-[19.5px] shrink-0" />
          Your payment is secure and encrypted
        </p>

        <ul className="flex justify-center text-[13px] leading-[1.1em] text-muted">
          <li>
            <Link href="/terms" className="hover:text-body">
              Terms of Service
            </Link>
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          </li>
          <li>
            <Link href="/privacy" className="hover:text-body">
              Privacy Policy
            </Link>
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          </li>
          <li>
            <Link href="/support" className="hover:text-body">
              Support
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

/** The designer's wallet lockups, drawn rather than imported as images. */
function PayPalMark() {
  return (
    <span className="text-[21px] font-extrabold italic tracking-[-0.01em] text-[#253b80]">
      Pay<span className="text-[#179bd7]">Pal</span>
    </span>
  );
}

function GooglePayMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/paywall/googlepay.svg"
      alt="Google Pay"
      className="w-[47px]"
    />
  );
}

function ApplePayMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/paywall/applepay.svg" alt="Apple Pay" className="w-[44px]" />
  );
}
