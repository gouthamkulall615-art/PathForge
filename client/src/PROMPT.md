# PathForge landing page: agent prompt (v2)

Paste everything below the line into your coding agent. Put the 6 provided files in the repo first (same paths under `client/src/`), or tell the agent to copy them from this folder.

---

You are a senior front-end engineer and motion designer. Build the PathForge marketing landing page inside the existing monorepo. Work in `client/` only. Do not touch `server/`. Do not break the existing app (map view, onboarding quiz, My Path, auth, contexts).

## 0. How you must work (read first, this is why earlier attempts failed)

1. Work in the numbered milestones in section 6. After EACH milestone run `npm run client:lint && npm run client:build`, fix everything, and only then continue. Never start the next milestone with a red build.
2. Six files are already written and are the source of truth for all hard animation. Copy them verbatim. Do NOT rewrite, simplify, or "improve" their animation logic. You may only edit: the `toForgePhases` adapter in `forgeLayout.js` (to match the real shape of `client/src/data/fields.js`), the copy inside `HowItWorksPinned.jsx` mocks, and import paths.
   - `lib/gsapSetup.js` (single plugin registration, `cssVar` helper)
   - `lib/forgeLayout.js` (pure layout: trunk, hubs, topic nodes, cubic S-curves, horizontal and vertical)
   - `styles/forge.css` (theme tokens + SVG part styles; append to `index.css`)
   - `components/landing/ForgeHeroMap.jsx` (hero: draw trunk, nodes go cold -> heating -> forged, spark, ember path, replay)
   - `components/landing/HeatScrub.jsx` (pinned scrub of one node through the three states)
   - `components/landing/HowItWorksPinned.jsx` (pinned 3-step scrub)
3. Inspect before you write: read `App.jsx`, the router (if any), `index.css`, `ThemeContext`, `data/fields.js`, `lib/generateRoadmap.js`, `AuthContext`, `ProgressContext`. Reuse them. Do not create a parallel theme or state system.
4. Install only: `gsap @gsap/react motion react-router-dom` (skip the last if a router exists), `lucide-react` if missing. Ask before adding anything else.
5. If something fails twice, stop, print the exact error, and explain your hypothesis before trying a third fix.

## 1. Product and voice

PathForge is an open-source engineering roadmap platform for self-directed developers: 10 tracks, an interactive pan/zoom node-tree map, a deterministic (not AI-generated) onboarding quiz that tests you out of what you know and projects a real finish date, Google sync with guest merge, free resources, EN/HI filter, light/dark, full keyboard control.

Voice: specific, technical, calm. Say what it does. Banned words: revolutionize, unlock, supercharge, seamless, journey, game-changer, "AI-powered" (it is deterministic, say so). No exclamation marks, no emojis.

## 2. Design system (strict)

Dark `#0b0d14` / `#11141c` / `#1a1e28`. Light `#f5f7fa` / `#fff` / `#eceff4`. One accent `#0A66C2` (amber only for the "heating" state). Hairlines `border-white/[0.08]` and `border-black/[0.08]`. Inter for UI, JetBrains Mono for dates, counts, keys, status labels. Radius: cards `rounded-xl`, controls `rounded-lg`, chips `rounded-md`. All colors via the CSS variables in `forge.css` (`var(--forge-*)`), both themes, `.dark` on `<html>`.

Forbidden: gradients as decoration, purple/pink, glows, aurora/blobs, glassmorphism, bounce, pills on rectangular badges, stock illustrations, floating 3D shapes, identical card grids for everything, fade-up-on-every-section.

## 3. Motion rules (what makes this not "mid")

Spend the boldness in ONE place: the hero map and the pinned heat scrub. Everything else stays quiet.

- **GSAP + ScrollTrigger** (always through `gsapSetup.js`, always `useGSAP({ scope })`, always inside `gsap.matchMedia()`): hero map, HeatScrub, HowItWorksPinned, and the calibrator below. Nothing else.
- **Framer Motion** (`import { motion, AnimatePresence, useReducedMotion } from 'motion/react'`): nav state, mobile sheet, FAQ accordion, tab/segmented control transitions, and small hover or press feedback. Ease `[0.22, 1, 0.36, 1]`, 0.3 to 0.6s, no springs with bounce. Do NOT apply `whileInView` fade-up to every section; use it at most twice on the whole page.
- **React Bits** (copy-paste into `components/reactbits/`, JS + Tailwind variants, recolor with tokens): `SplitText` for the H1 only, `CountUp` for the stats, `SpotlightCard` for the feature grid (spotlight `rgba(10,102,194,0.12)`), `DotGrid` or `Squares` as a very low-opacity blueprint hero background. If a component imports `three`, `ogl`, or WebGL, skip it.
- Never animate one element with two libraries. Never wrap a GSAP-controlled node in a Framer `layout` element. Animate only `transform`, `opacity`, SVG `stroke-dashoffset`, and colors.
- Reduced motion: handled inside the provided files via `matchMedia`. For your own code: no pin, no scrub, no loops, render final state.

