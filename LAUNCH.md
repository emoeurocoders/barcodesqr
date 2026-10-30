# Pre-launch plan

Things that are knowingly unfinished, with enough context to pick each one up
cold. Nothing here is a bug to be surprised by — it is all deliberate, and it
all has to be resolved or consciously accepted before the product goes live.

Add to this file rather than leaving a limitation only in a commit message or
a handover, which is where they go to be forgotten.

Status: written 2026-09-01, when file uploads were wired to Cloudflare R2.

---

## Blockers — the product is broken or unsafe without these

### Hosted pages — built 2026-10-23; what is left

**`www.barcodesqr.com` still serves an older deployment with no `/q`
route, so every hosted code 404s when scanned** (Tami's iPhone QA,
2026-10-30: all ten hosted types). `barcodesqr.vercel.app` serves the
current build and its `/q` pages work. The fix is in Vercel, not the code:
attach `barcodesqr.com` and `www.barcodesqr.com` to this project. Codes
already printed then start working as they are — they point at the domain,
and their slugs are in the production database.

Hosted types (Multi-Link, PDF, Image, Video, Audio, Social Media,
Menu, Coupon, Business, App Link) now encode
`https://www.barcodesqr.com/q/<slug>` — an 8-character random code given
to every saved code (`qr_code.slug`, never changed: it is printed).
`app/q/[slug]` serves the page and counts the scan (dashboard "Scans").
A code not saved yet previews against `/q/preview`, which shows "This QR
code isn't active"; downloads only happen from the dashboard, after saving.

- **The pages are the creator's previews, in page mode** (Emo's call: no
  page mockups exist). Same markup, drawn at the preview's width and zoomed
  to the screen (capped at 480px wide), without the bar, frame, sample
  content or "Example preview" captions; rows and buttons are real links.
  Unmocked additions, all flagged: initials where there is no photo, a
  plain band where there is no cover, an "Open PDF" button (phones show
  PDFs inline badly), Business socials as a row of badges, no "View full
  menu" button (the page is the menu), no "Bella Italia" / "The Matcha
  Den" / café photo (samples the files hard-code). The QR and share chips
  on covers are still decorative.
- **vCard is direct again** (JB, 2026-10-30: restore the phone's own
  contact import). The code carries the contact, so the profile photo does
  not reach the phone — a QR code cannot hold an image; it shows in the
  creator's preview only. Asked JB whether to keep the photo field.
  vCards saved 2026-10-23 → 10-30 were hosted: those printed codes still
  open their page (`/q/<slug>`, whose "Add contact" serves a .vcf with the
  photo), but downloading one again gives the direct version.
- **App Link** redirects iPhones to the App Store link and Android to
  Google Play, falling back to the fallback URL; a desktop browser goes to
  the fallback, or sees the store buttons when there is none.
- **Every page view is a scan**, bots and link previewers included. Good
  enough for a count; real analytics would need filtering.
- **No owner checks yet**: a page stays up whatever the owner's plan. When
  billing lands, decide what an expired subscription's codes show.
- **www.barcodesqr.com does not serve this deployment yet — blocker.** It
  answers with an older build of this app (the pre-2026-10-21 creator, no
  /q route), so a scanned hosted code gets a 404 there until the domain is
  attached to the current Vercel project. barcodesqr.vercel.app/q/<slug>
  works. For QA before then, `NEXT_PUBLIC_QR_BASE_URL` can point codes at
  barcodesqr.vercel.app — downloads re-encode from the slug, so codes
  downloaded again after switching back get the real domain (printed ones
  do not).
- **Uploads are still never deleted** (see below) — deleting a code leaves
  its files; its page goes 404 at once.

### Saved codes: what landed 2026-10-21, and what is still missing

Codes are saved now (Tami could pay but never got a code). The `qr_code`
table holds each code's step-2 values as JSON; what it encodes is re-derived
by `encodeQr` on every render, so an encoder fix reaches saved codes too.
A paying customer's Next saves straight away (`saveQrCode`, which checks the
session, the plan read fresh from the row, the type and a 64 KB cap). Anyone
else has the draft stashed in localStorage before the paywall
(`lib/pendingQr.ts`) and `ClaimPendingQr` saves it on arrival at
/dashboard — so email checkout, Google, and signing in to an existing account
all carry it over. A random `draftKey` + unique index makes a double claim a
no-op. The dashboard lists them with working search (by name), sort, PNG
download and SVG/JPEG from the ⋮ menu.

Still missing, in rough order:

- **Uploads are still orphaned.** A saved code references its files by URL,
  but nothing deletes an object no row references, and keys carry no user
  id. The reaper and the key decision above both still stand.
