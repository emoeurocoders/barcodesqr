# Transactional emails

Two mailers are built, verified against the designer's files, and **not wired
to anything**. They cannot be: both describe a payment, and nothing in this
codebase takes one yet. This file is the instruction sheet for the day that
changes.

| Email | Subject | Sender | Renders |
| ----- | ------- | ------ | ------- |
| Trial started | `Your 7-Day Trial Is Active` | `sendTrialStartedEmail` | [trial mockup](../html_files/mailers/trial/index.html) |
| Payment receipt | `Payment Received` | `sendPaymentReceiptEmail` | [receipt mockup](../html_files/mailers/receipt/index.html) |

Both go out through Resend, via the same `send()` in `src/lib/mail.ts` that
already delivers the sign-in link.

---

## Look at them first

The renderers are wired to a dev-only route, seeded with the mockup's own
sample values:

```bash
npm run dev
open http://localhost:3000/dev/emails/trial
open http://localhost:3000/dev/emails/receipt
open 'http://localhost:3000/dev/emails/trial?format=text'   # the plain-text half
```

`src/app/dev/emails/[template]/route.ts` returns 404 unless
`NODE_ENV === "development"`, so it does not exist in production. Verified
against a real `npm run build && npm run start`.

---

## Sending one

Both senders take the recipient and a typed payload. **Amounts are in minor
units and dates are `Date`s** — the sender owns every string the customer
reads, so a webhook handler cannot accidentally render `39.95 USD` where the
designer specified `$39.95 USD`.

```ts
import { sendTrialStartedEmail, sendPaymentReceiptEmail } from "@/lib/mail";

await sendTrialStartedEmail(user.email, {
  amountCharged: { amount: 100, currency: "USD" },   // $1.00 — charged today
  trialStartsAt: new Date(...),
  trialEndsAt: new Date(...),                        // also the cancel-by date
  nextChargeAmount: { amount: 3995, currency: "USD" },
});

await sendPaymentReceiptEmail(user.email, {
  amountPaid: { amount: 3995, currency: "USD" },
  paymentDate: new Date(...),
  billingPeriodStart: new Date(...),                 // "Sep 14 – Oct 11, 2026"
  billingPeriodEnd: new Date(...),
  nextRenewalDate: new Date(...),                    // day AFTER the period ends
  nextRenewalAmount: { amount: 3995, currency: "USD" },
});
```

Everything else has a default matching the mockup and only needs passing when
it differs:

| Field | Default | Pass it when |
| ----- | ------- | ------------ |
| `planName` | `7-Day Full Access Trial` / `BarcodesQR Full Access` | more than one plan exists |
| `billingIntervalWeeks` | `4` | the interval is not 4 weeks |
| `statementDescriptor` | `BARCODESQR.COM` | the processor is configured with a different one — **check this against the live setting, a mismatch here is a chargeback** |
| `manageUrl` | `{APP_URL}/dashboard` | a billing portal exists; see below |
| `dashboardUrl` | `{APP_URL}/dashboard` | — |
| `baseUrl` | `APP_URL` | — |

Dates render in **UTC**, deliberately: the same charge must not become a
different day depending on which region ran the function. If a customer time
zone ever becomes known, `formatDate` in `src/emails/render.ts` is the one
place to change.

---

## Where the call belongs

**In the payment provider's webhook, not in the checkout response.** This is
the part most worth getting right:

- A browser can close, lose signal, or be closed by the customer between "card
  accepted" and the page rendering. The charge still happened; the receipt
  still has to go.
- A receipt asserts that money moved. The only thing that knows that is the
  processor, and the webhook is the processor telling us.
- Renewals have no browser at all. Nobody is on the site four weeks later —
  `sendPaymentReceiptEmail` has no other possible trigger.

The current checkout is `checkout()` in `src/app/actions/paywall.ts`. Read the
`SECURITY` comment at the top of it before adding anything: that action has no
proof of payment today, so it is exactly the wrong place to hang a receipt off.

Illustrating with Stripe's event names — **no processor has been chosen yet**,
so treat these as the shape of the mapping rather than the mapping:

| Provider event | Send | Notes |
| -------------- | ---- | ----- |
| trial checkout completed / first `invoice.paid` for the $1 charge | `sendTrialStartedEmail` | once per subscription, ever |
| `invoice.paid` on a full subscription charge | `sendPaymentReceiptEmail` | every renewal, including the first conversion after the trial |

The trial conversion charge is a **payment receipt**, not a second trial email.

### Three things the webhook must do

1. **Be idempotent.** Providers retry webhooks — on timeout, on a non-2xx, and
   sometimes for no visible reason. Sending is not idempotent, so the handler
   has to be: record the provider's event id and return early if it has been
   seen. There is no table for this yet; it needs one.

2. **Not fail the webhook because email failed.** `send()` throws on a Resend
   error. If that escapes the handler the provider sees a non-2xx and redelivers
   the whole event, which re-runs everything else in it too. Catch around the
   send, log it, and still return 200 — the payment was recorded either way.

