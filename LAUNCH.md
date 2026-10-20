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

The designer's `#mainHdr` is `position: fixed`. Their file only compensates on
the homepage (`#mainHdr + section { margin-top }`); `help.html` and
`terms.html` get nothing, so in the mockup the first section of those pages
sits under the bar. Worth reporting upstream.

Here the offset is a spacer inside the `Header` component, so every page that
renders a Header clears it. Since the 2026-10-02 port the header is the
designer's own bar: 83px tall at 1300 and up, 74px from 1025 to 1299, 71px
below, against a 71px/83px page margin. **Between 1025 and 1299 their bar is
3px taller than the margin, so the first section tucks 3px under it.**
Reproduced, not fixed — raise it with the designer.

**The header sits at `z-40`, not the designer's `z-index: 12`.** The login
modal renders inside the header, and a fixed element with a z-index opens a
stacking context, so the modal's own `z-50` is capped at the header's level.
Keep page content below `z-40` and full-screen overlays at `z-50`.

## Trial price: $1 or $1.00?

The designer's plan card prints `1.00` while the button directly under it reads
"Start $1 Trial" — inconsistent within the same file. The button copy is
reproduced as theirs. The PM asked for "Start $1.00 Trial", which matches the
card rather than the button. One of the two should change; it is a one-word
edit either way.

## Homepage — mainB.html + main_mobile.html, ported 2026-10-02

The PM replaced the desktop homepage with `mainB.html` (Monday item 12828299935)
and asked for the updated `main_mobile.html` (item 13023554182) to go live with
it. Both mockups now list their sections in the same order, so each section
component carries a mobile and a desktop subtree under one id; Features,
Customize and Share exist only in `mainB.html` and are `hidden md:block`.
`main.html` is superseded by `mainB.html` and is no longer the desktop
reference.

### Divergences and open questions

- **Footer "Media" links to `/media`, which does not exist.** The mockup's
  Company column is "Pricing / Media"; the port used to show "Reviews". Build
  the page or ask the designer to drop the entry.
- **`Reviews.tsx` is now unreferenced and nothing links to `/reviews`.** Kept
  for that page; delete it if the page is not coming.
- **The FAQ's last answer differs between breakpoints.** `mainB.html` has the
  new "If your subscription ends…" text; `main_mobile.html` still has "Static
  QR codes never expire…". Each breakpoint shows its own file's copy. Ask which
  is current.
- **"JPG" vs "JPEG".** Desktop Steps card 3 says "PNG, JPG or SVG"; Share and
  mobile say "JPEG". Ported as written.
- **The Steps cards are the designer's JPGs again.** The 2026-08-20 port drew
  them as live components; that was not a sanctioned divergence and is reversed.
- **The "Why choose" ↔ dashboard gap is the mockup's again.** The 2026-09-03
  tightening was for a seam the designer has since reordered (Benefits now
  precedes Reasons) and redrawn at a full 76px pad. If the PM still finds
  ~152px too airy, it needs asking again.
- **Small-tile tints on desktop formats.** The six "More Formats" tiles carry
  `.ico2`–`.ico6` classes, but the popular grid's `nth-child` rules win, so
  they show the first six tints. Reproduced as rendered; ask if intended.
- **Mobile "Reliable & Secure" still uses the palette icon** left from the old
  "Custom Branding" card. Reproduced; looks like a leftover.
- **Hero heading at 992px:** their 42px rule is outranked by the 1120px
  `.ln1:has(.ln)` rule, so 48px renders. Reproduced.
- **Their footer is a `<section>`, not a `<footer>`**, so the page has no
  footer landmark. Kept as theirs.
- **Interactive elements the mockup makes inaccessible are made operable
  without changing the element:** the desktop FAQ's `div.qst` has
  `role="button"`, `tabIndex`, `aria-expanded`; the footer column headings
  wrap a `<button>`; mobile "More Formats" is a `<button>`.
- **The sticky mobile CTA (`#mobCta`)** shows once the hero CTA scrolls away
  and hides at the closing CTA, with the drawer or a modal open, or while a
  form field is focused — React state replacing their observers in `main.js`.

