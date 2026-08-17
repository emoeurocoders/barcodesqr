# BarcodesQR

Marketing site for [BarcodesQR](https://www.barcodesqr.com) — a dynamic QR code
generator. Rebuilt on our own infrastructure with Next.js, deployed on Vercel.

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
