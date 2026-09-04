# Pre-launch plan

Things that are knowingly unfinished, with enough context to pick each one up
cold. Nothing here is a bug to be surprised by — it is all deliberate, and it
all has to be resolved or consciously accepted before the product goes live.

Add to this file rather than leaving a limitation only in a commit message or
a handover, which is where they go to be forgotten.

Status: written 2026-09-01, when file uploads were wired to Cloudflare R2.

---

## Blockers — the product is broken or unsafe without these

### A scanned file QR does not open the uploaded file

`encodeQr` returns the placeholder `https://barcodesqr.com/q/preview` for every
dynamic type (`pdf`, `image`, `video`, `mp3`, `social`, `menu`, `business`,
`coupon`, `feedback`, `multilink`, `payment`, `applink`). Uploads now land in
R2, but nothing points a scan at them, so the core promise of those eleven
formats is unfulfilled.

The fix is the short-link + hosted-landing-page service, not pointing the QR at
the raw R2 URL. A raw bucket URL is neither editable after printing nor
countable, which contradicts the "dynamic" badge step 2 shows and the tracking
the pricing page sells. See `src/components/create/encodeQr.ts`.

### Nothing is saved, so every upload is orphaned

There is no `qr_codes` table. `src/app/dashboard/page.tsx` renders a hardcoded
empty `rows` array, and step 2's Next sends a paying customer to an empty
dashboard. Every uploaded object therefore has no owner, no reference, and
nothing that would ever delete it — the bucket only grows.

Needs: the table, a save on completing the wizard, the dashboard query, and a
reaper for objects no row references. Uploads keyed under `uploads/<type>/<uuid>`
carry no user id, so decide whether the key should include one before there is
production data to migrate.

### `/api/uploads` is open and unthrottled

The route deliberately allows signed-out visitors, because the creator is
usable before the paywall — requiring a session would break the main path
through step 2. It validates type, size and extension against the field schema,
but there is no rate limiting, so anyone can mint signed URLs in a loop and
fill the bucket at our expense.

Needs a rate limit before launch. Per-IP is the obvious first cut.

### `r2.dev` is not supported for production traffic

`STORAGE_PUBLIC_BASE_URL` points at the bucket's `pub-*.r2.dev` address.
Cloudflare rate-limits it and explicitly does not support it for production.

Attach a custom domain to the bucket and change that one variable — the code
reads it in one place (`publicUrl` in `src/lib/storage.ts`). Do this in every
environment, and remember Vercel needs its own value.

---

## Should fix, not release-blocking

### Bucket CORS is `allow-origin: *`

The preflight currently answers `*` for every origin. Uploads are still gated
by a signed URL that binds the exact key, content type and byte count, so this
is not an open door — but there is no reason for any origin other than ours to
be reaching the bucket. Narrow it to the real app origins in the Cloudflare
dashboard.

### The R2 API token cannot read bucket configuration

`GetBucketCors` returns `AccessDenied` — the token is scoped to object read and
write. That is correct least privilege and should stay, but it means
`npm run storage:check` verifies CORS by sending a real preflight rather than
reading the policy. Worth knowing before someone reads an `AccessDenied` as a
broken bucket.

### Step 3 (Customise & Protect) is shelved, not deleted

`CreateWizard.tsx` keeps the whole step behind `--- SHELVED ---` comment blocks
against the PM changing their mind, and `StepCustomize.tsx` is still in the
tree but unreferenced. Either restore it or delete it before launch; leaving
dead UI in the bundle is how it gets half-restored later.

---

## Known divergences from the mockup

Per the fidelity contract in `AGENTS.md`, every difference is a defect unless
listed. These are the current ones, all from wiring uploads.

- **Upload progress states are unmocked.** The designer's file never uploads,
  so there was nothing to copy for: the `Uploading… N%` caption, the progress
  bar under the file name, the spinner in the multi-link logo tile, and the
  remove button relabelled `Cancel upload` while in flight. Built from the
  nearest existing patterns. Every state the mockup *does* show renders exactly
  as before.
- **`ImagePreview` shows the uploaded photo** in place of the designer's
  `sunset-hearts.jpg`, falling back to the sample when no file has been picked.
  This is the sanctioned "sample content → real data" divergence.
- **The PDF, Video and Audio previews still show sample content**, even though
  a real file now exists. Their titles and artwork come from a hosted page that
  does not exist yet — see the first blocker. Wire them up with that work, not
  before.

---

## Help Center

Three pages ported from the designer: `/help`, `/help/getting-started`, and
`/help/getting-started/download-and-test`.