### The 640–768 band is neither mockup

The port switches at Tailwind's `md:` (768); the mobile file has no breakpoint
of its own. Between 640 and 768 the page renders the mobile composition at its
528px cap with the designer's fixed 24px gutter. Nobody has designed it.

### Smaller notes

- **Skeleton diffs on `/` are noisy.** Both compositions are in the DOM and
  `npm run -s skel` walks hidden nodes too, so the other breakpoint's markup is
  appended to every section root — and identical copy in the hidden half can
  mask a missing node in the visible one. Compare against a root inside the
  visible subtree when in doubt.
- **The drawer is only mocked on the home page.** Its links are absolute
  (`/#steps`) so they work from /help and /terms.
- **Signed-in state is unmocked:** "Dashboard" in the header and drawer keeps
  the Log In styling.

## Creator on mobile — create_mobile*.html, ported 2026-10-13

The PM posted a mobile step 1 (`create_mobile.html`, Monday item 13272385970)
and the first three of 23 mobile step-2 forms — Website, vCard, Multi-Link
(`create_mobile_website|vcard|multilink.html`, item 13257818061) — with a
polish list on top. Below `md` the creator now renders those; desktop looks
the same (0px pixel diff at 1440 on step 1 and all three forms).

**Step 1 was replaced on 2026-10-15** ("last version was flawed"): no radio
list, no preview card, no Continue — every card goes straight into its form,
seven up front and sixteen behind "View All 23 QR Types".

