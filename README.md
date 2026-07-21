# SafaiBook — explainer site

A standalone marketing/explainer page for **SafaiBook**, the monthly
collection-fee book for private door-to-door waste collection operators in India.

> **The collection fee that collects itself.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical operator and to an investor
skimming for 30 seconds.

## What the product does

The monthly waste-collection fee is the most predictable recurring payment
there is, yet every month it gets chased on foot, lane by lane, from a paper
diary. SafaiBook turns that into an automatic cycle:

- **Household register by route** — each home on a route with a named collector,
  its monthly fee and due day.
- **Monthly collection cycle** — one invoice per active household, raised on its
  due day; re-running never duplicates.
- **Dues & arrears roll-up** — a running balance per home, carried forward.
- **Staged WhatsApp reminders** — T-3 days, due day, and overdue, to the outbox,
  deduped so no home is pinged twice for the same stage.
- **Numbered digital receipts** — issued automatically the moment a cash or UPI
  payment lands.
- **Collection % by route** — collected vs pending per route, so the collector
  works the lanes still owing.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the green accent `#16a34a`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "collection register" that collects itself. No dependencies. |
| `favicon.svg` | Ledger-book mark. |
| `og.svg` / `og.png` | 1200×630 social share card. |

## Design notes

- Palette: green accent `#16a34a`, deep green-black ink, off-white ledger paper,
  a muted mint tint, and a burnt-sienna warning colour for overdue/arrears.
- **Signature:** money is always set in tabular monospace, so the whole page
  reads like a collection register (vasooli bahi). The hero widget is a live
  register where a household's due fee visibly moves reminder → paid → numbered
  receipt.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide dashboard
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushed to GitHub, this deploys via GitHub Actions Pages
(`.github/workflows/deploy-pages.yml`). Or upload the folder to any static host
(Netlify, Cloudflare Pages, S3). No configuration required.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
