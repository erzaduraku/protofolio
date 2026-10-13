# Erza Duraku · Portfolio

Personal portfolio for **Erza Duraku**, Software Engineering student at the University of Pristina. Built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4** while learning Next.js concepts from a Udemy course.

**Design:** “logic meets craft” — a tailor’s studio. Off-white paper `#F5F1EA`, dark-green ink `#1F3D2B`, chalk pink `#F2B8C6` (fills only) and thread red `#C8372D` (thread, links, focus, tape). Fraunces display (italic emphasis, opsz/SOFT/WONK axes), Instrument Sans body, DM Mono for a few labels. Pattern-making details: dashed stitch lines, notch marks, measuring-tape scroll bar, paper grain, a red thread drawn down the page, a pin cursor and polaroid stacks.

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
| 1 | Component extraction & props/children | `Header`, `Footer`, `ProjectCard`, `PolaroidStack`, `components/sections/*` (each section reused by Home and its own route) |
| 2 | `<Link>` vs `<a>` + active nav | Internal `next/link`; external `<a target="_blank" rel="noopener noreferrer">`; `NavLink` (`'use client'` + `usePathname`) |
| 3 | Static routes | `/`, `/about`, `/projects`, `/journey`, `/beyond-code`, `/contact` |
| 4 | Dynamic route + `params` Promise + `notFound` + `generateStaticParams` + `generateMetadata` | `app/projects/[slug]/page.js` — unpublished → `notFound()` |
| 5 | Data fetching in Server Components | `data/db.json` + `lib/api.js` |
| 6 | json-server + fetch caching + fallback | `npm run json-server`; `{ next: { revalidate: 60 } }` + local fallback + short timeout |
| 7 | Separate async components on Home | `AboutSection`, `ProjectsSection`, `JourneySection`, `BeyondSection`, `PurposeSection`, `ContactSection` |
| 8 | Streaming / Suspense / `loading.js` | Home: one `<Suspense>` per section; `projects/loading.js`, `[slug]/loading.js`, `journey/loading.js` |
| 9 | Stable keys | `slug` / `id` / image path — never index |
| 10 | Client `useState` | `PolaroidStack` (fan / cycle state), `ContactForm` (form + status) |

## Motion

`framer-motion` (thread `pathLength`, measuring tape `scaleX`, polaroid drag/fan, pin cursor, hero mouse parallax) and `lenis` (smooth scroll). Hero entrances and reveal-on-scroll are CSS (so content is visible without JS). Only transform/opacity animate. With `prefers-reduced-motion`: no Lenis, full thread shown, no parallax, no cursor, no fan animation or dragging.

## Content sources

- Original portfolio document (facts, LinkedIn/GitHub URLs)
- Erza’s Lovable reference site (section copy, tools list, timeline chips, hobby blurbs, “Available on request”)
- Hero image: real asset from the Lovable site (`public/engineering-craft.jpg`), recoloured to the site palette as `public/engineering-craft-ink.jpg` and cut into three pattern pieces in the hero

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