- **Edit and Delete landed 2026-10-22** (Tami), in the ⋮ menu. Edit
  reopens the creator on the saved values (`/create?type=…&edit=<id>`,
  owner-checked server-side) and saves back to the same row; Back returns to
  the dashboard. While editing, a note says what the edit does: a static
  code carries its content, so its image changes and must be downloaded
  again; a hosted one keeps its image. Delete asks first, and says the same
  distinction. Both unmocked. The type cannot be changed by editing.
- **Still no rename-in-place or password.** The pencil and the password
  switch stay out of the rows (rename is the name field while editing).
  Password reads "Off", Status "Active", Health "Good" (true of every code
  we draw), Scans is blank until short links exist.
- **The ⋮ menu renders at a fixed position in <body>**, opening upward when
  there is no room below: inside the table's horizontal scroller it was
  clipped on the last row. Scrolling closes it.
- **"Create QR code" is back in the toolbar**, as the mockup draws it. The
  PM had cut it, but the ready banner it relied on vanishes after a search
  or sort, and phones have no sidebar — there was no way to create.
- **Codes download in the default black-on-white style.** Step 3 (colours,
  frames) is shelved, so there is no style to save yet; a `style` column is
  the place for it when it returns.
- **Hosted types show their short link and scan count** in the
  dashboard (since 2026-10-23).
- **The dashboard has no phone layout.** The table scrolls sideways below
  1100px; the ready banner's Download covers the new code. Needs a mobile
  mockup of member_main.html.
- **Unmocked:** the sort menu (the file draws only the closed "Date
  created" control), the no-search-results card (borrows the empty state),
  and the save-failed toast in the creator.
- **A draft stashed by a free account stays stashed** until that account
  starts a trial — deliberate, so paying later still brings the code — and
  expires after a day.

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

### Waiting on others (Tami's QA, 2026-10-30)

- **Google Places key.** The Google Maps picker is built (Batch 4 notes)
  and offers only what was typed until `GOOGLE_PLACES_API_KEY` exists,
  locally and on Vercel.
- **Plain Text scans as text**, which an iPhone camera offers to search
  the web. The design shows a note page; that would make Text a hosted
  type. Recommended to JB; not built until they decide.

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
- **All 23 ported** (2026-10-22). Batch 1 (Website, vCard, Multi-Link),
  batch 2 (App Link, PDF, Image, WhatsApp — Monday 5638161680), batch 3
  (Social Media, Menu, WiFi, Video — 5642568390), batch 4 (Google Maps,
  Email, Google Review, SMS — 5646620665), batch 5 (Phone, Plain Text,
  Payment, Audio — 5650333076) and batch 6 (Event, Coupon, Feedback,
  Business — 5654259822). `MobileFallbackStepTwo` now has no type to serve.
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
- **Both pickers now use the designer's icons** — desktop since
  create_desktop.html (2026-10-21) replaced its step 1.
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
- **vCard social profiles go into the contact since 2026-10-22** (Tami):
  each as a labelled URL (`itemN.URL` + `X-ABLabel`), which iPhone lists as
  "Facebook", "Instagram"… and Android imports as websites. WhatsApp →
  wa.me link, Viber → viber:// link, LINE → line.me link, WeChat (no link
  form) → the note. **The photo cannot be in a direct vCard QR**: an image
  does not fit in a QR code, and phones ignore a photo given as a web link.
  It needs the hosted vCard page, which can serve a .vcf with the photo
  embedded (first blocker). Not yet tried on a real iPhone/Android.
- **"Smart Tracking & Editing" is hidden everywhere** (2026-10-22, JB: show
  it only where the code really supports editing and scan counts). No type
  does until the redirect service exists, so `TRACKING_LIVE` in encodeQr.ts
  is false: the desktop badge and the mobile pill render nothing. The pills
  stay in the code where the files draw them — flip the flag when the
  service ships. Forms whose file has the pill sit higher by its height.
