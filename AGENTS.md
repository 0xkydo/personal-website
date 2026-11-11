# Agents

Personal site for Kydo (https://kydo.sh). Next.js App Router, React, TypeScript. One home page.

## Setup

Requires Node `>=20.9.0` (Next.js 16). This repo was last run on Node 22.

```bash
npm install
npm run dev
```

Dev server: http://localhost:3000

```bash
npm run build    # production build
npm start        # serve that build
npm test         # vitest, once
npm run test:watch
```

`npm run lint` runs `next lint`. On Next.js 16.1.6 that is not a lint command: Next treats `lint` as a project directory and exits without checking files. `eslint` and `eslint-config-next` are installed, and there is no `eslint.config.*`. Do not add a config or change the script unless asked.

## Deploy

Production is Vercel. `.vercel` is gitignored, and `lib/personalization/context.ts` reads the `x-vercel-ip-*` headers Vercel adds. There is no `vercel.json`. A push to the production branch builds with `next build`. Do not add a custom output mode.

The home page needs no environment variables. `/api/greeting` does, and it fails soft to "Hello." when they are missing:

- `ANTHROPIC_API_KEY` (read by `@ai-sdk/anthropic`)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN` (Upstash Redis)

`/api/darkbloom` has no env. It fetches public Darkbloom stats on the server. Do not commit `.env*.local`.

## Layout

- `app/page.tsx` is the home page. `app/layout.tsx` sets metadata and the Inter font. `app/globals.css` is the only stylesheet.
- `app/api/darkbloom` serves the live network counts. `app/api/greeting` streams a greeting and is not rendered on the home page.
- `components/` holds pieces the page uses. Add `"use client"` only when a component needs state or browser APIs.
- `content/` is typed data. Shared types live in `content/types.ts`. One file per collection (`content/projects.ts`, `content/links.ts`, `content/articles.ts`).
- `lib/` is shared helpers. `lib/darkbloom.ts` parses stats. `lib/personalization/` is the greeting pipeline.
- `__tests__/` is vitest in the Node environment, with the `@/` alias. There is no jsdom.

`content/articles.ts` and `content/affiliations.ts` are not rendered. Leave them until a task asks to show them.

## Conventions

- Keep new list copy in `content/`, then render it from `app/page.tsx`.
- Build-in-public projects live in the Past work list, not a separate section. Title and one-liner share one line. Previews are committed files in `public/projects/`, lazy-loaded. No iframes, stage badges, or status labels. If a project has no public URL, do not invent one.
- Style with the existing CSS variables in `app/globals.css`. No Tailwind, CSS modules, or component libraries.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- User-facing copy is ASCII. No em dashes. The page already uses a spaced hyphen when it needs a break ("Darkbloom - own and share local AI.").
- The only motion is the stats odometer in `.roll`. New animation has to stop under `@media (prefers-reduced-motion: reduce)`, the same way `.roll` does. Static UI needs no animation.
- API routes return a small JSON body. Do not send a large upstream payload to the browser.
- TypeScript is `strict`. Match the existing value import style: `import { Project } from "@/content/types"`.

## Banned

- Do not add a personalization strategy registry until a second strategy exists. `TODOS.md` says the greeting route keeps its direct import until then.
- Do not add a dependency to style a section or to build one component.
- Do not change the `"latest"` ranges in `package.json`. They are intentional.
- Do not render unused content files just because they exist.
- Do not put secret values in source or in docs. Env var names above are enough.
