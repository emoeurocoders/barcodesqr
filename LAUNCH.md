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

**Most links have no destination.** The mockup writes them as `href="#"` and
only two pages exist behind the six topics and eleven article titles. Every
such anchor is kept exactly where the designer put it and left inert. Wire them
as the articles get written; the data lives in `src/app/help/content.ts` where
`href: null` marks each one.

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

## Homepage drift from the mockup

The two sections ported on 2026-09-02 — the press-logo scroller and "Why choose
BarcodesQR" — match the mockup exactly at 1440 (245px and 627px, card 384x165).
Measuring them turned up how far the REST of the homepage has drifted, none of
it touched by that work:

| Section | Mockup | Port | Delta |
| ------- | ------ | ---- | ----- |
| Showcase (`#mainTypes`) | 456 | 939 | **+483** |
| Reviews | not in the mockup at all | 578 | **+578** |
| Footer | 349 | 458 | +109 |
| Steps | 512 | 598 | +86 |
| Pricing (`#mainPlans`) | 726 | 791 | +65 |
| Ready (`#mainReady`) | 299 | 322 | +23 |
| Header | 83 | 65 | −18 |
| Hero | 629 | 620 | −9 |
| Why (`#mainWhy`) | 866 | 829 | −37 |

Those deltas sum to the +1272px the page-level pixel diff reports, so the 5.61%
figure is entirely them. **Reviews is the one to decide first**: the current
main.html has no reviews section, so either the designer dropped it and the
component should go, or it belongs on /reviews only. Showcase's +483 is the
next largest and is a real layout divergence in the QR-type grid.

## Verification gaps

- **`npm run skel` and `npm run diff:design` were not run** against the upload
  changes. They need a Chromium binary, which was not installed on the machine
  at the time. The mocked states are byte-identical to the previous port, so
  the diff should be clean, but it has not been demonstrated.
- **Only the Image and Video types were exercised end to end** in a browser.
  PDF, Audio and the multi-link per-row logo share the same code path
  (`FileControl` / `uploadFile.ts`) and were covered by the API-level tests,
  but not clicked through.
