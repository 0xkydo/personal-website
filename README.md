# kydo.sh

Personal site for Kydo. The home page is the hub for his build-in-public projects, with a short bio, past work, and an investing note.

Live: https://kydo.sh

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm start
npm test
```

The home page renders with no API keys. `/api/greeting` needs `ANTHROPIC_API_KEY`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN`. Deploy and layout notes are in `AGENTS.md`.

## Content

Copy that changes often lives in typed modules under `content/`. The home page reads:

- `content/bio.ts` for the "last updated" date in the footer
- `content/links.ts` for the social links
- `content/projects.ts` for the build-in-public projects, rendered in the Past work list

Each project has a `name`, `oneLiner`, and a committed preview image (`preview`, `previewAlt`). `url`, `lastShipped`, and `repo` are optional. The name and one-liner share one line, in the same shape as the other past-work items. The preview is a static image (`loading="lazy"`), not an iframe. When `url` is set, the name and the preview link to it. Leave `url` off when there is no public page, and point `preview` at a placeholder image instead of inventing a link.

`content/articles.ts` and `content/affiliations.ts` are typed data and are not shown on the page yet.

All styles are in `app/globals.css`. The page follows the system light and dark color scheme.
