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
- `content/projects.ts` for the projects section

Each project has a `name`, `oneLiner`, and `stage` (`Shape`, `Build`, `Launch`, or `Iterate`). `url`, `lastShipped`, and `repo` are optional. Leave `url` off when there is no public page. The home page then shows the name as plain text and adds "Coming soon".

`content/articles.ts` and `content/affiliations.ts` are typed data and are not shown on the page yet.

All styles are in `app/globals.css`. The page follows the system light and dark color scheme.