## 4. The two signature interactions (build these, they are the point)

**A. Hero = the product, not a screenshot.** `ForgeHeroMap` fed with the Full Stack track's first 3 phases from `fields.js` through `toForgePhases`. Left column: H1 "Forge your engineering path." (SplitText), one-sentence subhead (deterministic roadmap built from a skill check, not a template), two CTAs. Right column: the map. Annotate it like an engineering drawing with 3 or 4 small mono callouts that point at real things (phase duration from data, "mastered", projected date).

**B. Calibrator (interactive, replaces a generic features grid).** A card with the first phases of one track as toggles: "I already know this". Toggling a phase flips its chip to `mastered`, collapses its node group, and the projected finish date and total hours recompute live. Use the REAL logic from `lib/generateRoadmap.js` (import it; do not re-implement duration parsing). Date and hours in `font-mono tabular-nums`. Animate the number change with GSAP (`gsap.to(obj, { onUpdate })` writing to a ref, no per-frame React state). Provide a weekly-hours segmented control (5 / 10 / 20) built with Framer Motion `layoutId` indicator.

## 5. Page structure (`client/src/components/landing/`, one file per section, `pages/Landing.jsx` composes)

1. `LandingNav`: sticky, hairline appears after 8px scroll, wordmark, anchors, theme toggle (existing ThemeContext), GitHub, CTA ("Continue your path" if progress or auth exists). Below 768px: Framer Motion sheet.
2. `Hero` (section 4A) with DotGrid or Squares at about 6% opacity, masked to fade into the canvas.
3. `StatsStrip`: CountUp of tracks, phases, topics, resources computed from `fields.js`, plus "free" and "open source".
4. `TracksGrid`: all 10 tracks, real description, phase count, duration range. Dense list-style rows or a 2-column grid, not ten identical hover cards. Links to `/app`.
5. `HowItWorksPinned` (provided).
6. `HeatScrub` (provided).
7. `Calibrator` (section 4B).
8. `FeatureGrid`: bento (uneven spans), SpotlightCard, 6 to 8 items, each showing a real UI fragment: minimap, focus mode, keyboard legend (`X` done, `F` focus, `+` `-` zoom, arrows), EN/HI toggle, guest-merge sync, theme.
9. `OpenSource`: GitHub link, stack in mono, contribution note.
10. `Faq`: Framer Motion accordion, native `<button aria-expanded aria-controls>`, 6 to 7 honest answers (free, account needed, how paths are generated, not an LLM, switching tracks, sync, Hindi resources).
11. `FinalCta`: one line, one button, blueprint grid.
12. `Footer`: minimal, hairline, version string in mono.

## 6. Milestones (stop and verify after each)

1. **Setup**: install deps, add provided files, append `forge.css`, add `/` landing route and keep the app at `/app`, lazy-load `Landing`. Verify: app still works, build green, `/` renders an empty Landing.
2. **Hero + nav**: `ForgeHeroMap` renders with real data, plays once, replay button works, vertical layout under 768px, theme toggle re-colors on next replay (pass `themeKey`). Verify in both themes.
3. **Static sections**: stats, tracks, features, open source, FAQ, final CTA, footer (no scroll animation yet).
4. **Pinned sections**: HowItWorksPinned and HeatScrub. Verify: no jump at pin start/end, no horizontal scroll, `ScrollTrigger.refresh()` runs after fonts load, navigating away and back does not duplicate triggers.
5. **Calibrator**.
6. **Pass over quality**: a11y (landmarks, `aria-labelledby`, skip link, focus rings `focus-visible:ring-2 ring-[#0A66C2]`, AA contrast both themes), reduced motion on, 360/768/1280/1920 widths, Lighthouse performance >= 90, CLS 0, SEO tags + JSON-LD `SoftwareApplication`, preload only the font weights used.

## 7. Known pitfalls (check these before reporting a bug)

- React StrictMode runs effects twice: that is why every animation lives in `useGSAP` and `matchMedia`, never in a bare `useEffect`.
- Pinned sections in a lazy route: call `ScrollTrigger.refresh()` after the route mounts and after images or fonts load. No pinned section may sit inside an element with `overflow: hidden` or a CSS `transform`.
- Tailwind 4 has no `tailwind.config.js` by default; use CSS variables and arbitrary values as written. `group-data-[state=...]` variants are used in `HeatScrub`, so the section must keep the `group` class.
- SVG `transform-box: fill-box` is set in `forge.css`; without it scale animations on SVG groups fly from the wrong origin.
- `cssVar()` reads resolved colors once per build; changing theme requires a rebuild, which the `themeKey` dependency handles.
- Do not put `will-change` permanently on anything.

## 8. Final report

List files created, packages added, where each of GSAP, Framer Motion and React Bits is used, anything skipped and why, and the Lighthouse numbers.