- **2026-10-29 mobile sync, ported** (JB, Monday 5675049195):
  App Link's page restyled (title, strap line, dark App Store and white
  Google Play buttons with their marks — the Google Play triangle and the
  Apple logo are the designer's; a store without a link dims once the other
  is set); a "Scanning opens…" note under twelve previews (Google Review's
  sits in its form) — creator-only, not on hosted pages; "Name your QR
  Code" required (mobile; desktop still falls back to the default name);
  WiFi passwords 8–63 characters on both layouts (desktop's limit was 40);
  a payment link on another provider's site refused (mobile only — desktop's
  per-field errors cannot see the provider); Coupon branding (business name
  + cover photo, both layouts) replaces the card's samples, on the hosted
  page too; Menu's badge is its title; Audio gains mute and shows its
  length; PDF counts "x of y" with dead-end arrows dimmed; Multi-Link's
  first link is green and its socials carry logos; vCard's dots too; the
  keypad's * and # lost their letter row; the gallery's remove button is
  white. Everything for `createDsk2` (the desktop step-2 redesign) is in
  the CSS but unused until those pages arrive.
  - *The gallery counter is the file's "1 of 10"* — its script writes the
    limit, not the count. Reproduced in the creator, raised with the
    designer; hosted pages show the real count.
  - *Event's note says scanning "opens your event details"* — the code is
    a calendar entry the phone offers to add, not a page. Raised.
- **Date and time inputs are 16px, 43.7px tall** (JB, 2026-10-29) — the
  text input, so iOS no longer zooms on focus. The files still draw them
  at 12px.
- **Batch 6 notes:**
  - *Event times carry a time zone now, on both layouts.* The creator's
    browser zone is saved with the code (`timezone`) and DTSTART/DTEND are
    encoded in UTC, so the event lands at the right hour wherever it is
    scanned. Desktop's old encoding was floating local time and also
    lacked seconds ("T1800"), which is not a valid iCalendar time — fixed.
    The end rule is the file's: no end date means the start's day, no end
    time 23:59; an end before the start is refused. "Add to Calendar" in
    the preview downloads the same event as an .ics.
  - *The date/time inputs are the file's 12px type,* smaller than its 16px
    text inputs — iOS zooms the page when one is focused. Reproduced;
    raised with JB.
  - *Coupon:* code and expiry optional. Once anything is typed, the preview
    stops showing the sample "SAVE20" / "Expires Dec 31, 2026" — a coupon
    with no code shows no code box or Copy button (their tip: "Leave empty
    for no code"; the file's Event and Business scripts drop samples the
    same way). A past expiry shows "Expired …" in red. Copy code works.
    Still a hosted type (placeholder QR).
  - *Feedback now encodes the customer's form link itself* — its file's
    tip says "Scanners go straight there." Its preview, though, pictures a
    hosted card first; asked JB which is meant. No stars anywhere.
  - *Business Page:* name + at least one of phone/email/website/address,
    the latter three checked when filled. Socials, hours, cover and logo —
    new on mobile — were added to desktop too (JB: parity), with the same
    contact rule. Open/Closed shows only when both hours are set, worked
    out in the saved zone; the file's sample "Open · Closes 3 PM" shows
    only while nothing at all is typed (their script kept it even with real
    content, which would claim the business is open). Still hosted.
  - *Plain Text max is now 1,000 characters* on both layouts (JB); the
    1,100-byte check stays for emoji and accents.
