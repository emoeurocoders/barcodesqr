"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { Download, SquarePen, Lock, Mail } from "lucide-react";
import { QrPreview } from "@/components/create/QrPreview";
import type { QrStyle } from "@/components/create/QrPreview";
import { checkout } from "@/app/actions/paywall";
import {
  formatCardNumber,
  formatExpiry,
  formatCvc,
  validateCard,
} from "./cardValidation";
import type { CardErrors, CardFields } from "./cardValidation";
import { VisaMark, MastercardMark, CvcMark, CardMark } from "./PaymentMarks";
import { GoogleMark, AppleMark, TrackBarsIcon } from "./BrandMarks";

const features: {
  icon: typeof Download | typeof TrackBarsIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: Download,
    title: "Instant download",
    desc: "Get your QR code right away.",
  },
  {
    icon: SquarePen,
    title: "Edit anytime",
    desc: "Update content whenever you need.",
  },
  {
    icon: TrackBarsIcon,
    title: "Track scans",
    desc: "See real-time scan analytics.",
  },
];

const inputClass =
  "block h-[41px] w-full rounded-[9px] border border-line bg-white px-[11px] text-[15px] leading-[normal] text-ink placeholder:text-faint focus:border-primary focus:outline-none";

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
      {error && (
        <small className="block pt-1 text-xs text-danger">{error}</small>
      )}
    </div>
  );
}

/**
 * The paywall, now one screen: who you are and how you are paying, together.
 *
 * The designer merged the old pay-then-claim pair after the PM decided the
 * email step read badly once money had already changed hands. Collecting both
 * at once also removes the state that made that flow fragile — there is no
 * longer a moment where someone has paid but has no account, so nothing to
 * persist and nothing to resume.
 */