3. **Then actually deal with the failure.** Point 2 trades a redelivery storm
   for a silently missing receipt, which is only an improvement if someone finds
   out. A durable queue with retries is the real answer; a logged error and an
   alert is the honest minimum. **Neither exists today.**

```ts
// The shape, once there is a webhook to put it in.
if (await alreadyHandled(event.id)) return new Response(null, { status: 200 });

await recordPayment(event);           // the part that must not be lost

try {
  await sendPaymentReceiptEmail(customer.email, { ... });
} catch (error) {
  // Never rethrow: a redelivery would re-run recordPayment above.
  console.error("receipt email failed", { event: event.id, error });
}

await markHandled(event.id);
return new Response(null, { status: 200 });
```

---

## Configuration

The same three variables the sign-in link already needs — see `.env.example`:

| Variable | Why it matters here |
| -------- | ------------------- |
| `RESEND_API_KEY` | — |
| `EMAIL_FROM` | Its **domain must be verified in Resend** or the send is rejected. `onboarding@resend.dev` works for a local test with no setup. |
| `APP_URL` | Every image in these emails is an absolute URL built from it. A mail client has no origin to resolve `src="logo.png"` against, so `resolveLinks` throws rather than send an email with six broken images. |

`env.emailConfigured` reports whether all three are present.

The images are the designer's PNGs, copied byte-for-byte into `public/emails/`
and served from this app's own origin. They are public, cached, and referenced
by every email ever sent — **do not rename or delete one**, or receipts already
in people's inboxes lose their logo.

---

## Open decisions

Things a real payments integration has to settle, none of them blocking today:

- **`manageUrl` has nowhere good to point.** Both "Manage or Cancel
  Subscription" buttons default to `/dashboard`, matching what the site footer
  does. A processor's billing portal is the right target — pass its session URL
  as `manageUrl`. Note those URLs usually expire, which is a poor fit for an
  email someone opens weeks later; a stable `/account/billing` route on our side
  that mints one on click is the better shape.
- **Privacy links to `/legal/privacy`, which does not exist.** Matches the site
  footer, and 404s the same way. Tracked in `LAUNCH.md`.
- **No unsubscribe link, by design.** These are transactional, and the mockup
  has none. If marketing email is ever sent from the same domain, keep the two
  streams separate so an unsubscribe cannot suppress a receipt.
- **Currency is whatever is passed.** `formatMoney` uses `Intl`, so a non-USD
  charge formats correctly, but nobody has checked the layout with a longer
  string in those right-aligned cells.

---

## After a design sync

`html_files/mailers/` is part of the read-only mirror, so the designer can
change these emails. The port is regenerated, not hand-patched:

```bash
npm run sync:design                 # pull
git diff html_files/mailers/        # what actually changed
npm run emails:build                # re-apply the substitutions
git diff src/emails/templates/      # what that did to the port
```

`scripts/build-email-templates.mjs` anchors every substitution to a line number
**and** an exact string, and fails naming the rule when either moves. That is
deliberate: a build that stops beats a receipt that quietly ships without its
"Trial ends" date. `npm run emails:build -- --check` fails if the committed
templates are stale, which is what to run in CI.

Then re-verify, per the fidelity contract in `AGENTS.md`:

```bash
npm run -s skel -- html_files/mailers/trial/index.html > /tmp/design.txt
npm run -s skel -- http://localhost:3000/dev/emails/trial > /tmp/port.txt
diff -u /tmp/design.txt /tmp/port.txt      # only @src/@href lines may differ

npm run -s diff:design -- html_files/mailers/trial/index.html \
  http://localhost:3000/dev/emails/trial --width 750
```

750px is the mailer's own lock width (`.lockWidth`), not the 1440 the site
pages use. Both emails currently diff at **0.00%** at 750 and at 390.

**The plain-text alternative is not generated from the HTML** and no tool
diffs it. It is written by hand in `src/emails/trialStarted.ts` and
`paymentReceipt.ts` — when the designer changes a string, change it there too.
It is half of what gets delivered and the only version some clients show.

---

## Testing before launch

None of this has been through a mail client, only a headless Chrome:

- [ ] Send one of each to a real inbox (Gmail, Outlook, Apple Mail) — the
      templates carry VML and MSO conditionals specifically for Outlook, and
      that path renders in no browser.
- [ ] Check the dark-mode logo swap, which is half-wired in the designer's own
      files and ported as-is. `logo_dark.png` ships in both, but the
      `@media (prefers-color-scheme: dark)` rule that would reveal it is
      **commented out**; only the `[data-ogsc]` rule beside it is live, and
      that attribute is Outlook.com's. So the dark logo appears in Outlook.com
      dark mode and nowhere else, while every other client shows the light one
      on a dark background. Both files also declare
      `<meta name="color-scheme" content="light only">`, which asks clients not
      to invert at all — so this may be intentional. Worth asking the designer
      which of the two they meant.
- [ ] Confirm the statement descriptor in the email matches the processor's.
- [ ] Confirm the trial email's "Trial ends" date matches the processor's own
      trial end, to the day, in the customer's zone as well as UTC.