- **Batch 5 notes:**
  - *Phone* reuses the WhatsApp/SMS country + number component with the
    file's placeholder and hint. The QR is `tel:+<code><number>`, spaces
    stripped — it opens the dialer and never places the call. Desktop's
    single field (typed whole, "+44 …") encodes the same way.
  - *Plain Text stays a static code*: the text is in the code, as on
    desktop, so no tracking badge on either layout (desktop's is removed).
    The preview's "Copy text" note page is the file's picture of a hosted
    note that does not exist — a scanner app shows the raw text instead.
    **The file allows 2,000 characters; codes over ~1,100 bytes cannot be
    drawn in the paywall's preview** (blank at 1,590) and scan badly once
    printed, so Next refuses them with an unmocked message. Asked JB whether
    to lower the field's limit to match.
  - *Payment now encodes the payment link itself* — it used to be a
    "dynamic" placeholder that scanned to nothing. JB: the QR goes to the
    customer's own payment page. The file's tracking pill stays, which is as
    untrue for Payment as for Website until the redirect service exists —
    raised with JB. Their script writes "Secure Checkout" when no provider is
    picked; JB ruled out unverified security claims, so the file's static
    "Checkout on your provider's page" shows instead. Desktop's
    per-provider placeholder is kept on mobile (JB: keep desktop features);
    the link's host still auto-selects the provider, as in the file.
  - *Audio* plays the uploaded copy (so it survives Back/Next) and never
    autoplays; collapsing the preview pauses it. Checked in headless Chrome
    only — playback on real iOS/Android devices still needs a hand test.
    The QR is still the dynamic placeholder (first blocker above).
  - *Header icons*: Phone, Plain Text and Audio head their forms with
    different glyphs from the step-1 picker's; copied per file.
  - Diffs at 390: closed views match apart from the site footer the files
    carry; open previews 3.7–5.8%, of which the ~4px drop of every phone
    frame is shared with the approved batches (SMS shows the same), and the
    rest is the scripted vs static sample content.
- **Batch 4 notes:**
  - *Google Maps autocomplete — Google Places, built 2026-10-21, waiting on
    a key.* JB chose Places. `/api/places` proxies Autocomplete and Place
    Details (Places API (New)) so the key stays server-side; the picker
    waits for 3 characters and a 250ms pause, uses one session token per
    search and ends it with an Essentials-tier Details call, so a search is
    billed as one Details request. A picked place stores Google's place id and
    the QR opens that exact listing (`maps/search/?api=1&query_place_id=`).
    **Until `GOOGLE_PLACES_API_KEY` is set (locally and on Vercel) the picker
    offers what was typed, as before.** Tested against mocked Google
    responses only — the real API is unverified until the key exists. Key
    setup, quotas and budget alert: `.env.example`. Desktop's Location field
    is still a plain text box (no picker), but encodes a place id the same
    way if one is set.
  - *"Google Maps" on both layouts* (JB, 2026-10-21): desktop's step-2 title
    and default name ("My Google Maps QR Code") no longer say "Location".
    The tracking badge is gone from both, since the code is a plain Maps
    link with no redirect behind it — nothing to edit, no scans to count.
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

## Desktop step 1 — create_desktop.html, ported 2026-10-21

Step 1 at `md` and up is now the file's page: its own pinned header (logo,
the three steps centred, "Back to Home"), all 23 formats in one grid on the
grey page, the slim footer. The radio cards, "More QR Types" tiles, preview
panel and Cancel bar are gone, so `TypePicker` and `PreviewPanel` were
deleted. Choosing a format goes straight to its form, as on mobile.

- **"wan" → "want"** in the subtitle, per JB; the only copy change.
- **Step 2 on desktop is unchanged** — still the full-screen card with the
  old step rail. The sync brought `createDsk2` / `hdrCreate` rules for a
  desktop step-2 redesign, but no page uses them yet. Until it arrives the
  header changes between steps 1 and 2.
- **The steps in the header are not links** (they are not in the file
  either), and they vanish at 1150 and below, as in the file.
- **Step 1 below `md` is unchanged** (create_mobile.html), checked 1.33%
  before and after.
- **Not ported from the same sync — script-only preview changes.**
  main.js now (a) puts each platform's logo inside the vCard preview's
  colour dots, (b) highlights the first typed link in the Multi-Link
  preview in green (`.lrow.pri`), (c) swaps the Multi-Link social dots for
  `i.bdg2` badges with logos. The HTML still shows the old dots, so the
  static file and the scripted one disagree, and (c) has no CSS for
  `.bdg2` in that preview — it would render the logo unstyled. Asked JB
  whether these are final before porting.
- Diffs: skeleton identical bar the routes and the typo; pixels 0.18–0.23%
  at 1440, 1100, 800 and 768, all of it the subtitle and footer text
  antialiasing. Heights match at every width.

## Desktop step 2, group 1 — create_desktop_*.html, ported 2026-10-29