All six categories exist and are linked from the Help Center's topic grid:
`getting-started`, `creating-managing`, `analytics-scans`, `account-login`,
`plans-billing`, `troubleshooting`. They share one template,
`src/app/help/[category]/page.tsx`, driven by `categories.ts`.

**Six articles exist**, at `/help/[category]/[article]`, sharing one template
driven by `articles.ts`. All six are linked from the Help Center's Popular
Articles list, and five are reachable from their category's article rows.

**The other 21 article rows are still inert.** `href: null` in `categories.ts`
marks each one; wiring them is filling in data, not new code.

**Five of the six articles ship with their screenshot commented out.** The
designer wraps it in `<!--shot … end shot-->`, and the five JPEGs behind those
comments are byte-identical 72002-byte placeholders. Only "How to download and
test your QR code" shows a real image. The commented-out markup is not
rendered, matching what they ship — when the designer supplies real screenshots
and uncomments them, `articles.ts` needs the image restored and the file copied
into `public/help/`.

**Two things in the designer's category files look like template artefacts.**
Both are reproduced rather than corrected, and both are worth raising:

  1. Every category reuses the SAME icon sequence for its article rows
     (qr-code, circle-question, copy-minus, pencil, download), so "How to log
     in to your account" carries a QR-code glyph and "What to do if you can't
     access your account" carries two stacked squares.
  2. Three different rows — Getting Started's "How to download and test your QR
     code", Creating & Managing's "How to archive or delete a QR code", and
     Plans & Billing's "How to cancel your subscription" — all point at
     `help_article.html`, the single article that exists. Only the first
     actually matches that page's content, so only it is linked. The other two
     are left inert rather than opening an article about something else.
  3. On the Analytics & Scans and Account & Login pages, the Troubleshooting
     card under "Explore more help topics" repeats its own wrench glyph in the
     trailing arrow slot, where every other card has an arrow.

**Search does nothing.** The hero and both sidebars render the designer's
search form, but there is no search backend, so submitting it does not
navigate. Their form has no action either.

**"Contact Support", "Browse All Articles" and the article's Yes/No vote are
inert.** No support routing or feedback store exists yet.

**The mockup has no webfont.** `help*.html` links no font and vendors no Inter,
so a headless capture of it falls back to Helvetica/Arial while the app renders
real Inter via `next/font`. Text blocks therefore wrap differently between the
two, which is why pixel diffs of these pages sit near 4% and why the sidebar's
support paragraph is 3 lines in the mockup and 2 in the port. Compare box
geometry, not text height, when checking these pages.

## Header is pinned, and the designer's own pages do not clear it

As of the 2026-09-03 sync the designer's `#mainHdr` gained `position: fixed`,
reversing the earlier decision this port followed when it unpinned the header.
Ported.

**Their file only compensates on the homepage.** `#mainHero` gained
`padding-top: 83px`, but `help.html` and `terms.html` got nothing, so in the
mockup the first section of those pages sits under the fixed header — verified
by measuring: an 83px overlap on every page. Worth reporting upstream.

Here the offset lives in the `Header` component itself, as a spacer rendered
above the fixed bar, so every page that renders a Header clears it and none can
be forgotten. It is 65px because that is our header's height; the designer's
83/71px are theirs, and the difference is the pre-existing header divergence
already tracked below.

**The header sits at `z-40`, not the designer's `z-index: 12`.** Nothing in
their page climbs above 12, but this port's hero was built on Tailwind's scale
and floats its dashboard cards at `z-20`/`z-30`; at 12 those scrolled straight
over the nav. 40 also matters for the login modal, which renders inside the
header: a fixed element with a z-index opens a stacking context, so at 12 the
modal's own `z-50` was trapped beneath those same cards. Anything added to a
page above `z-30` will punch through the header again — keep page content below
it, and full-screen overlays at `z-50`.

## Trial price: $1 or $1.00?

The designer's plan card prints `1.00` while the button directly under it reads
"Start $1 Trial" — inconsistent within the same file. The button copy is
reproduced as theirs. The PM asked for "Start $1.00 Trial", which matches the
card rather than the button. One of the two should change; it is a one-word
edit either way.

## Homepage drift from the mockup

The two sections ported on 2026-09-02 — the press-logo scroller and "Why choose
BarcodesQR" — match the mockup exactly at 1440 (245px and 627px, card 384x165).
Measuring them turned up how far the REST of the homepage has drifted, none of
it touched by that work:

