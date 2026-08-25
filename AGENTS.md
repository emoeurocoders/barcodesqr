<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BarcodesQR

## Design sync

The visual design arrives as a static HTML/CSS/JS mockup on the designer's
staging host, not as a spec. `html_files/` is a **read-only mirror** of that
host — never hand-edit anything in it, or the next sync silently reverts your
work and the diff stops meaning anything.

```bash
npm run sync:design            # pull the latest
npm run sync:design -- --dry   # what changed? write nothing
npm run sync:design -- foo.html   # add a page we do not track yet
```

Credentials live in `.env.local` (gitignored) — see `.env.example`. The host is
behind HTTP basic auth and has no directory listing, so the script re-fetches
every file it already has and follows `href`/`src`/`url()` references out of the
HTML and CSS it downloads. That means a new image the designer added is picked
up without anyone naming it; a genuinely new *page* still has to be passed
explicitly once.

The workflow when the PM says "new mockup is up":

1. `npm run sync:design -- --dry` to see the scope of the change.
2. `npm run sync:design` to pull it.
3. `git diff html_files/` — this is the actual design change, in review form.
4. Port the change into `src/components/`, which is the real implementation.

`html_files/` is committed precisely so step 3 works; without a committed
baseline there is nothing to diff against.

## Porting mockup to components

The mockup is plain HTML with its own CSS (`assets/css/*.css`) and jQuery. The
app is React + Tailwind v4. Do not copy the mockup's CSS or markup wholesale —
translate it:

- Colors, spacing and radii belong in the `@theme` tokens in
  `src/app/globals.css`, not as raw hex in components.
- Icons are `lucide-react` components where an equivalent exists; only keep the
  designer's SVG when it is genuinely custom (logos, illustrations).
- Vendor scripts (jQuery et al.) are deliberately not synced and never ported —
  behaviour belongs in React state.

**Translation covers styling mechanics only.** Everything the user can see or
a screen reader can hear is NOT up for translation — that part is governed by
the fidelity contract below, which is shared with the OrbisIQ project and
exists because every rule in it corresponds to a port that was sent back.

### The fidelity contract

The PM opens the mockup and the port side by side. **Every difference is a
defect, including the ones that look like improvements.**

**Work from the designer's file open beside you** — not from a screenshot, not
from memory of a similar page, and not from the live production site. The
mockup in `html_files/` is the single source of truth.

**Port every element in the file.** A section you have no data for is still a
section. If something genuinely cannot be built yet, port the markup, leave it
visibly empty, and say so in the handover — deleting it silently reads as a
broken port, and the PM finds it before you do.

**Copy every string byte for byte.** Labels, placeholders, helper text, button
copy, capitalisation, `...` vs `…`. Paste the designer's strings; never retype
them — retyped text is where "Log In" becomes "Log in".

**Keep the element semantics.** Tailwind replaces their classes; it does not
replace their elements. Their `<a>` stays an `<a>` (wrap in `next/link`, not
`<button>`), their `<nav><ul><li>` structure stays, their `<h1>` does not
become a styled `<div>`. Swapped elements drag in UA styles you then fight
back with overrides nobody asked for, and they change what assistive tech
announces.