- **No site header or footer anywhere in the creator.** JB, 2026-10-15: keep
  the logo and menu out of the mobile create flow. (Their step-2 files still
  draw the header; JB's note supersedes them.)
- **The step is in the URL.** Step 2 is `/create?type=<value>`, pushed with
  `history.pushState`, so a phone's back button returns to the picker and a
  form can be linked to. This applies to desktop too — it looks identical but
  now has working browser back. What was typed is kept per type: Back and
  reopening the same type finds it as left; another type starts fresh.
- **Ported so far: fifteen of 23.** Batch 1 (Website, vCard, Multi-Link),
  batch 2 (App Link, PDF, Image, WhatsApp — Monday 5638161680), batch 3
  (Social Media, Menu, WiFi, Video — 5642568390) and batch 4 (Google Maps,
  Email, Google Review, SMS — 5646620665, 2026-10-20). The other 8 show the
  old step-2 form inside the new rail and Back/Next bar, and keep the old
  Next rule (disabled until complete). Mockups exist upstream for payment,
  coupon, business, phone, audio, feedback and event but are not yet
  approved; plain text has no file (404).
- **The 2026-10-20 sync revised the eleven ported files' copy:** every
  "x — y" in tooltips and preview captions became "x. Y" (or "x: y"). All 16
  strings were updated to match; the three em dashes still in the files
  (sample vCard bio, WhatsApp's default message, WiFi's "None — open
  network") are kept as they are there. The site header is gone from their
  step-2 files too, which the port already had.

### Divergences and open questions

- **Step 1's rail says "Choose / Customize / Download"** — ported as written,
  but it contradicts the 2026-10-12 rename ("Choose QR Type / Add Content /
  Customize & Download") on desktop. Step 2's rail hides its labels; their
  screen-reader text uses the renamed wording. Asked on 2026-10-13, no answer
  yet.
- **Tap feedback on the step-1 cards is ours.** JB asked for it; the file has
  no pressed state, so a held card takes the selected look (blue border, pale
  blue fill).
- **The expander is JB's, not the file's** (2026-10-19): a light blue card
  12px below the seven — "Explore 16 More QR Types" / "WhatsApp, WiFi,
  Video, and more", "Show Fewer QR Types" with the chevron up once open. No
  mockup file has it yet; colours and copy are from his note, the grid glyph
  (lucide `LayoutGrid`) from his reference image. His image also shows an
  "All 23 QR Types · Show Fewer" header under the card; his note says no
  second control, so it is left out. The subtitle has no full stop, as in the
  image. If the designer posts a file, re-diff against it.
- **Collapsing scrolls back to the expander** only if it has gone off screen
  (JB: "return the user to the heading"). Collapsing from mid-list makes the
  page shorter than the scroll position, so the card glides down with the
  260ms slide while the browser clamps — it stays on screen, but it moves;
  nothing can hold it still on a page that much shorter.
- **The step-1 rail scales below 390px** (`min(px, vw)`), where fixed sizes
  overflowed a 320px screen by 7px. Everything else is fixed px.
- **The vCard avatars are circles, not the mockup's ovals** (35.7×51.5 /
  60×87 there). JB confirmed it a bug on 2026-10-15: 1:1, centred, cover.
- **Implemented from JB's polish list, not from the mockup:** "Collapse
  preview" while expanded; 4px more room above the expanded preview card;
  Next always enabled, validating on click, opening the accordion holding the
  first problem and scrolling it to mid-screen with focus; "Your Links" open by
  default.
- **vCard preview rows** keep their labels (Contact / Company info /
  Address) with what was entered on a second line — a phone with its dial
  code, else the email; the organisation; city/state, else the address or its
  link. Nothing entered, no second line (JB, 2026-10-15). The second line is
  unmocked. The name, photo and summary above still show the designer's
  sample until typed over — JB's "no fictional details" was read as being
  about the rows; ask if he meant the whole card.
- **Desktop parity on mobile (JB, 2026-10-15), all unmocked:**
  - *Crop/zoom* — "Adjust position & zoom" under an uploaded photo or cover
    opens the desktop `ImageAdjuster` as is (it already drags by touch).
  - *Per-link logos* — one line per link row: a small tile, "Add logo
    (optional)", then the thumbnail and "Remove". Same upload checks as
    desktop (`uploadLinkLogo`).
  - *Country codes* — each vCard phone has a "Country" select beside it,
    laid out like the designer's WhatsApp mobile file. The placeholder is
    "555 555 0123", not the mockup's "+1 555 555 0123", which would sit next
    to a picker already showing +1.
- **Multi-Link has one rule on both layouts** (`linkIssues` in validate.ts):
  a title and at least one complete link; spare empty rows are ignored; a
  half-filled row is flagged where it is missing. Mobile flags on Next;
  desktop keeps its disabled Next and highlights a half row once it is left.
  Social Media's links keep their old, looser rule.
- **The vCard now dials the code the picker shows.** Before, desktop showed
  the picker but encoded the bare number, and Work and Fax were collected
  but never written into the card. SMS and WhatsApp now also include the
  default +1 when the picker was left untouched; before, they encoded no code.
- **vCard website and email are checked when filled,** which the mockup does
  not do, so a malformed one cannot go into the card. The messages are the
  desktop form's copy — unmocked.
- **Upload progress and errors in the mobile upload box are unmocked.** It
  reads "Uploading… n%" in place of "Click to upload…", and errors use the
  field-error style.
- **The mobile picker uses the designer's icons; desktop still does not.**
  `designerTypeIcons.tsx` is extracted from their file. Desktop's lucide
  stand-ins (vCard, Multi-Link and App Link most visibly) were never a match —
  `create.html` carries the same artwork as the mobile file. Not fixed here.
- **Batch 2 notes:**
  - *App Link* follows its mobile file: at least one store link required,
    fallback optional. Desktop still requires the fallback and leaves the
    stores optional — ask whether desktop should change to match.
  - *App Link routing and the PDF link cannot be checked yet:* both are
    dynamic types and still encode the `q/preview` placeholder (see the first
    blocker above).
  - *Image* keeps up to 10 pictures under `images`, with the first mirrored
    into desktop's single `file` so the desktop form and preview still work.
    Reordering is by dragging a thumbnail onto another — pointer events, since
    their file's HTML5 drag-and-drop does not fire for touch. A notice when
    files are skipped (wrong type, over 5 MB, past 10) is ours; their script
    drops them silently. Upload progress on each tile is unmocked.
  - *PDF* preview embeds the file as their file does (`<object>`, `#page=`).
    Phones' built-in viewers mostly ignore `#page` and some render nothing
    inline, so the embed carries an "Open the PDF" link. The page count is
    read from the file when picked and stored with it.
  - *WhatsApp* prefills the message as a real value (desktop only showed it
    as a placeholder) and allows 500 characters to desktop's 160 — ask which.
    The country is preselected from the browser language, as their script
    does. The code is `wa.me/<number>?text=…`, which opens the chat with the
    text typed but not sent.
  - *Mobile country selects show no arrow,* as in the file: their step-2 CSS
    resets `background`, which takes reset.css's triangle with it. Probably
    unintended; worth raising with the designer.
- **Batch 3 notes:**
  - *Menu items* are stored in desktop's existing text format, one item per
    line as `Name | Price | Description`, so saved menus open in the mobile
    builder and desktop's textarea keeps working on the same value. `|` and
    line breaks are stripped from what is typed into a cell.
  - *Menu rules are now shared*: at least one item with a name and a price;
    spare empty rows ignored, half-filled rows flagged. On desktop that means
    an old menu with a line that has no price cannot pass Next until one is
    added — the data is kept, but the rule is new.
  - *Menu cover and category are new on both layouts* (schema fields `cover`
    and `category`), so desktop shows them too, as plain fields until its
    redesign. Desktop's menu description is on mobile as a collapsed
    "Description" section — unmocked, added for parity.
  - *Social Media needs a profile on both layouts* (JB): a headline and at
    least one valid platform. Desktop just keeps Next disabled; it has no
    message for it yet. Desktop's custom links are on mobile as a collapsed
    "Your Links" section (unmocked, parity), all optional. The platform grid
    uses this file's order (Instagram first), not vCard's.
  - *WiFi* carries no tracking pill (static code). Its preview shows the
    designer's sample QR, as the file does — the caption says the real one is
    drawn at download. The real code was decoded in Chrome (BarcodeDetector)
    and reads back as a correctly escaped `WIFI:` string; a phone scan by a
    person is still worth doing once.
  - *Video* captures a 96px thumbnail from the file when picked and stores it
    with the upload; the preview plays the uploaded file with the phone's own
    player (`playsInline`, so iOS does not jump to fullscreen).
- **Batch 4 notes:**
  - *Google Maps autocomplete is not live.* JB asked for address/business
    autocomplete; the file fakes it with eight hard-coded landmarks. No places
    provider is chosen yet (Google Places needs a billed API key; Photon/OSM
    is free but weaker for businesses), so for now the suggestion list offers
    exactly what was typed, to pick and confirm — the file's flow (type →
    pick → "Location selected" → map) is intact and a provider only has to
    fill that list (`suggestionsFor` in forms4.tsx). The map preview is the
    file's keyless Google embed; the QR opens
    `maps.google.com/?q=<place>`, as desktop's always has.
  - *Google Maps is "Google Maps" on mobile* — title, and the default name
    "My Google Maps QR Code" — where desktop says "Location". Its file has no
    tracking pill, so mobile shows none; desktop still does.
  - *Google Review's preview bar has our review glyph, not Google's "G"* that
    the file uses: the 2026-08-20 rule against Google's logo stands. Raise it
    with the designer.
  - *Email QR codes now percent-encode the subject and body* (both layouts).
    They used URLSearchParams, which writes spaces as "+", and mail apps keep
    that "+" in a `mailto:` subject.
  - *Duplicate country codes are refused* for SMS and WhatsApp: a number that
    starts with the picked code's digits and runs on for 7+ more is taken to
    include the code twice, and gets the file's own "(without the country
    code)" message. SMS reuses WhatsApp's country/number component, including
    the browser-language country guess.
  - Checked by decoding the codes the site draws: Maps, Email (`mailto:` with
    `%20`) and SMS (`SMSTO:`, a draft — nothing is sent) all read back as
    intended. A real phone scan is still worth doing once.