| Section | Mockup | Port | Delta |
| ------- | ------ | ---- | ----- |
| Showcase (`#mainTypes`) | 456 | 939 | **+483** |
| Footer | 349 | 458 | +109 |
| Steps | 512 | 598 | +86 |
| Pricing (`#mainPlans`) | 726 | 791 | +65 |
| Ready (`#mainReady`) | 299 | 322 | +23 |
| Header | 83 | 65 | −18 |
| Hero | 629 | 620 | −9 |
| Why (`#mainWhy`) | 866 | 829 | −37 |

The gap between "Why choose BarcodesQR" and #mainWhy was tightened from ~156px
to ~81px at the PM's request on 2026-09-03. That is a deliberate divergence:
the designer gives both sections a full 76px pad and has not changed it, so a
future sync will not "fix" this and it should not be read as drift.

Reviews was the largest of these at +578px and has since been removed from the
homepage, which is what the mockup asks for. The rest still stand and sum to the
~694px the page-level pixel diff now reports. **Showcase's +483 is the one to
look at next** — a real layout divergence in the QR-type grid.

**`/reviews` is a broken link.** The header and the footer both point at it and
no such route exists, so both 404. `Reviews.tsx` is kept unreferenced for
exactly that page rather than deleted; either build the route or drop the two
nav entries and the component together.

## Image adjuster

The fields the schema marks `adjustable` — vCard and Social profile photos
(`circle`) and the multi-link cover (`wide`) — can now be repositioned and
zoomed after upload, matching what the live creator at barcodesqr.com offers.
`adjustable` had sat unread in `fieldSchema.ts` since the schema was generated;
the control was never built here, and the PM spotted it missing.

**The designer has never mocked it.** The layout follows the live product — a
drag hint, a zoom slider and a reset — drawn with this app's own tokens rather
than copied pixel for pixel, because there is nothing to copy. If a mockup
arrives later, expect to redo the styling.

Framing is stored as three numbers (`crop: {x, y, zoom}`) beside the file and
replayed through `cropStyle`, so nothing is written to the image, re-framing
never re-uploads, and the adjuster and the phone previews cannot drift apart.
**It is not baked into the file**, so anything that later renders these images
outside React — a hosted landing page, a PDF, an export — has to apply the same
transform or it will show the uncropped original.

## Review modal — waiting on two triggers

The "How was your experience?" modal is built and wired, but it cannot appear
yet, because neither signal it depends on exists:

  1. **Paid activation.** The dashboard reads `user.plan !== "free"`, and
     nothing sets that column — checkout does not take a real payment. Marked
     in `app/actions/paywall.ts`.
  2. **A successful download.** Step 3 of the creator, which owns the download
     buttons, is shelved. The handler must call `markDownloaded()`; marked in
     `CreateWizard.tsx` beside the shelved block.

Both land automatically once those steps are finished — no further wiring.
Rules and reasoning are in `lib/reviewPrompt.ts`; 13 assertions cover them.

**Submitted feedback goes nowhere.** `ReviewPromptGate` logs it and marks the
prompt suppressed. Before launch it needs a destination, and `markSubmitted`
should move to the success path so a failed send does not lose the review and
silence the prompt at the same time.

**State is per-device.** It lives in localStorage, because the download is a
client event and there is no table for it. "Never ask again" therefore does not
follow a user to another browser. Move it to the user row when the download
becomes a server event — the shape is small and serialisable so only `load`
and `save` change.

## The mockups have no viewport meta

None of the designer's HTML files declare `<meta name="viewport">`. On a real
phone they lay out at Chrome's 980px fallback, so their own `max-width: 767px`
and narrower rules never fire — the pages render zoomed-out rather than
responsive. Our app sets the meta through Next, so it does respond.

This matters for verification: `scripts/design-diff.mjs` sets
`mobile: args.width < 600`, so a `--width 390` run compares a mockup laid out
at 980px against a port laid out at 390px. **Mobile pixel-diff numbers taken
that way are not meaningful**, including the 390px figures quoted in earlier
handovers. Measuring with `mobile: false` gives the designer's *intended*
responsive layout and is the comparison worth making until the meta is added
upstream — which is the real fix, and worth raising.

## Verification gaps

- **`npm run skel` and `npm run diff:design` were not run** against the upload
  changes. They need a Chromium binary, which was not installed on the machine
  at the time. The mocked states are byte-identical to the previous port, so
  the diff should be clean, but it has not been demonstrated.
- **Only the Image and Video types were exercised end to end** in a browser.
  PDF, Audio and the multi-link per-row logo share the same code path
  (`FileControl` / `uploadFile.ts`) and were covered by the API-level tests,
  but not clicked through.