export function CheckoutStep({
  qrValue,
  qrStyle,
}: {
  qrValue: string;
  qrStyle: QrStyle;
}) {
  const [email, setEmail] = useState("");
  const [fields, setFields] = useState<CardFields>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [errors, setErrors] = useState<CardErrors>({});
  const [emailError, setEmailError] = useState<string>();
  const [state, runCheckout] = useActionState(checkout, undefined);
  const [pending, startTransition] = useTransition();

  const set = (k: keyof CardFields, v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardErrors = validateCard(fields);
    const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Enter Your Email"
      : undefined;

    setErrors(cardErrors);
    setEmailError(badEmail);
    if (badEmail || Object.keys(cardErrors).length) return;

    // Built by hand, NOT by letting the form serialise itself: the card
    // fields live in this same <form>, and `action={runCheckout}` would post
    // every one of them. Only the email may leave the browser. No processor
    // is wired, so the card is validated, used for nothing, and dropped when
    // this component unmounts.
    const payload = new FormData();
    payload.set("email", email.trim());
    startTransition(() => runCheckout(payload));
  };

  const busy = pending;

  return (
    <div className="flex flex-col items-stretch overflow-hidden lg:flex-row">
      {/* Left: the code they just built, locked */}
      <div className="flex shrink-0 flex-col border-line-soft px-[34px] py-6 lg:w-[46.7%] lg:border-r">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.svg"
          alt="BarcodesQR"
          className="block w-[196px]"
        />

        <h2 className="mt-3.5 text-[31px] font-bold leading-[1.14em] tracking-[-0.025em] text-black">
          Your QR Code Is Ready
        </h2>
        <p className="mt-3.5 max-w-[24em] text-[13.5px] leading-[1.6em] text-muted">
          One last step: enter your email or continue with Google or Apple to
          unlock your download, receipt, and QR dashboard.
        </p>

        <div className="relative mx-auto mt-[15px] w-max rounded-[14px] border border-[#dae0e8] bg-white p-[11px]">
          <div className="h-[165px] w-[165px]">
            <QrPreview
              value={qrValue}
              style={qrStyle}
              size={165}
              className="h-full w-full"
            />
          </div>
          <span className="absolute left-[33%] top-[33%] flex h-[34%] w-[34%] items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(14,19,17,0.25)]">
            <Lock className="w-[37%] text-primary" />
          </span>
        </div>

        <div className="mt-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`flex items-start ${i > 0 ? "mt-[35.2px]" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f0fb]">
                <Icon className="h-[22px] w-[22px] text-primary" />
              </span>
              <span className="pl-[11px]">
                <span className="block text-[16.5px] font-bold leading-[1.2em] text-ink">
                  {title}
                </span>
                <span className="mt-1 block text-[14.5px] leading-[1.25em] text-muted">
                  {desc}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: identify, then pay */}
      <div className="min-w-0 flex-1 px-[34px] py-6">
        <form onSubmit={submit} noValidate>
          <h3 className="text-2xl font-bold leading-[normal] tracking-heading text-ink">
            Download your QR code
          </h3>
          <p className="mt-[2.8px] max-w-[29em] text-sm leading-[1.4em] text-muted">
            Save your QR code and receipt with Google, Apple, or email. No
            password required.
          </p>

          {/* Wallets and social sign-in are drawn as designed but inert —
              none of the four has an app or SDK configured yet. */}
          <div className="mt-[9px] flex gap-3">
            {[
              { key: "google", node: <GoogleMark />, label: "Continue with Google" },
              { key: "apple", node: <AppleMark />, label: "Continue with Apple" },
            ].map(({ key, node, label }) => (
              <button
                key={key}
                type="button"
                disabled
                title="Not connected yet — use your email below"
                className="flex h-[46px] min-w-0 flex-1 cursor-not-allowed items-center justify-center rounded-xl border border-line bg-white opacity-55"
              >
                <span className="flex shrink-0">{node}</span>
                <span className="whitespace-nowrap pl-[9px] text-sm font-bold leading-[1.2em] text-ink">
                  {label}
                </span>
              </button>
            ))}
          </div>
          {/* Not in the mockup. Two prominent buttons that do nothing need a
              reason attached, and `title` only reaches a hovering mouse. */}
          <p className="mt-1.5 text-center text-xs text-faint">
            Google and Apple sign-in are not connected yet.
          </p>

          <div className="mt-[7px] flex items-center">
            <span className="flex-1 border-t border-[#e2e6ec]" />
            <span className="px-3.5 text-sm text-muted">or</span>
            <span className="flex-1 border-t border-[#e2e6ec]" />
          </div>

          <div className="relative mt-[9px]">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
            <input
              id="inputEmail"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!(emailError || state?.error)}
              className={`${inputClass} pl-11`}
            />
            {(emailError || state?.error) && (
              <small className="block pt-1 text-xs text-danger">
                {emailError ?? state?.error}
              </small>
            )}
            <p className="mt-[3.9px] text-[13px] text-muted">
              We&rsquo;ll send your receipt and a secure sign-in link.
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-[#dae0e8] py-[7.5px]">
            <p className="text-base font-semibold leading-[normal] text-body">
              Total due today
            </p>
            <p className="text-[19px] font-bold leading-[normal] tracking-heading text-ink">
              $1.00
            </p>
          </div>

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
                className={`flex h-10 cursor-not-allowed items-center justify-center rounded-2xl ${
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

          <div className="mt-[11px]">
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
                disabled={busy}
                className="flex w-full cursor-pointer items-center justify-center gap-[0.6em] rounded-btn bg-primary py-[16.8px] text-base font-medium leading-[normal] text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
              >
                <Lock className="h-[17px] w-[17px]" />
                {busy ? "Processing…" : "Pay $1.00"}
              </button>
            </div>
          </div>
        </form>

        <p className="pt-2 text-center text-[13px] leading-[1.6em] text-body">
          7-day trial for $1.00. Renews at $39.95/month until canceled.
        </p>
        <p className="flex items-center justify-center pb-[11px] pt-px text-[13px] leading-[normal] text-[#878c97]">
          <Lock className="mr-1.5 h-[19.5px] w-[19.5px] shrink-0" />
          Your payment is secure and encrypted
        </p>

        <ul className="flex justify-center border-t border-line-soft pt-[11px] text-[13px] leading-[1.1em] text-muted">
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
    <span className="text-[21px] font-extrabold italic leading-[normal] tracking-[-0.01em] text-[#253b80]">
      Pay<span className="text-[#179bd7]">Pal</span>
    </span>
  );
}

function GooglePayMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/paywall/googlepay.svg" alt="Google Pay" className="w-[47px]" />
  );
}

function ApplePayMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/paywall/applepay.svg" alt="Apple Pay" className="w-[44px]" />
  );
}
