# TODOS

## 1. OG Image Generation

**What:** Add dynamic Open Graph images using `@vercel/og` for social sharing previews.

**Why:** When the kydo.sh link is shared on Twitter/LinkedIn/Slack, it currently shows no preview image. A generated OG image with the site title and tagline ("Storyteller, operator, and investor") would significantly improve click-through on shared links.

**Context:** `@vercel/og` runs at the edge and generates images from JSX. Add an `app/api/og/route.tsx` that renders JetBrains Mono text on a dark/light background matching the site theme. Reference it in `layout.tsx` metadata. The monospace aesthetic of the site translates well to a generated image.

**Depends on:** Core site must be deployed first. No technical blockers.

---

## 2. Personalization Strategy Registry

**What:** Add a Map-based registry (`lib/personalization/registry.ts`) to register and resolve strategies by name, replacing direct imports.

**Why:** Currently the greeting strategy is imported directly in the API route. This works for one strategy but becomes messy when adding more (time-of-day tone, returning visitor detection, content recommendations, weather-based mood). A registry enables dynamic strategy resolution and cleaner composition.

**Context:** The `PersonalizationStrategy` interface already exists in `lib/personalization/types.ts`. The registry is ~20 lines: a `Map<string, PersonalizationStrategy>` with `register()` and `get()` functions. The API route would switch from `import { greetingStrategy }` to `registry.get("greeting")`. Add the registry when implementing a second strategy — not before. Pattern reference: strategy pattern with simple service locator.

**Depends on:** A concrete second personalization strategy to justify the abstraction.

---

## 3. Respect `prefers-reduced-motion`

**What:** Skip all typewriter/streaming animations when the user's OS has "reduce motion" enabled.

**Why:** Accessibility requirement. Users who set `prefers-reduced-motion: reduce` in their OS have done so because animations cause discomfort (vestibular disorders, motion sensitivity). The typewriter effect — characters appearing one-by-one across the entire page — is exactly the kind of continuous motion this setting is designed to suppress.

**Context:** Two changes needed:
1. **CSS:** Add `@media (prefers-reduced-motion: reduce) { ... }` that sets all content to `visibility: visible` immediately, hides cursor elements, and disables blink animations.
2. **JS:** In `TypewriterText.tsx` and `StreamingGreeting.tsx`, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — if true, skip the animation loop entirely and reveal all content at once. The greeting should still be fetched (it's personalized content) but displayed all at once when the stream completes rather than char-by-char.

**Depends on:** Nothing — can be implemented anytime. Should be prioritized before any public launch or sharing.
