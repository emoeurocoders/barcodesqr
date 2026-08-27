import "server-only";

import { env } from "./env";

/**
 * Transactional email, over Resend's HTTP API.
 *
 * Deliberately a `fetch` rather than the `resend` SDK: one endpoint, one
 * shape, and nothing to keep in step with the rest of the dependency tree.
 */
async function send(to: string, subject: string, html: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, html, text }),
  });

  if (!res.ok) {
    // Resend's body explains refusals worth acting on — an unverified sender
    // domain being the usual one — so keep it for the server log. The caller
    // must not pass it on to the browser.
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

/**
 * The passwordless sign-in link.
 *
 * The link is the credential, so this is the one place it may appear. Never
 * return it to the caller, log it, or put it in an error message: anything
 * that can read it can become the account it belongs to.
 */
export async function sendSignInLink(to: string, token: string) {
  const url = `${env.APP_URL}/auth/link?token=${encodeURIComponent(token)}`;

  const text = [
    "Sign in to BarcodesQR",
    "",
    "Use the link below to sign in. It works once and expires in 15 minutes.",
    "",
    url,
    "",
    "If you didn't ask for this, you can ignore this email — nobody can sign",
    "in without opening the link.",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f9fafb;font-family:Inter,Helvetica,Arial,sans-serif;color:#0e1311">
    <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 8px;font-size:22px;letter-spacing:-0.02em">Sign in to BarcodesQR</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6b7280">
        Use the button below to sign in. It works once and expires in 15 minutes.
      </p>
      <a href="${url}"
         style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 24px;border-radius:12px">
        Sign in
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9ca3af">
        If you didn't ask for this, you can ignore this email — nobody can sign
        in without opening the link.
      </p>
    </div>
  </body>
</html>`;

  await send(to, "Your BarcodesQR sign-in link", html, text);
}
