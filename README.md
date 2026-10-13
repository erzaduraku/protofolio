# Erza Duraku · Portfolio

Personal portfolio for **Erza Duraku**, Software Engineering student at the University of Pristina. Built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4** while learning Next.js concepts from a Udemy course.

**Design:** dark blueprint / “logic × craft” aesthetic restyled to match Erza’s Lovable draft (`beje-creativity-spark.lovable.app`) — Inter + JetBrains Mono, oklch navy/blue/terracotta tokens, sharp borders, numbered section labels.

**Projects status:** all entries in `data/db.json` have `"published": false` → Coming soon UI; `/projects/[slug]` 404s. Set `"published": true` to reveal a project.

## How to run

```bash
npm install
npm run dev          # http://localhost:3000 (or next start -p 3005 if 3000 is busy)
npm run json-server  # optional second terminal → http://localhost:3001
npm run lint
npm run build
```

If json-server is offline, `lib/api.js` falls back to `data/db.json`.

## Course concepts used

| # | Concept | Where it shows up |
|---|---------|-------------------|
| 1 | Component extraction & props/children | `Header`, `Footer`, `Card`, `SectionLabel`, `Tag`, `ProjectCard` (ready to reuse) |
| 2 | `<Link>` vs `<a>` + active nav | Internal `next/link`; external `<a target="_blank" rel="noopener noreferrer">`; `NavLink` (`'use client'` + `usePathname`) |
| 3 | Static routes | `/`, `/about`, `/projects`, `/journey`, `/beyond-code`, `/contact` |
| 4 | Dynamic route + `params` Promise + `notFound` + `generateStaticParams` + `generateMetadata` | `app/projects/[slug]/page.js` — unpublished → `notFound()` |
| 5 | Data fetching in Server Components | `data/db.json` + `lib/api.js` |
| 6 | json-server + fetch caching + fallback | `npm run json-server`; `{ next: { revalidate: 60 } }` + local fallback + short timeout |
| 7 | Separate async components on Home | `HomeAboutPreview`, `CurrentlyCard`, `HomeBeyondPreview`, `HomeContactPreview` |
| 8 | Streaming / Suspense / `loading.js` | Home `<Suspense>`; `projects/loading.js`, `[slug]/loading.js`, `journey/loading.js` |
| 9 | Stable keys | `slug` / `id` — never index |
| 10 | Client `useState` filter | `ProjectFilter.js` kept for when projects publish |

## Content sources

- Original portfolio document (facts, LinkedIn/GitHub URLs)
- Erza’s Lovable reference site (section copy, tools list, timeline chips, hobby blurbs, “Available on request”)
- Hero image: real asset from the Lovable site (`public/engineering-craft.jpg`)

## Contact form (Web3Forms)

Visitors can send you a message from Home / Contact. The form posts to `/api/contact`, which forwards to [Web3Forms](https://web3forms.com) so the email arrives at **erzaaduraku15@gmail.com**.

### Activate (one-time)

1. Open https://web3forms.com and create a free access key (use your Gmail: erzaaduraku15@gmail.com).
2. In the project folder, copy `.env.example` to `.env.local`.
3. Paste your key:

```env
WEB3FORMS_ACCESS_KEY=your_key_here
```

4. Restart the dev server (`npm run dev`). Without this key, the form shows a clear “not configured” error — it will not invent a key for you.

Never commit `.env.local` (it is gitignored).