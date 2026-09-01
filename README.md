# BarcodesQR

Marketing site for [BarcodesQR](https://www.barcodesqr.com) — a dynamic QR code
generator. Rebuilt on our own infrastructure with Next.js, deployed on Vercel.

## Status

Pre-launch. Known gaps and everything that must be settled before going live
are tracked in [LAUNCH.md](LAUNCH.md).

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Icons | `lucide-react` |
| Fonts | Inter, Anton, Caveat via `next/font/google` |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Project layout

```
src/
  app/
    globals.css        design tokens + custom utilities
    layout.tsx         fonts, metadata
    page.tsx           homepage composition
  components/
    layout/            Header, Footer
    sections/          Hero, TrustBar, Steps, Showcase,
                       Features, Reviews, Pricing, Faq
    ui/                Button, Logo, MiniQr, AnimatedCounter
public/
  avatars/ payments/ previews/
scripts/
  sync-design.mjs      pulls the designer's mockup into html_files/
html_files/            read-only mirror of the designer's mockup — do not edit
  main.html
  assets/css/ assets/scripts/ assets/images/
```

## Design system

Colors, radii, fonts and shadows are defined once as Tailwind v4 `@theme`
tokens in `src/app/globals.css`. Use the semantic names rather than raw hex:

- Text — `text-ink`, `text-body`, `text-muted`, `text-faint`
- Brand — `bg-brand`, `bg-brand-soft`, `text-brand-dark`
- Action — `bg-primary`, `hover:bg-primary-dark`, `text-on-accent`
- Surfaces — `bg-surface`, `bg-bg`, `bg-bg-alt`, `border-line`
- Custom utilities — `container-page`, `shadow-soft`, `shadow-card`,
  `shadow-pop`, `marquee-mask`, `scroll-thin`, `showcase-fade`

## Design sync

The design arrives as a static HTML/CSS/JS mockup on the designer's staging
host. `html_files/` is a read-only mirror of it — **never hand-edit anything in
there**, or the next sync reverts your work.

```bash
npm run sync:design              # pull the latest mockup
npm run sync:design -- --dry     # report what changed, write nothing
npm run sync:design -- foo.html  # add a page we do not track yet
```

Copy `.env.example` to `.env.local` and fill in the designer host credentials
first. The host is behind HTTP basic auth with no directory listing, so the
script re-fetches everything it already has and follows `href`/`src`/`url()`
references out of the HTML and CSS it downloads — new images come along
automatically, while a brand-new *page* needs naming once.

When a new mockup lands:

1. `npm run sync:design -- --dry` — see the scope
2. `npm run sync:design` — pull it
3. `git diff html_files/` — **this is the design change, as a reviewable diff**
4. Port it into `src/components/`

`html_files/` is committed so that step 3 has a baseline to diff against.

## Notes / TODO

- **Press logos** — the marquee in `TrustBar.tsx` renders text wordmarks as
  placeholders. Drop real artwork into `public/press/` and set `logo` on each
  entry once we have clearance to display it.
- **i18n** — the original site is multilingual; copy is currently inlined in
  English and the footer language switcher is not yet wired up.
- **Routes** — the homepage links to `/create`, `/login`, `/dashboard`,
  `/checkout`, `/help`, `/reviews` and `/legal/*`, which are not built yet.

## Deployment

Deployed on Vercel; pushes to `main` deploy automatically.