**Measure, never eyeball.** Every colour, font size, spacing and radius in a
component must come from the mockup's computed values (`npm run -s skel -- …
--styles` prints them), mapped through a `@theme` token. "Looks about right"
at one screen width is how drift accumulates.

**Icons are copied, never designed.** The designer's path data is ground
truth. A `lucide-react` icon may stand in only when its rendered glyph matches
theirs — same meaning AND same visual weight at the same size. When in doubt,
copy their SVG verbatim (attributes camelCased for React: `strokeWidth`,
`linearGradient` — lowercase renders nothing, silently). Never draw or invent
an icon, including logos.

**A state the mockup does not show is still yours to build honestly** — empty
list, loading, error. Use the mockup's nearest existing pattern, and flag it
in the handover as unmocked.

**If you think the design is wrong, reproduce it and say so.** Raise it in the
handover as a question. Fixing it inside the port makes the port wrong _and_
hides the bug.

#### The only sanctioned divergences

This list is closed. Anything not on it is a defect; adding to it is a
decision to raise, not a detail to settle yourself.

| Divergence                                     | Why it is allowed                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| Designer's classes → Tailwind utilities/tokens | The translation itself. Rendered result must still match.             |
| `href="#"` / `*.html` → real routes, `next/link` | The mockup cannot navigate; the product must. Element type unchanged. |
| Sample rows → real data                        | Same markup, live content. Row COUNT may differ; row SHAPE may not.   |
| jQuery behaviour → React state                 | Vendor scripts are never ported. Same class-toggle outcomes.          |
| Designer SVG → `lucide-react` icon             | Only when the glyph visually matches — see the icon rule.             |
| SVG/attr casing fixed for React                | `strokeWidth`, `linearGradient` — React renders nothing otherwise.    |

### Prove it matches: diff first, then look

A port is not done until it has been **diffed** and then **looked at**.
`npm run build` passing proves nothing about either.

**1. Skeleton diff — content, structure, icons, copy:**

```bash
# -s, or npm's banner lands in the file and shows up as diff noise.
npm run -s skel -- html_files/main.html --root 'header' > /tmp/design.txt
npm run -s skel -- http://localhost:3000/ --root 'header' > /tmp/port.txt
diff -u /tmp/design.txt /tmp/port.txt
```

Because this port translates classes, the skeleton omits them and compares
what may NOT differ: tags, nesting, every string, every `@placeholder`,
`@href`, and icon `@d`. Add `--styles` to append computed font/box/padding/
colour per node — that is how a Tailwind translation proves it reproduced the
designer's numbers rather than approximating them. `--click 'Text'` opens
interaction-gated UI first; `--session $TOKEN` sets the Auth.js cookie for
signed-in pages; `--width 390` is a TRUE 390px viewport (unlike
`--window-size`, which headless Chrome floors at 500px).

**Every remaining diff line must be explainable by a sanctioned divergence or
live data**, and the leftovers get quoted in the handover.

**2. Pixel diff — the paint:**

```bash
npm run -s diff:design -- html_files/main.html http://localhost:3000/ --width 1440
npm run -s diff:design -- html_files/main.html http://localhost:3000/ --width 390
```

Renders both sides in the same headless Chrome (animations frozen, true
viewport) and prints an overall mismatch percentage plus the y-ranges where
mismatch concentrates, with `design.png` / `port.png` / `diff.png` written to
`/tmp/design-diff`. Self-diff is 0.00%; font rasterisation keeps everything
else above zero. Read it as: **< 1%** matching (still read the bands — 0.4%
can be one wrong icon), **1–5%** a real region differs, **> 5%** something is
missing, misplaced or missized. A height mismatch between the two captures is
a finding in itself. Every band must be explained; only explained bands pass.

**3. Then look at it** — open `diff.png` and the two captures, at 1440 and
390. When something looks wrong, screenshot the mockup at the same width
FIRST: it separates "I broke it" from "it was always broken" in one step.
Designer bugs are reproduced faithfully and reported upstream, not patched.

Both scripts are shared copies with the OrbisIQ repo
(`~/www/dev/orbisiq/scripts/`); if you improve one copy, port the improvement
to the other.

#### Before you say it is done

- [ ] Skeleton diff run against the mockup for every ported root; leftovers
      all explainable and quoted in the handover
- [ ] `--styles` pass on anything that was restyled by hand
- [ ] Pixel diff run at 1440 **and** 390; every mismatch band explained
- [ ] Interactive states exercised: open, close, hover, Esc, client-side
      navigation away (effects must clean up)
- [ ] Handover lists every visible difference from the mockup and why,
      including anything unbuildable — the PM should never be the one to
      spot it

## Auth and database

Accounts are email + password, matching what the product's login page offers.
Auth.js v5 handles sessions; Drizzle talks to Neon.

```bash
npm run db:generate   # write a migration from schema changes
npm run db:migrate    # apply pending migrations
npm run db:studio     # browse the data
```

Config lives in `.env.local` — see `.env.example`. `AUTH_SECRET` must be set or
Auth.js refuses to start, and each environment should have its own value:
rotating it signs everyone out.

Things worth knowing before changing any of it:

- **Sessions are JWT, not database rows.** Auth.js only supports the database
  strategy for providers that go through the adapter, and Credentials
  deliberately does not. The adapter is still wired up so users live in Neon and
  an OAuth provider can be added later without a migration.
- **Passwords are bcrypt, cost 12,** in `user.password_hash`. The column is
  nullable so an OAuth-only account is a real, answerable state.
- **`authorize` compares against a dummy hash when the account is missing,** so
  response time doesn't reveal which emails are registered. Signup's duplicate
  case returns the same message as a validation failure for the same reason.
  Keep both if you touch that code.
- **Migrations run over `DATABASE_URL_UNPOOLED`.** The pooler rejects some DDL.
- Pages guard themselves with `await auth()` server-side rather than via
  middleware, which keeps bcrypt out of the Edge bundle.