- **Fixed px, not `vw`.** Their stylesheet scales this page with the screen
  width; the port is fixed at the 390px rendering, as the mobile homepage is.
  Below `md`, 360px and 700px were checked for overflow and footer overlap.

## Paywall on phones — modal_join.html's ≤992px rules, ported 2026-10-20

Tami (QA) could not pay on her phone: the sign-in buttons ran into each
other, "Credit or Debit Card" wrapped to four lines, the envelope sat below
the email field, and the card number was hard to see in full, so a test
number gained three extra digits and failed the Luhn check. Only the
desktop layout had ever been ported. Below `lg` the paywall now follows
the file's small-screen rules: one column at 400px max, 22px/20px padding,
Google and Apple stacked, the four payment tiles two by two up to 480px,
16px inputs (iOS zoom), smaller logo. Desktop is unchanged except that the
envelope now centres on the email field there too.

- **Card numbers are capped by type**: 15 digits for Amex, 19 for the
  Maestro/UnionPay/Discover-65 ranges, 16 for everything else. A rare
  19-digit Visa would be cut off; moot once a processor's hosted card field
  replaces this one, which is still the plan (see validation.ts).
- **Type sizes on phones are the file's ≤992px values, not its `vw`
  scaling** below 420px; checked at 390, 360 and 320 for overflow.
