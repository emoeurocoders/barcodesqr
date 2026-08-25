"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Download, SquarePen, Lock, Mail } from "lucide-react";
import { QrPreview } from "@/components/create/QrPreview";
import type { QrStyle } from "@/components/create/QrPreview";
import { completeAccount } from "@/app/actions/paywall";
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

/**
 * Step two: payment has gone through, now claim the account.
 *
 * Google and Apple are rendered as designed but disabled — neither has an
 * OAuth app configured, and Auth.js has no provider to hand them to. Email is
 * the live path. The design promises a sign-in link by email; with no mail
 * provider wired the session is created in the same browser that just paid
 * instead, which is the same trust boundary the flow already assumes.
 */
export function AccountStep({
  qrValue,
  qrStyle,
}: {
  qrValue: string;
  qrStyle: QrStyle;
}) {
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(completeAccount, undefined);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div className="px-[34px] py-6">
      <div className="flex flex-wrap items-stretch">
        {/* Left: the code, locked until the account exists */}
        <div className="flex min-w-0 flex-1 flex-col lg:pr-[34px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt="BarcodesQR"
            className="block w-[196px]"
          />

          <h2 className="mt-3.5 text-[31px] font-bold leading-[1.14em] tracking-[-0.025em] text-black">
            Your QR Code
            <br />
            Is Ready!
          </h2>
          <p className="mt-3.5 max-w-[18em] text-[13.5px] leading-[1.6em] text-muted">
            One last step: complete your account to unlock your download,
            receipt, and QR dashboard.
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
                className={`flex items-start ${i > 0 ? "mt-[15px]" : ""}`}
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

        {/* Right: claim it */}
        <div className="flex min-w-0 flex-1 flex-col border-[#dae0e8] lg:border-l lg:pl-[35px]">
          <p className="flex items-center text-[15.5px] font-semibold text-[#16a34a]">
            <span className="mr-[0.58em] flex h-[1.67em] w-[1.67em] shrink-0 items-center justify-center rounded-full bg-[#16a34a]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
            Payment successful
          </p>

          <h3 className="mt-5 text-[29px] font-bold leading-[1.2em] tracking-heading text-black">
            Complete your account
            <br />
            to download your QR
          </h3>
          <p className="mt-3 text-[13.5px] leading-[1.6em] text-muted">
            Choose Google, Apple, or email.
            <br />
            We&rsquo;ll send your receipt and a secure sign-in link.
          </p>

          <div className="mt-[19px]">
            {[
              { key: "google", node: <GoogleMark />, label: "Continue with Google" },
              { key: "apple", node: <AppleMark />, label: "Continue with Apple" },
            ].map(({ key, node, label }, i) => (
              <button
                key={key}
                type="button"
                disabled
                title="Not connected yet — use your email below"
                className={`flex h-14 w-full cursor-not-allowed items-center justify-center rounded-xl border border-line bg-white opacity-55 ${
                  i > 0 ? "mt-4" : ""
                }`}
              >
                <span className="flex shrink-0">{node}</span>
                <span className="pl-3 text-[16.5px] font-bold leading-[1.2em] text-ink">
                  {label}
                </span>
              </button>
            ))}
            <p className="mt-2 text-center text-xs text-faint">
              Google and Apple sign-in are not connected yet.
            </p>
          </div>

          <div className="mt-3 flex items-center">
            <span className="flex-1 border-t border-[#e2e6ec]" />
            <span className="px-3.5 text-sm text-muted">or</span>
            <span className="flex-1 border-t border-[#e2e6ec]" />
          </div>

          <form action={action} className="mt-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
              <input
                id="paywallEmail"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!state?.error}
                className="h-14 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-[15px] text-ink placeholder:text-faint focus:border-primary focus:outline-none"
              />
            </div>

            {state?.error && (
              <small className="block pt-1 text-xs text-danger">
                {state.error}
              </small>
            )}

            <button
              type="submit"
              disabled={!emailValid || pending}
              className={`mt-4 flex h-14 w-full items-center justify-center rounded-xl border text-[17px] font-bold text-white transition-colors ${
                emailValid && !pending
                  ? "cursor-pointer border-primary bg-primary hover:border-primary-dark hover:bg-primary-dark"
                  : "cursor-not-allowed border-primary/45 bg-primary/45"
              }`}
            >
              {pending ? "Setting up…" : "Continue with Email"}
            </button>
          </form>

          <p className="mt-[1.11em] flex items-center justify-center text-[13.5px] text-muted">
            <Lock className="mr-1.5 h-[15px] w-[15px]" />
            No password required.
          </p>
          <p className="mx-auto mt-[0.88em] max-w-[28em] text-center text-[12.5px] leading-[1.6em] text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="whitespace-nowrap font-medium text-primary">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link href="/privacy" className="whitespace-nowrap font-medium text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Footer spans both columns on this step */}
        <ul className="order-20 mt-12 flex min-w-full justify-center border-t border-line-soft pt-8 text-[13px] leading-[1.1em] text-muted">
          <li>
            &copy; {new Date().getFullYear()} BarcodesQR&nbsp;&nbsp;&bull;&nbsp;&nbsp;
          </li>
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