Website, vCard, Multi-Link, Social Media, App Link and PDF have the new
desktop step 2 (JB, Monday 5675060339); the other 17 keep the old card
until their files arrive. The desktop files are the mobile files at a fixed
10px em (mobile's is 8.112px), so desktop renders the SAME form and preview
components zoomed ×10/8.112 — one implementation, as JB asked. The sizes
the files fix in px (inputs 15px/46.94px, labels 14px, textarea, the
header's subtitle weight) come back through CSS variables in mobile/ui.tsx,
divided by the zoom. Validation, saving, editing, uploads and previews are
the mobile ones; only layout differs (`useDesktop()`).

- **Desktop-only differences, ported:** logo-only header; a step rail with
  labels inside the card; preview as a sticky column with a heading (and a
  tip on Website/vCard), below the form from 992px down; Website's mint URL
  bar; vCard first/last side by side and Social media before Address, with
  the file's static platform strip ("+6") in that header; Multi-Link's name
  and URL side by side; Social Media six to a row with a "More Platforms"
  tile and its own order, "Selected profiles" over the fields, action
  labels in the preview ("Follow on Instagram"), no verified tick; App
  Link's larger layout with QR/share chips; PDF's sample brochure cover
  until a file is in.
- **Kept beyond the files (parity):** Multi-Link's per-link logo and Social
  Media's "Your Links" — features the forms had before; the files draw
  neither. Raised with JB.
- **The rail uses the PM's step names** ("Add Content", "Customize &
  Download"), as step 1's header does; the files still say "Complete
  Content" / "Customize & Protect".
- **No tracking badge** (TRACKING_LIVE), so these forms sit ~55px shorter
  than the files.
- Diffs at 1440: 1.1% (Website) to 3.0% (Social Media), the rest being the
  hidden badge and the parity extras. Checked for horizontal overflow at
  1180, 1024, 900 and 800; mobile unchanged (skeleton identical).

## Fixes from Tami's iPhone QA, 2026-10-30

- **QR text is UTF-8.** qr-code-styling wrote each character's low byte,
  so emoji and accents came out as garbage (SMS, also any vCard name with
  an accent). `QrPreview` now hands it UTF-8 bytes; checked by decoding
  the drawn code (Chrome's BarcodeDetector). Not yet on a real iPhone.
- **Social profiles are checked.** A username ("kaia", "@kaia", "u/kaia")
  becomes the profile link as the field is left; a link must be on that
  platform's own site; WhatsApp/Viber need 7–15 digits. Saved usernames
  from before are turned into links when published. `isValidUrl` also now
  refuses `user:pass@` links and labels starting or ending with "-"; it
  never required ".com".
- **Menu:** spaces typed at the end of a word survive (the stored format
  trimmed every cell on every keystroke). Several sections: "Add Section"
  (unmocked) adds a heading card and an item; the Category field still
  names the first section. Stored as `## Name` lines in the same value.
- **Business:** filled social profiles show in the creator's preview
  (unmocked badges, as on the published page).
- **PDF:** Title and Description show above the document once filled
  (unmocked; the file's preview has neither).
- **My QR Codes on phones** is a card per code (unmocked — member_main.html
  has no phone layout): name, link, then the columns in pairs with their
  headings, then a full-width Download QR. Direct codes show Scans "N/A";
  hosted codes count real visits (zero so far because of the domain).

## Desktop step 2, group 2 — create_desktop_*.html, ported 2026-10-30

Image, WhatsApp, Menu, WiFi, Video and Google Review (JB, Monday
5679427845), the same way as group 1: the mobile forms and previews,
zoomed, with `useDesktop()` variants taken from the files' `createDsk2`
rules. Pixel diffs at 1440: WhatsApp 0.43%, WiFi 0.85%, Video 1.3%, Menu
2.3%, Image 2.5%, Review 2.6% — the hidden tracking badge, Menu's "Add
Section", and the items below. No overflow at 1180/1024/900/800.

- **Departures JB asked for, against the files:**
  - WhatsApp's bubble has no delivery ticks (nothing has been sent).
  - WiFi's preview draws the real code once the network is complete; the
    file's sample picture until then. The caption still says "Sample code
    shown…" — the file's string; raised with JB.
  - Video no longer offers AVI ("MP4, MOV, WEBM"): nothing converts
    uploads and no browser plays AVI. A file this browser cannot decode is
    refused before upload. An iPhone HEVC .mov can still fail on some
    Android browsers — real conversion needs a transcoding service.
  - The gallery counter gives the real count once pictures are in (the
    file's script always says "of 10"); one picture shows no arrows,
    counter or strip.
- **Country list:** the files list 30 countries; all ~230 now, theirs
  first. JB asked for a *searchable* picker — that replaces the files'
  `<select>` with unmocked UI, so it is a question, not built.
- **Shared fixes that reach mobile too:** national numbers ("07700…",
  "081…") lose their trunk 0 in the code (not in Italy); WiFi checks 32
  BYTES of SSID, WPA 8–63 or a 64-hex key, WEP 5/13 or 10/26 hex; Google
  Review links must be on a Google host (g.page, maps.app.goo.gl,
  search.google.com, google.*, share.google, goo.gl, g.co); drag & drop
  now works on every upload box (it never did; the copy promised it).
- **WiFi passwords are stored** with the code so Edit can restore them,
  readable only by the owner's session, like every other saved value.
- **Menu's "View full menu"** stays decorative in the creator preview; the
  hosted page is the full menu and has no such button.

## Image reframing — not in the file, added 2026-10-21

Tami found uploaded photos showing only their middle in "Your Image
Preview", with no way to move them. On phones, tapping a gallery thumbnail
now opens the same ImageAdjuster the logo/cover fields use (drag, zoom,
reset) and turns the preview to that picture; the crop is stored on each
image and replayed in the tiles, the preview and its thumbnail strip. On
desktop the Image field is now `adjustable: "wide"`. Unmocked: the hint
line borrows the form's sub-label style — the designer should draw it.

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
