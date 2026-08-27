"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

import { requestSignInLink } from "@/app/actions/signin";
import { GoogleMark, AppleMark } from "@/components/paywall/BrandMarks";
import { PaywallShell } from "@/components/paywall/PaywallShell";

/**
 * The Log In lightbox behind the header link.
 *
 * There is no signup here on purpose: an account only exists once a QR code
 * has been paid for, so newcomers get pointed at the creator instead. That
 * is why the routes this replaces are gone rather than merely unlinked.
 */
export function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(requestSignInLink, undefined);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <PaywallShell onClose={onClose} maxWidth="max-w-[480px]">
      <div className="flex flex-col px-7 pb-7 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.svg"
          alt="BarcodesQR"
          className="block w-[162px]"
        />

        <h2 className="mt-4 text-[31px] font-bold leading-[1.14em] tracking-[-0.025em] text-black">
          Welcome back
        </h2>
        <p className="mt-2.5 text-[13px] leading-[1.6em] text-muted">
          Access your QR codes, downloads, and scan analytics.
        </p>

        {state?.sent ? (
          /* Says "if" rather than "we sent", because this is deliberately the
             same answer for an address with no account. */
          <p className="mt-[19px] rounded-xl border border-brand/25 bg-brand-soft px-4 py-3.5 text-sm leading-relaxed text-brand-dark">
            If {email.trim()} has an account, a sign-in link is on its way. It
            works once and expires in 15 minutes.
          </p>
        ) : (
          <>
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
                  <span className="whitespace-nowrap pl-3 text-[16.5px] font-bold leading-[1.2em] text-ink">
                    {label}
                  </span>
                </button>
              ))}
              {/* Not in the mockup — see the paywall for the same reasoning. */}
              <p className="mt-1.5 text-center text-xs text-faint">
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
                  id="inputEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!state?.error}
                  className="h-14 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-[15px] leading-[normal] text-ink placeholder:text-faint focus:border-primary focus:outline-none"
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
                className={`mt-1.5 flex h-14 w-full items-center justify-center rounded-xl border text-[17px] font-bold text-white transition-colors ${
                  emailValid && !pending
                    ? "cursor-pointer border-primary bg-primary hover:border-primary-dark hover:bg-primary-dark"
                    : "cursor-not-allowed border-primary/45 bg-primary/45"
                }`}
              >
                {pending ? "Sending…" : "Continue with Email"}
              </button>
            </form>

            <p className="mt-[1.4em] flex items-center justify-center text-[11.5px] text-muted">
              <Lock className="mr-1.5 h-[13px] w-[13px] shrink-0" />
              We&rsquo;ll send you a secure sign-in link. No password required.
            </p>
          </>
        )}

        <p className="mt-4 flex items-center justify-center border-t border-line-soft pt-[1.4em] text-sm text-muted">
          New to BarcodesQR?&nbsp;&nbsp;
          <Link
            href="/create"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            Create your first QR Code
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h16m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </p>
      </div>
    </PaywallShell>
  );
}
