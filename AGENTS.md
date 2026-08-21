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