- **The CVC placeholder "(Back of card)" still truncates at 360px** — it
  does in the file too.



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

## Transactional emails — built, unwired

The two mailers the designer sent are ported and verified: "Your 7-Day Trial Is
Active" and "Payment Received". Both pixel-diff at 0.00% against
`html_files/mailers/` at 750 and 390. **Nothing calls either one**, and nothing
can until a payment processor exists — both emails assert that money moved, and
the only thing that knows is the processor.

`docs/EMAILS.md` is the instruction sheet: the payloads, which provider event
maps to which email, and why the call belongs in the webhook rather than in
`checkout()`. Read it before wiring, not after.

The things that must be settled with the payments work:

- **Idempotency has no home.** Providers redeliver webhooks, and sending is not
  idempotent. A seen-event-id table is needed or customers get duplicate
  receipts. There is no such table.
- **A failed send disappears.** `send()` throws; the handler must swallow that
  to avoid triggering a redelivery of the whole event, which leaves a missing
  receipt nobody hears about. A queue with retries is the real fix; an alert is
  the minimum.
- **`manageUrl` points at `/dashboard`** because there is no billing portal.
  Both "Manage or Cancel Subscription" buttons go there. A portal session URL
  is the right target but they expire, so a stable route of ours that mints one
  on click is the better shape.
- **`statementDescriptor` defaults to `BARCODESQR.COM`,** copied from the
  mockup. It must be checked against whatever the processor is actually
  configured with — a mismatch is what a chargeback looks like.
- **Nothing has been opened in a real mail client.** Only headless Chrome. The
  templates carry VML and MSO conditionals purely for Outlook, and that path
  renders in no browser.

### Designer issues found while porting

Reproduced faithfully rather than corrected, per the fidelity contract. Both
are worth raising upstream:

  1. **The receipt's second button says two different things.** Outlook reads
     the VML `roundrect` and shows "Manage Subscription"; every other client
     reads the anchor beside it and shows "Manage or Cancel Subscription". The
     trial email says "Manage or Cancel Subscription" in both, so the receipt is
     the odd one out.
  2. **The dark-mode logo swap is half-wired.** `logo_dark.png` ships in both
     files, but the `@media (prefers-color-scheme: dark)` rule that would show
     it is commented out — only the `[data-ogsc]` rule is live, and that is
     Outlook.com's attribute. Both files also declare
     `<meta name="color-scheme" content="light only">`, so this may be
     deliberate; ask which they meant.

### Known divergences

- **Absolute URLs for images and links.** The mockup's `src="logo.png"` and
  `href="#"` cannot work in an inbox. Images are served from `public/emails/`
  and links resolve against `APP_URL`. This is the sanctioned divergence and it
  is the ONLY thing the skeleton diff reports for either file.
- **The plain-text alternative is unmocked.** The designer ships HTML only, and
  `send()` requires both. Written by hand in `src/emails/*.ts`, following the
  mockup's own copy and ordering. No tool diffs it — when a string changes in
  the HTML, it has to be changed there too.
- **Privacy links to `/legal/privacy`, which does not exist,** matching the
  site footer, which 404s the same way. Not an email problem; listed here so it
  is not discovered from an inbox.

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
