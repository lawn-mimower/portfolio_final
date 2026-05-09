# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `mihirmohite.in` as an Astro static site in the locked "merged direction" (IBM Plex pair, hairlines, dot-grid, drawing corners, terminal cursor, amber accent), replacing all content with resume-honest copy and shipping the home page first.

**Architecture:** Astro 5 SSG, vanilla CSS with token system, MDX for case studies, view transitions API for nav + theme cross-fades, Netlify static deploy to the existing site (custom domain `mihirmohite.in` already mapped). All current chat-widget code is removed. Mode toggle uses `prefers-color-scheme` default + manual override stored in `localStorage`, applied to `<html data-theme>` via inline pre-paint script.

**Tech Stack:** Astro 5, `@astrojs/mdx`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`, vanilla CSS, Vitest (for the lint script only), Netlify Forms.

**Spec:** `docs/superpowers/specs/2026-05-04-portfolio-redesign-design.md`

**Repo root:** `/Users/mihirmohite/MIT/Interview/portfolio_final`

**Testing posture (read this before starting):** This is a static portfolio. Component appearance is verified by running `npm run dev` and inspecting in the browser — no snapshot tests for `.astro` files (low ROI). The two pieces with real logic *do* get unit tests: (1) the banned-vocabulary lint script in Task 45, (2) any utility extracted from the mode-toggle in Task 21. Everything else is verified visually with explicit checks listed in each task.

---

## Phase 0 — Setup & legacy fence (Tasks 1–7)

### Task 1: Create the redesign branch

**Files:** none (git only)

- [ ] **Step 1: Verify clean working tree**

Run: `cd /Users/mihirmohite/MIT/Interview/portfolio_final && git status`
Expected: `nothing to commit, working tree clean` (or only `.superpowers/` untracked, which is fine).

- [ ] **Step 2: Create and switch to redesign branch**

Run: `git checkout -b redesign`
Expected: `Switched to a new branch 'redesign'`

- [ ] **Step 3: Confirm branch**

Run: `git branch --show-current`
Expected output: `redesign`

---

### Task 2: Move legacy files to `_legacy/`

**Files:**
- Move (git mv): `index.html`, `styles.css`, `main.js`, `thank_you.html`, `package.json`, `package-lock.json`, `netlify/functions/chat.js`, `Mihir_Mohite_Resume.pdf`, `favicon.png`, `favicon.svg`, all loose `*.png`, `*.jpeg`, `*.jpg` images.
- Keep at root: `.git/`, `.github/`, `.claude/`, `.gitignore`, `netlify.toml`, `node_modules/` (will be removed in Task 3), `.superpowers/`, `docs/`.

- [ ] **Step 1: Create `_legacy/` and `_legacy/netlify/functions/`**

Run: `mkdir -p _legacy/netlify/functions _legacy/assets`

- [ ] **Step 2: Move HTML / JS / CSS / package files**

Run:
```
git mv index.html _legacy/index.html
git mv styles.css _legacy/styles.css
git mv main.js _legacy/main.js
git mv thank_you.html _legacy/thank_you.html
git mv package.json _legacy/package.json
git mv package-lock.json _legacy/package-lock.json
git mv netlify/functions/chat.js _legacy/netlify/functions/chat.js
```

- [ ] **Step 3: Move legacy assets (images + resume PDF + favicons)**

Run:
```
git mv "Mihir_Mohite_Resume.pdf" _legacy/assets/
git mv favicon.png _legacy/assets/
git mv favicon.svg _legacy/assets/
git mv "WhatsApp Image 2025-04-19 at 15.40.37.jpeg" _legacy/assets/portrait-1.jpeg
git mv "WhatsApp Image 2025-04-19 at 15.48.45.jpeg" _legacy/assets/portrait-2.jpeg
git mv "download.png" _legacy/assets/
git mv "download (1).png" _legacy/assets/download-1.png
git mv "download.jpeg" _legacy/assets/
git mv "images.jpeg" _legacy/assets/
git mv "omni.png" _legacy/assets/
```

- [ ] **Step 4: Remove now-empty `netlify/functions/` directory**

Run: `rmdir netlify/functions netlify 2>/dev/null || true`

- [ ] **Step 5: Remove old `node_modules/` (will be reinstalled fresh)**

Run: `rm -rf node_modules`

- [ ] **Step 6: Verify root tree**

Run: `ls -A`
Expected: only `.claude/`, `.git/`, `.github/`, `.gitignore`, `.superpowers/`, `_legacy/`, `docs/`, `netlify.toml` should remain.

- [ ] **Step 7: Commit**

Run:
```
git add -A
git commit -m "chore: fence legacy site under _legacy/ ahead of Astro rewrite"
```

---

### Task 3: Initialize Astro in the repo root

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `public/.gitkeep`

- [ ] **Step 1: Initialize package.json**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/package.json`:
```json
{
  "name": "mihirmohite-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint:vocab": "node scripts/lint-vocabulary.mjs",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Install Astro core**

Run: `npm install astro@^5.0.0`
Expected: package added; `node_modules/` created; `package-lock.json` created.

- [ ] **Step 3: Create `astro.config.mjs`**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mihirmohite.in',
  trailingSlash: 'never',
  integrations: [mdx()],
  build: {
    format: 'directory',
  },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", "scripts/**/*"],
  "exclude": ["dist", "_legacy"]
}
```

- [ ] **Step 5: Create `src/env.d.ts`**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/src/env.d.ts`:
```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 6: Create `public/.gitkeep` so the dir is tracked**

Run: `mkdir -p public src && touch public/.gitkeep`

- [ ] **Step 7: Commit**

Run:
```
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts public/.gitkeep
git commit -m "chore: scaffold Astro project at repo root"
```

---

### Task 4: Install MDX, fonts, and dev tools

**Files:** `package.json` (modified by npm install)

- [ ] **Step 1: Install runtime deps**

Run: `npm install @astrojs/mdx @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono`
Expected: 3 deps added to `package.json` `dependencies`.

- [ ] **Step 2: Install dev deps for the lint script tests**

Run: `npm install -D vitest @types/node`
Expected: `devDependencies` populated.

- [ ] **Step 3: Verify all installs resolve**

Run: `npm list --depth=0`
Expected: prints astro, @astrojs/mdx, both fontsource packages, vitest, @types/node — no `UNMET PEER DEP` errors.

- [ ] **Step 4: Commit**

Run:
```
git add package.json package-lock.json
git commit -m "chore: install mdx, IBM Plex fonts, vitest"
```

---

### Task 5: Update `netlify.toml` (drop functions block, keep forms)

**Files:**
- Modify: `netlify.toml`

- [ ] **Step 1: Read current `netlify.toml`**

Run: `cat netlify.toml`
Note any `[functions]` block, `[[redirects]]` for `/api/chat`, and current `[build]` settings.

- [ ] **Step 2: Replace contents with Astro-friendly config**

Overwrite `/Users/mihirmohite/MIT/Interview/portfolio_final/netlify.toml`:
```toml
[build]
  command   = "npm run build"
  publish   = "dist"

[build.environment]
  NODE_VERSION = "20"

# Form handling: Astro emits static HTML; Netlify auto-detects forms with
# the `data-netlify="true"` attribute on the rendered <form>.
```

(The chat function and any `/api/chat` redirect are intentionally gone.)

- [ ] **Step 3: Verify file**

Run: `cat netlify.toml`
Expected: no `[functions]` block, no `/api/chat` redirect, `command = "npm run build"`, `publish = "dist"`.

- [ ] **Step 4: Commit**

Run:
```
git add netlify.toml
git commit -m "chore(netlify): drop chat function, point publish dir at Astro dist/"
```

---

### Task 6: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Inspect current `.gitignore`**

Run: `cat .gitignore`

- [ ] **Step 2: Append entries**

Append the following lines to `/Users/mihirmohite/MIT/Interview/portfolio_final/.gitignore` (avoid duplicates — only add lines not already present):
```
node_modules/
dist/
.astro/
.superpowers/
.env
.env.local
.DS_Store
```

- [ ] **Step 3: Verify the listed paths are now ignored**

Run: `git status --ignored | head -30`
Expected: `node_modules/`, `dist/` (when present), `.superpowers/` show under "Ignored files".

- [ ] **Step 4: Commit**

Run:
```
git add .gitignore
git commit -m "chore: ignore node_modules/, dist/, .astro/, .superpowers/"
```

---

### Task 7: Smoke-test the empty Astro project

**Files:**
- Create (placeholder): `src/pages/index.astro`

- [ ] **Step 1: Create a minimal index page**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/src/pages/index.astro`:
```astro
---
---
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>scaffold</title></head>
  <body>scaffold ok</body>
</html>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `dist/index.html` is generated; no errors.

- [ ] **Step 3: Verify output**

Run: `cat dist/index.html | head -5`
Expected: includes `scaffold ok`.

- [ ] **Step 4: Clean and commit**

Run:
```
rm -rf dist
git add src/pages/index.astro
git commit -m "feat: scaffold smoke-test index page"
```

---

## Phase 1 — Design system (Tasks 8–23)

### Task 8: Color + type tokens

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
:root {
  /* Type families (set by @fontsource imports in Base.astro) */
  --font-sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;

  /* Type scale */
  --fs-display:    2.6rem;
  --fs-display-sm: 2rem;
  --fs-h2:         1.05rem;
  --fs-body:       0.95rem;
  --fs-mono-data:  0.78rem;
  --fs-mono-label: 0.66rem;
  --fs-mono-corner: 0.625rem;

  --lh-display: 1.0;
  --lh-body:    1.6;

  --ls-display:  -0.04em;
  --ls-label:    0.22em;
  --ls-data:     0.02em;

  /* Spacing scale */
  --sp-1: 0.25rem;
  --sp-2: 0.5rem;
  --sp-3: 0.75rem;
  --sp-4: 1rem;
  --sp-5: 1.5rem;
  --sp-6: 2rem;
  --sp-8: 3rem;
  --sp-10: 4rem;

  /* Layout */
  --content-max: 980px;
  --frame-pad-x: clamp(1.25rem, 4vw, 2.75rem);
  --frame-pad-y: 1.75rem;
}

/* Default (light) */
:root,
:root[data-theme='light'] {
  --bg:        #f6f2e6;
  --ink:       #18181b;
  --mid:       #5a5a60;
  --muted:     #7a7a82;
  --rule:      #18181b;
  --rule-a:    0.32;
  --dot:       #c9c5b8;
  --accent:    #b54a00;
  --code-bg:   #efe9d9;
  --selection-bg: rgba(181, 74, 0, 0.25);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --bg:        #0c0c0e;
    --ink:       #f0ece2;
    --mid:       #9a958a;
    --muted:     #6a655c;
    --rule:      #f0ece2;
    --rule-a:    0.32;
    --dot:       #1d1d1f;
    --accent:    #ffb547;
    --code-bg:   #1a1a1d;
    --selection-bg: rgba(255, 181, 71, 0.25);
  }
}

:root[data-theme='dark'] {
  --bg:        #0c0c0e;
  --ink:       #f0ece2;
  --mid:       #9a958a;
  --muted:     #6a655c;
  --rule:      #f0ece2;
  --rule-a:    0.32;
  --dot:       #1d1d1f;
  --accent:    #ffb547;
  --code-bg:   #1a1a1d;
  --selection-bg: rgba(255, 181, 71, 0.25);
}
```

- [ ] **Step 2: Commit**

Run:
```
git add src/styles/tokens.css
git commit -m "feat(styles): color + type + spacing tokens with light/dark"
```

---

### Task 9: Reset + base styles

**Files:**
- Create: `src/styles/reset.css`

- [ ] **Step 1: Create `src/styles/reset.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  font-feature-settings: 'ss02', 'ss03';
  min-height: 100vh;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

img, svg { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: transparent; border: 0; cursor: pointer; }

::selection { background: var(--selection-bg); color: var(--ink); }

code, pre, kbd { font-family: var(--font-mono); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Commit**

Run:
```
git add src/styles/reset.css
git commit -m "feat(styles): reset + base body/link/selection styles"
```

---

### Task 10: Primitives stylesheet (Frame, Hairline, SpecGrid, EntryRow, Label)

**Files:**
- Create: `src/styles/primitives.css`

- [ ] **Step 1: Create `src/styles/primitives.css`**

```css
/* ============ Frame ============ */
.frame {
  position: relative;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--frame-pad-y) var(--frame-pad-x);
  background-image: radial-gradient(circle, var(--dot) 0.7px, transparent 0.7px);
  background-size: 14px 14px;
}
.frame::before,
.frame::after {
  content: '';
  position: absolute;
  left: var(--frame-pad-x);
  right: var(--frame-pad-x);
  height: 1px;
  background: var(--rule);
  opacity: var(--rule-a);
}
.frame::before { top: calc(var(--frame-pad-y) - 0.65rem); }
.frame::after  { bottom: calc(var(--frame-pad-y) - 0.65rem); }

/* ============ Drawing-corner annotations ============ */
.corner {
  position: absolute;
  font-family: var(--font-mono);
  font-size: var(--fs-mono-corner);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  pointer-events: none;
}
.corner.tl { top: 0.45rem; left: var(--frame-pad-x); }
.corner.tr { top: 0.45rem; right: var(--frame-pad-x); }
.corner.bl { bottom: 0.45rem; left: var(--frame-pad-x); }
.corner.br { bottom: 0.45rem; right: var(--frame-pad-x); }

/* ============ Section label (00 NOW) ============ */
.section-label {
  font-family: var(--font-mono);
  font-size: var(--fs-mono-label);
  text-transform: uppercase;
  letter-spacing: var(--ls-label);
  color: var(--accent);
  margin-top: var(--sp-8);
}
.section-label .num {
  color: var(--ink);
  opacity: 0.45;
  margin-right: 0.6rem;
}

/* ============ Display title (h1/h2 in spec-sheet style) ============ */
.display {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: var(--fs-display);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  margin: var(--sp-2) 0;
  color: var(--ink);
}
@media (max-width: 720px) {
  .display { font-size: var(--fs-display-sm); }
}

/* Mono role line */
.role {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--mid);
  letter-spacing: var(--ls-data);
}

/* Body paragraph inside a section */
.body-text {
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--ink);
  max-width: 64ch;
}
.body-text code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--accent);
  background: var(--code-bg);
  padding: 1px 5px;
  border-radius: 2px;
}
.body-text b, .body-text strong { font-weight: 500; }

/* Pipeline line */
.pipeline {
  font-family: var(--font-mono);
  font-size: var(--fs-mono-data);
  color: var(--mid);
  letter-spacing: var(--ls-data);
}
.pipeline .arrow {
  color: var(--accent);
  margin: 0 0.35rem;
}

/* Hairline */
.hairline {
  border: 0;
  height: 1px;
  background: var(--rule);
  opacity: var(--rule-a);
  margin: var(--sp-5) 0;
}

/* SpecGrid */
.specs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-4);
  margin-top: var(--sp-4);
  font-family: var(--font-mono);
  font-size: var(--fs-mono-data);
}
.specs .cell {
  border-top: 1px solid var(--rule);
  padding-top: var(--sp-2);
}
.specs .cell .k {
  color: var(--mid);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.62rem;
}
.specs .cell .v {
  color: var(--ink);
  margin-top: 0.2rem;
  font-size: 0.82rem;
  line-height: 1.35;
}
.specs .cell .v b { color: var(--accent); font-weight: 500; }
@media (max-width: 720px) { .specs { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 420px) { .specs { grid-template-columns: 1fr; } }

/* EntryRow */
.entry {
  display: grid;
  grid-template-columns: 110px 1fr 90px;
  gap: var(--sp-4);
  padding: var(--sp-3) 0;
  border-top: 1px solid var(--rule);
  align-items: baseline;
}
.entry .when {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.entry .what h3 {
  margin: 0 0 0.15rem 0;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
}
.entry .what .org {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--mid);
  margin-bottom: 0.25rem;
}
.entry .what p {
  font-size: 0.88rem;
  margin: 0;
  max-width: 60ch;
}
.entry .what p b { color: var(--accent); font-weight: 500; }
.entry .read {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.entry .read .arrow {
  display: inline-block;
  transition: transform 120ms ease;
}
.entry:hover .read .arrow { transform: translateX(4px); }
.entry:hover .read { color: var(--accent); }
@media (max-width: 720px) {
  .entry { grid-template-columns: 1fr; gap: var(--sp-2); }
  .entry .read { text-align: left; }
}

/* Recognitions one-liner */
.recog {
  font-family: var(--font-mono);
  font-size: var(--fs-mono-data);
  color: var(--mid);
}
.recog b { color: var(--accent); font-weight: 500; }

/* Skills groups */
.skills-group { margin-top: var(--sp-4); }
.skills-group .k {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent);
  margin-bottom: 0.35rem;
}
.skills-group .v { font-size: 0.92rem; color: var(--ink); }
.skills-group .v span { white-space: nowrap; }
.skills-group .v span + span::before { content: ' · '; color: var(--mid); }

/* Form */
.form { display: grid; gap: var(--sp-4); max-width: 520px; margin-top: var(--sp-4); }
.form label { display: block; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--mid); margin-bottom: 0.25rem; }
.form input, .form textarea {
  width: 100%;
  padding: 0.55rem 0.7rem;
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--rule);
  border-radius: 0;
  font: inherit;
}
.form input:focus, .form textarea:focus { outline: 1px solid var(--accent); border-color: var(--accent); }
.form button[type='submit'] {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 0.6rem 1rem;
  border: 1px solid var(--ink);
  color: var(--ink);
  background: transparent;
  cursor: pointer;
}
.form button[type='submit']:hover { background: var(--ink); color: var(--bg); }
.form .hp { display: none; }
```

- [ ] **Step 2: Commit**

Run:
```
git add src/styles/primitives.css
git commit -m "feat(styles): primitives — frame, corners, label, specs, entries, form"
```

---

### Task 11: Motion stylesheet

**Files:**
- Create: `src/styles/motion.css`

- [ ] **Step 1: Create `src/styles/motion.css`**

```css
/* Blinking caret */
@keyframes caret-blink {
  50% { opacity: 0; }
}
.caret {
  display: inline-block;
  width: 0.5ch;
  height: 1em;
  background: var(--accent);
  margin-left: 0.25ch;
  vertical-align: text-bottom;
  animation: caret-blink 1s steps(2) infinite;
}

/* Hairline draw-on-scroll: hairline starts at 0% width and grows to 100% */
.hairline.draw {
  width: 100%;
  background: var(--rule);
  opacity: var(--rule-a);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 250ms ease-out;
}
.hairline.draw.is-in { transform: scaleX(1); }

/* Section-label fade */
.section-label.draw {
  opacity: 0;
  transition: opacity 200ms ease-out;
}
.section-label.draw.is-in { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .caret { animation: none; opacity: 1; }
  .hairline.draw, .section-label.draw { transform: none; opacity: 1; transition: none; }
}
```

- [ ] **Step 2: Commit**

Run:
```
git add src/styles/motion.css
git commit -m "feat(styles): motion — caret blink, hairline draw-in, reduced-motion gate"
```

---

### Task 12: Base layout with mode-init, fonts, View Transitions

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import '@fontsource/ibm-plex-sans/300.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/300.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';

import '../styles/tokens.css';
import '../styles/reset.css';
import '../styles/primitives.css';
import '../styles/motion.css';

import { ClientRouter } from 'astro:transitions';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = 'Mihir Mohite — applied ML engineer. RAG systems, agentic pipelines, the occasional rover.',
  ogImage = '/og-default.png',
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={new URL(ogImage, Astro.site).toString()} />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Pre-paint mode init: applies stored override or falls back to system pref. -->
  <script is:inline>
    (function () {
      try {
        var stored = localStorage.getItem('mm-theme');
        if (stored === 'light' || stored === 'dark') {
          document.documentElement.setAttribute('data-theme', stored);
        }
      } catch (_) {}
    })();
  </script>

  <ClientRouter />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/layouts/Base.astro
git commit -m "feat(layout): Base.astro — fonts, tokens, mode-init, View Transitions"
```

---

### Task 13: `Frame` component

**Files:**
- Create: `src/components/Frame.astro`
- Create: `src/components/DrawingCorner.astro`

- [ ] **Step 1: Create `src/components/DrawingCorner.astro`**

```astro
---
interface Props {
  pos: 'tl' | 'tr' | 'bl' | 'br';
  text: string;
}
const { pos, text } = Astro.props;
---
<span class={`corner ${pos}`}>{text}</span>
```

- [ ] **Step 2: Create `src/components/Frame.astro`**

```astro
---
import DrawingCorner from './DrawingCorner.astro';

interface Props {
  rev?: string;
  drawing?: string;       // e.g. "00 / 06"
  domain?: string;
  context?: string;       // e.g. "PUNE, IN" or "BEYONDBOT — IN-PROGRESS"
}

const today = new Date();
const defaultRev = `REV ${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`;

const {
  rev = defaultRev,
  drawing = '00 / 06',
  domain = 'MIHIRMOHITE.IN',
  context = 'PUNE, IN',
} = Astro.props;
---
<section class="frame">
  <DrawingCorner pos="tl" text={rev} />
  <DrawingCorner pos="tr" text={`DRAWING  ${drawing}`} />
  <DrawingCorner pos="bl" text={domain} />
  <DrawingCorner pos="br" text={context} />
  <slot />
</section>
```

- [ ] **Step 3: Commit**

Run:
```
git add src/components/Frame.astro src/components/DrawingCorner.astro
git commit -m "feat(components): Frame + DrawingCorner with auto REV from build date"
```

---

### Task 14: `SectionLabel` component

**Files:**
- Create: `src/components/SectionLabel.astro`

- [ ] **Step 1: Create `src/components/SectionLabel.astro`**

```astro
---
interface Props {
  num: string;       // "00"
  name: string;      // "NOW"
  draw?: boolean;    // wire fade-in via observer
}
const { num, name, draw = false } = Astro.props;
const cls = draw ? 'section-label draw' : 'section-label';
---
<div class={cls} data-observe={draw ? 'fade' : undefined}>
  <span class="num">{num}</span>{name}
</div>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/components/SectionLabel.astro
git commit -m "feat(components): SectionLabel"
```

---

### Task 15: `SpecGrid` + `SpecCell`

**Files:**
- Create: `src/components/SpecGrid.astro`
- Create: `src/components/SpecCell.astro`

- [ ] **Step 1: Create `src/components/SpecCell.astro`**

```astro
---
interface Props {
  k: string;   // "Role"
}
const { k } = Astro.props;
---
<div class="cell">
  <div class="k">{k}</div>
  <div class="v"><slot /></div>
</div>
```

- [ ] **Step 2: Create `src/components/SpecGrid.astro`**

```astro
---
interface Props {
  cols?: number;
}
const { cols = 4 } = Astro.props;
const styleAttr = cols !== 4 ? `grid-template-columns: repeat(${cols}, 1fr)` : undefined;
---
<div class="specs" style={styleAttr}>
  <slot />
</div>
```

- [ ] **Step 3: Commit**

Run:
```
git add src/components/SpecGrid.astro src/components/SpecCell.astro
git commit -m "feat(components): SpecGrid + SpecCell"
```

---

### Task 16: `EntryRow`

**Files:**
- Create: `src/components/EntryRow.astro`

- [ ] **Step 1: Create `src/components/EntryRow.astro`**

```astro
---
interface Props {
  when: string;
  title: string;
  org?: string;
  href?: string;     // if absent, no "read →" arrow
  readLabel?: string;
}
const { when, title, org, href, readLabel = 'read' } = Astro.props;
const Wrap = href ? 'a' : 'div';
---
<Wrap class="entry" href={href}>
  <div class="when">{when}</div>
  <div class="what">
    <h3>{title}</h3>
    {org && <div class="org">{org}</div>}
    <p><slot /></p>
  </div>
  {href ? (
    <div class="read">{readLabel} <span class="arrow">→</span></div>
  ) : (
    <div class="read" aria-hidden="true">&nbsp;</div>
  )}
</Wrap>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/components/EntryRow.astro
git commit -m "feat(components): EntryRow with hover-arrow"
```

---

### Task 17: `Hairline`, `TerminalCursor`, `Pipeline`

**Files:**
- Create: `src/components/Hairline.astro`
- Create: `src/components/TerminalCursor.astro`
- Create: `src/components/Pipeline.astro`

- [ ] **Step 1: Create `src/components/Hairline.astro`**

```astro
---
interface Props {
  draw?: boolean;
}
const { draw = false } = Astro.props;
const cls = draw ? 'hairline draw' : 'hairline';
---
<hr class={cls} data-observe={draw ? 'hairline' : undefined} />
```

- [ ] **Step 2: Create `src/components/TerminalCursor.astro`**

```astro
---
---
<span class="caret" aria-hidden="true"></span>
```

- [ ] **Step 3: Create `src/components/Pipeline.astro`**

```astro
---
interface Props {
  steps: string[];
}
const { steps } = Astro.props;
---
<div class="pipeline">
  {steps.map((s, i) => (
    <span>
      {s}
      {i < steps.length - 1 && <span class="arrow">→</span>}
    </span>
  ))}
</div>
```

- [ ] **Step 4: Commit**

Run:
```
git add src/components/Hairline.astro src/components/TerminalCursor.astro src/components/Pipeline.astro
git commit -m "feat(components): Hairline, TerminalCursor, Pipeline"
```

---

### Task 18: Inline icon SVGs

**Files:**
- Create: `src/components/icons/GithubIcon.astro`
- Create: `src/components/icons/LinkedinIcon.astro`
- Create: `src/components/icons/EnvelopeIcon.astro`
- Create: `src/components/icons/ExternalIcon.astro`

- [ ] **Step 1: Create `src/components/icons/GithubIcon.astro`**

```astro
---
interface Props { size?: number; }
const { size = 18 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/>
</svg>
```

- [ ] **Step 2: Create `src/components/icons/LinkedinIcon.astro`**

```astro
---
interface Props { size?: number; }
const { size = 18 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.78C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.78 24h20.44C23.21 24 24 23.22 24 22.27V1.73C24 .77 23.21 0 22.22 0z"/>
</svg>
```

- [ ] **Step 3: Create `src/components/icons/EnvelopeIcon.astro`**

```astro
---
interface Props { size?: number; }
const { size = 18 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
  <rect x="3" y="5" width="18" height="14" rx="1"/>
  <path d="M3 7l9 7 9-7"/>
</svg>
```

- [ ] **Step 4: Create `src/components/icons/ExternalIcon.astro`**

```astro
---
interface Props { size?: number; }
const { size = 14 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
  <path d="M14 4h6v6"/>
  <path d="M20 4l-9 9"/>
  <path d="M20 14v6H4V4h6"/>
</svg>
```

- [ ] **Step 5: Commit**

Run:
```
git add src/components/icons/
git commit -m "feat(components): inline svg icons (github, linkedin, envelope, external)"
```

---

### Task 19: `Nav` component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Add nav styles to `src/styles/primitives.css`**

Append to `src/styles/primitives.css`:
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  padding-top: 0.25rem;
}
.nav .right span, .nav .right a { margin-left: 0.85rem; }
.nav .right a:hover, .nav .right span.cur { color: var(--accent); }
.nav .right span.cur { border-bottom: 1px solid var(--accent); padding-bottom: 1px; }
@media (max-width: 720px) {
  .nav .right { display: none; }
}
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
const items = [
  { num: '00', name: 'NOW',         href: '/#now' },
  { num: '01', name: 'WORK',        href: '/#work' },
  { num: '02', name: 'PROJECTS',    href: '/#projects' },
  { num: '03', name: 'LEADERSHIP',  href: '/#leadership' },
  { num: '04', name: 'EDUCATION',   href: '/#education' },
  { num: '05', name: 'SKILLS',      href: '/#skills' },
  { num: '06', name: 'CONTACT',     href: '/#contact' },
];

interface Props { current?: string; }   // section name (e.g. "NOW") to mark
const { current } = Astro.props;
---
<div class="nav">
  <span>MIHIR MOHITE — INDEX</span>
  <div class="right">
    {items.map((item) => (
      current === item.name
        ? <span class="cur">{item.num} {item.name}</span>
        : <a href={item.href}>{item.num} {item.name}</a>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Commit**

Run:
```
git add src/styles/primitives.css src/components/Nav.astro
git commit -m "feat(components): Nav with mono index links"
```

---

### Task 20: `ModeToggle` component (with logic test)

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/lib/theme.test.ts`
- Create: `src/components/ModeToggle.astro`
- Modify: `src/styles/primitives.css`

- [ ] **Step 1: Write the failing test**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/src/lib/theme.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveStored, computeNext, applyTheme, STORE_KEY } from './theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('resolveStored returns null when nothing is stored', () => {
    expect(resolveStored()).toBeNull();
  });

  it('resolveStored returns "light" when stored', () => {
    localStorage.setItem(STORE_KEY, 'light');
    expect(resolveStored()).toBe('light');
  });

  it('resolveStored ignores garbage values', () => {
    localStorage.setItem(STORE_KEY, 'kanagaroo');
    expect(resolveStored()).toBeNull();
  });

  it('computeNext cycles system → light → dark → system', () => {
    expect(computeNext('system')).toBe('light');
    expect(computeNext('light')).toBe('dark');
    expect(computeNext('dark')).toBe('system');
  });

  it('applyTheme(system) clears the attribute and storage', () => {
    localStorage.setItem(STORE_KEY, 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    applyTheme('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('applyTheme(light) writes attribute + storage', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(STORE_KEY)).toBe('light');
  });
});
```

Also create `vitest.config.ts` at repo root:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'jsdom' },
});
```

Install jsdom:
```
npm install -D jsdom
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: FAIL with "Cannot find module './theme'" (or similar — module doesn't exist yet).

- [ ] **Step 3: Create `src/lib/theme.ts`**

```ts
export type Theme = 'system' | 'light' | 'dark';
export const STORE_KEY = 'mm-theme';

export function resolveStored(): Theme | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw === 'light' || raw === 'dark' ? raw : null;
  } catch {
    return null;
  }
}

export function computeNext(current: Theme): Theme {
  if (current === 'system') return 'light';
  if (current === 'light') return 'dark';
  return 'system';
}

export function applyTheme(t: Theme): void {
  const root = document.documentElement;
  if (t === 'system') {
    root.removeAttribute('data-theme');
    try { localStorage.removeItem(STORE_KEY); } catch {}
    return;
  }
  root.setAttribute('data-theme', t);
  try { localStorage.setItem(STORE_KEY, t); } catch {}
}

export function currentTheme(): Theme {
  const a = document.documentElement.getAttribute('data-theme');
  if (a === 'light' || a === 'dark') return a;
  return 'system';
}

/** Wrap a callback in startViewTransition if available, else call directly. */
export function withViewTransition(cb: () => void): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(cb);
  } else {
    cb();
  }
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npx vitest run src/lib/theme.test.ts`
Expected: 6 tests pass.

- [ ] **Step 5: Add toggle styles**

Append to `src/styles/primitives.css`:
```css
.mode-toggle {
  display: inline-flex;
  gap: 0;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--mid);
  margin-top: var(--sp-3);
}
.mode-toggle .label { margin-right: 0.55rem; }
.mode-toggle button {
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--rule);
  color: var(--mid);
  background: transparent;
  border-radius: 0;
}
.mode-toggle button + button { border-left: 0; }
.mode-toggle button[aria-pressed='true'] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
```

- [ ] **Step 6: Create `src/components/ModeToggle.astro`**

```astro
---
---
<div class="mode-toggle" data-mode-toggle>
  <span class="label">mode</span>
  <button type="button" data-mode="system" aria-pressed="true">System</button>
  <button type="button" data-mode="light" aria-pressed="false">Light</button>
  <button type="button" data-mode="dark" aria-pressed="false">Dark</button>
</div>

<script>
  import { applyTheme, currentTheme, withViewTransition } from '../lib/theme';

  function syncButtons(root: HTMLElement) {
    const t = currentTheme();
    root.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.mode === t));
    });
  }

  function init(root: HTMLElement) {
    syncButtons(root);
    root.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>('button[data-mode]');
      if (!btn) return;
      const t = btn.dataset.mode as 'system' | 'light' | 'dark';
      withViewTransition(() => {
        applyTheme(t);
        syncButtons(root);
      });
    });
  }

  document.querySelectorAll<HTMLElement>('[data-mode-toggle]').forEach(init);
  document.addEventListener('astro:page-load', () => {
    document.querySelectorAll<HTMLElement>('[data-mode-toggle]').forEach(init);
  });
</script>
```

- [ ] **Step 7: Commit**

Run:
```
git add vitest.config.ts package.json package-lock.json src/lib/theme.ts src/lib/theme.test.ts src/components/ModeToggle.astro src/styles/primitives.css
git commit -m "feat(theme): tested theme module + ModeToggle with View Transitions"
```

---

### Task 21: Hairline draw-on-scroll observer

**Files:**
- Create: `src/scripts/observe.ts`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/scripts/observe.ts`**

```ts
type Mode = 'hairline' | 'fade';

function onIntersect(el: Element, mode: Mode) {
  el.classList.add('is-in');
}

export function start(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('[data-observe]').forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const mode = (e.target as HTMLElement).dataset.observe as Mode | undefined;
        if (!mode) continue;
        onIntersect(e.target, mode);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll<HTMLElement>('[data-observe]').forEach((el) => io.observe(el));
}
```

- [ ] **Step 2: Wire it into `Base.astro`**

Modify `src/layouts/Base.astro` — add inside `<body>`, after `<slot />`, before `</body>`:
```astro
<script>
  import { start } from '../scripts/observe';
  start();
  document.addEventListener('astro:page-load', start);
</script>
```

- [ ] **Step 3: Commit**

Run:
```
git add src/scripts/observe.ts src/layouts/Base.astro
git commit -m "feat(motion): hairline + label draw-in via IntersectionObserver"
```

---

### Task 22: Visual smoke-test the design system

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace scaffold index with a design-system smoke page**

Overwrite `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Frame from '../components/Frame.astro';
import Nav from '../components/Nav.astro';
import SectionLabel from '../components/SectionLabel.astro';
import SpecGrid from '../components/SpecGrid.astro';
import SpecCell from '../components/SpecCell.astro';
import Hairline from '../components/Hairline.astro';
import EntryRow from '../components/EntryRow.astro';
import TerminalCursor from '../components/TerminalCursor.astro';
import Pipeline from '../components/Pipeline.astro';
import ModeToggle from '../components/ModeToggle.astro';
---
<Base title="design system smoke" description="dev only">
  <Frame drawing="00 / 06" context="PUNE, IN">
    <Nav current="NOW" />
    <SectionLabel num="00" name="NOW" draw />
    <h1 class="display">Mihir Mohite.</h1>
    <p class="role">applied ml engineer · b.tech ai/ml @ mit-wpu · president, codec<TerminalCursor /></p>
    <SpecGrid>
      <SpecCell k="Role">ML Intern · <b>BeyondBot</b></SpecCell>
      <SpecCell k="Working langs">Python · C++</SpecCell>
      <SpecCell k="RAGAS Δ"><b>+0.26</b> hybrid v naive</SpecCell>
      <SpecCell k="Corpus">1,210 pp · IN law</SpecCell>
    </SpecGrid>
    <p class="body-text" style="margin-top: 1.25rem">
      Building a <b>legal-compliance RAG</b> system at BeyondBot over a 1,210-page corpus
      of Indian industrial, manufacturing and environmental law. Benchmarked five retrieval
      modes on a 315-query <code>RAGAS</code> harness — hybrid retrieval reached <b>0.77</b>
      against <b>0.51</b> for the naive baseline.
    </p>
    <Pipeline steps={['mistral ocr','regex router','lightrag (kg + vector)','agno · gemini 3 flash','fastapi sse']} />
    <Hairline draw />
    <EntryRow when="2025.10 — now" title="Machine Learning Intern" org="BeyondBot Technology Pvt. Ltd. · Pune" href="/work/beyondbot">
      Designed legal-compliance RAG over 1,210pp Indian-law corpus. RAGAS harness across 5 modes on 315 queries — hybrid <b>0.77 vs 0.51</b> naive. Built a custom OpenCV visual chunker.
    </EntryRow>
    <ModeToggle />
  </Frame>
</Base>
```

- [ ] **Step 2: Run dev server**

Run: `npm run dev` (in a background terminal — use `run_in_background: true` if you have it, else open another terminal).
Expected: server starts on `http://localhost:4321/`. No errors in console.

- [ ] **Step 3: Visual checks**

Open `http://localhost:4321/` and verify each:
- Cream background (`#f6f2e6` light) or near-black (`#0c0c0e`) depending on system pref.
- 4 drawing-corner annotations in amber, mono.
- Top + bottom hairline rules visible inside the frame.
- Dot-grid background visible.
- Big sans name `Mihir Mohite.`.
- Mono role line below with a blinking amber caret at the end.
- 4-cell spec grid with mono labels in muted, mono values, accent on `+0.26` and `BeyondBot`.
- Body paragraph in sans, `RAGAS` rendered as inline code with amber-on-cream background.
- Pipeline line in mono with amber `→` between steps.
- One entry row with hairline divider top.
- Mode toggle: clicking each button switches theme without flicker.
- Refresh: chosen theme persists.
- Resize to 600px wide: grid drops to 2 cols, entry row collapses to single column.

If any check fails, fix and re-run before continuing.

- [ ] **Step 4: Stop dev server, commit**

Stop the dev server (Ctrl-C or kill the background process).

Run:
```
git add src/pages/index.astro
git commit -m "feat(home): design-system smoke page wiring all primitives"
```

---

## Phase 2 — Home page content (Tasks 23–29)

### Task 23: Content data file

**Files:**
- Create: `src/content/site.ts`

- [ ] **Step 1: Create `src/content/site.ts`**

This file is the single source of truth for the home page content. All entries are resume-honest copy; do not edit values without checking the resume.

```ts
export const profile = {
  name: 'Mihir Mohite',
  role: 'applied ml engineer · b.tech ai/ml @ mit-wpu · president, codec',
  email: 'mihir.moe@gmail.com',
  location: 'Pune, Maharashtra, India',
  github: 'https://github.com/lawn-mimower',
  linkedin: 'https://www.linkedin.com/in/mihir-mohite/',
  domain: 'mihirmohite.in',
};

export const nowSpecs = [
  { k: 'Role', v: 'ML Intern · <b>BeyondBot</b>' },
  { k: 'Working langs', v: 'Python · C++' },
  { k: 'RAGAS Δ', v: '<b>+0.26</b> hybrid v naive' },
  { k: 'Corpus', v: '1,210 pp · IN law' },
];

export const nowParagraph = `Building a <b>legal-compliance RAG</b> system at BeyondBot over a 1,210-page corpus of Indian industrial, manufacturing and environmental law. Benchmarked five retrieval modes on a 315-query <code>RAGAS</code> harness — hybrid retrieval reached <b>0.77</b> against <b>0.51</b> for the naive baseline.`;

export const nowPipeline = [
  'mistral ocr',
  'regex router',
  'lightrag (kg + vector)',
  'agno · gemini 3 flash',
  'fastapi sse',
];

export const recognitions = `recognitions · <b>sih r2 ′24</b> · <b>circuit heist runner-up ′24</b> · dataquest finalist · hackmitwpu finalist`;

export const work = [
  {
    when: '2025.10 — now',
    title: 'Machine Learning Intern',
    org: 'BeyondBot Technology Pvt. Ltd. · Pune',
    lede: 'Designed legal-compliance RAG over a 1,210pp Indian-law corpus. RAGAS harness across 5 retrieval modes on 315 queries — hybrid <b>0.77 vs 0.51</b> naive. Built a custom OpenCV visual chunker.',
    href: '/work/beyondbot',
  },
  {
    when: '2025.06 — 2025.10',
    title: 'Software Intern',
    org: 'Heera Software Pvt. Ltd. · Pune',
    lede: 'Address-validation scoring service combining the Google Maps API, fuzzy matching, and reverse-geocoded cosine similarity. Processed <b>~13,500 records</b>.',
    href: '/work/heera',
  },
];

export const projects = [
  {
    when: 'pilot · 2026',
    title: 'ForeSites — Construction Site Management',
    org: '3-person team · pilot with a Pune real-estate developer',
    lede: 'AWS Lambda agent (Gemini) doing streaming NL-to-SQL over a 9-table Postgres schema, with per-session memory. WhatsApp ingest service (Node + S3, Supabase-backed) for snag reports via text, voice and image.',
    href: '/projects/foresites',
  },
  {
    when: '2025',
    title: 'AgroSense — Precision Agriculture (PBL4, MIT-WPU)',
    org: 'team',
    lede: 'UAV photogrammetry pipeline (RGB → orthomosaic → ExG/VARI vegetation indices → K-means zoning) fused with an ESP32 ground module (Modbus soil sensor, GPS waypoint guidance, on-device ML for NPK estimation). Firebase + Vercel dashboard with a multilingual AI assistant.',
    href: '/projects/agrosense',
  },
  {
    when: '2025',
    title: 'EKG — query-driven Neo4j mini-graphs',
    org: 'solo',
    lede: 'Demo ingesting SQL / JSON / TXT into query-driven Neo4j mini-graphs with a Gemini NL-query interface.',
    href: '/projects/ekg',
  },
];

export const earlier = [
  { year: '2024', title: 'scout rover for hazardous environments',
    blurb: 'matlab + lidar slam, mq5 / dht / ultrasonic sensors' },
  { year: '2024', title: 'electric load forecasting (delhi)',
    blurb: 'mlp · keras' },
  { year: '2024', title: 'ldr-based solar tracker',
    blurb: 'arduino + servos' },
  { year: '2024', title: 'sos tracker (lora 433mhz)',
    blurb: 'embedded' },
  { year: '2024', title: 'lidar fan-speed detector',
    blurb: 'matlab fft' },
];

export const leadership = [
  {
    when: '2025.10 — now',
    title: 'President',
    org: 'CoDeC · MIT-WPU',
    lede: 'Organized end-to-end execution of <b>Trifecta Challenge 2026</b> — three-day flagship symposium across Full-Stack, ML, and Competitive Programming tracks. <b>87 registered teams</b> from MIT-WPU and external engineering colleges, partner network including GeeksforGeeks, HackerRank and AlgoZenith, ₹1,50,000 prize pool.',
    href: '/leadership/trifecta-2026',
  },
  {
    when: '2025.01 — now',
    title: 'ML Projects Division Lead',
    org: 'CoDeC · MIT-WPU',
    lede: 'Drive AI/ML project initiatives and run knowledge-sharing sessions for the club.',
    href: undefined as string | undefined,
  },
];

export const education = {
  when: '2023 — 2027 (exp.)',
  title: 'MIT World Peace University, Pune',
  org: 'B.Tech ECE w/ Specialization in AI & ML',
  lede: 'CGPA <b>8.56 / 10.00</b>',
};

export const skills: Array<{ k: string; v: string[] }> = [
  { k: 'Languages',         v: ['C++', 'Python', 'JavaScript', 'SQL'] },
  { k: 'CS Fundamentals',   v: ['Data Structures', 'Algorithms', 'OOD', 'Complexity', 'Problem Solving'] },
  { k: 'Retrieval / RAG',   v: ['RAG', 'GraphRAG', 'LightRAG', 'RAGAS-style eval', 'Sentence Transformers', 'BGE'] },
  { k: 'Vector DBs',        v: ['Pinecone', 'Milvus'] },
  { k: 'LLM Platforms',     v: ['Vertex AI', 'Gemini API', 'Agno'] },
  { k: 'ML / Vision',       v: ['PyTorch', 'TensorFlow', 'Keras', 'CNN', 'Transformers', 'OpenCV', 'OCR', 'IBM Docling', 'Mistral OCR'] },
  { k: 'Backend & Cloud',   v: ['AWS (Lambda · S3 · EC2)', 'GCP (Vertex AI)', 'Node.js / Express', 'FastAPI', 'REST', 'SSE', 'serverless'] },
  { k: 'Databases',         v: ['PostgreSQL (Supabase)', 'MySQL', 'SQLite', 'Neo4j'] },
  { k: 'Tools & Hardware',  v: ['Git', 'MATLAB', 'WhatsApp Business API', 'Meta API', 'Arduino', 'ESP32', 'Raspberry Pi', 'LiDAR'] },
];
```

- [ ] **Step 2: Commit**

Run:
```
git add src/content/site.ts
git commit -m "feat(content): site data — profile, work, projects, earlier, leadership, skills"
```

---

### Task 24: Replace smoke index with the real `00 NOW` block

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Frame from '../components/Frame.astro';
import Nav from '../components/Nav.astro';
import SectionLabel from '../components/SectionLabel.astro';
import SpecGrid from '../components/SpecGrid.astro';
import SpecCell from '../components/SpecCell.astro';
import Hairline from '../components/Hairline.astro';
import TerminalCursor from '../components/TerminalCursor.astro';
import Pipeline from '../components/Pipeline.astro';
import {
  profile, nowSpecs, nowParagraph, nowPipeline, recognitions,
} from '../content/site';
---
<Base title={`${profile.name} — applied ml engineer`}>
  <Frame drawing="00 / 06">
    <Nav current="NOW" />

    <section id="now">
      <SectionLabel num="00" name="NOW" draw />
      <h1 class="display">{profile.name}.</h1>
      <p class="role">{profile.role}<TerminalCursor /></p>

      <SpecGrid>
        {nowSpecs.map((s) => (
          <SpecCell k={s.k}><span set:html={s.v} /></SpecCell>
        ))}
      </SpecGrid>

      <p class="body-text" style="margin-top: 1.25rem" set:html={nowParagraph} />

      <Pipeline steps={nowPipeline} />

      <Hairline draw />
      <p class="recog" set:html={recognitions} />
    </section>
  </Frame>
</Base>
```

- [ ] **Step 2: Visual check**

Run dev server (`npm run dev`), open `http://localhost:4321/`, verify:
- All 4 corners render with today's REV month.
- `00 NOW` label fades in (or appears immediately if `prefers-reduced-motion`).
- Spec grid shows 4 cells with the right values.
- Pipeline shows 5 steps with amber arrows.
- Recognitions one-liner shows under the hairline.

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/index.astro
git commit -m "feat(home): 00 NOW section wired to content data"
```

---

### Task 25: `01 WORK` section

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Append the work section inside the existing `<Frame>`**

In `src/pages/index.astro`, add the import for `EntryRow` and `work`, then append a new `<section id="work">` block immediately after the `</section>` that closes `#now`:

```astro
import EntryRow from '../components/EntryRow.astro';
import { profile, nowSpecs, nowParagraph, nowPipeline, recognitions, work } from '../content/site';
```

```astro
<Hairline draw />
<section id="work">
  <SectionLabel num="01" name="WORK" draw />
  <h2 class="display" style="font-size: 1.6rem; margin-bottom: 0.5rem">internships</h2>
  {work.map((w) => (
    <EntryRow when={w.when} title={w.title} org={w.org} href={w.href}>
      <span set:html={w.lede} />
    </EntryRow>
  ))}
</section>
```

- [ ] **Step 2: Visual check**

Refresh `http://localhost:4321/`. Verify:
- Hairline divider between sections.
- Two entry rows with the BeyondBot + Heera content.
- Hover over either row: amber `→` slides 4px right, color stays accent.

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/index.astro
git commit -m "feat(home): 01 WORK section with internship entries"
```

---

### Task 26: `02 PROJECTS` + `02.5 EARLIER`

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/primitives.css`

- [ ] **Step 1: Add `earlier` list styles**

Append to `src/styles/primitives.css`:
```css
.earlier {
  margin-top: var(--sp-3);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink);
}
.earlier li {
  list-style: none;
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: var(--sp-3);
  padding: 0.4rem 0;
  border-top: 1px solid var(--rule);
}
.earlier li .y { color: var(--accent); }
.earlier li .blurb { color: var(--mid); }
```

- [ ] **Step 2: Append the projects section**

Add to `src/pages/index.astro` (imports + section). Update imports:
```astro
import { profile, nowSpecs, nowParagraph, nowPipeline, recognitions, work, projects, earlier } from '../content/site';
```

After the `01 WORK` section, append:
```astro
<Hairline draw />
<section id="projects">
  <SectionLabel num="02" name="PROJECTS" draw />
  <h2 class="display" style="font-size: 1.6rem; margin-bottom: 0.5rem">selected work</h2>
  {projects.map((p) => (
    <EntryRow when={p.when} title={p.title} org={p.org} href={p.href}>
      <span set:html={p.lede} />
    </EntryRow>
  ))}

  <SectionLabel num="02.5" name="EARLIER" draw />
  <ul class="earlier">
    {earlier.map((e) => (
      <li>
        <span class="y">{e.year}</span>
        <span><b>{e.title}</b> · <span class="blurb">{e.blurb}</span></span>
      </li>
    ))}
  </ul>
</section>
```

- [ ] **Step 3: Visual check**

Refresh. Verify:
- Three project entries with case-study links.
- `02.5 EARLIER` sub-label.
- Earlier list as 5 mono rows with year in accent.

- [ ] **Step 4: Commit**

Run:
```
git add src/pages/index.astro src/styles/primitives.css
git commit -m "feat(home): 02 PROJECTS + 02.5 EARLIER sections"
```

---

### Task 27: `03 LEADERSHIP` + `04 EDUCATION`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Append leadership and education**

Update imports:
```astro
import { profile, nowSpecs, nowParagraph, nowPipeline, recognitions, work, projects, earlier, leadership, education } from '../content/site';
```

After the projects section, append:
```astro
<Hairline draw />
<section id="leadership">
  <SectionLabel num="03" name="LEADERSHIP" draw />
  <h2 class="display" style="font-size: 1.6rem; margin-bottom: 0.5rem">codec</h2>
  {leadership.map((l) => (
    <EntryRow when={l.when} title={l.title} org={l.org} href={l.href}>
      <span set:html={l.lede} />
    </EntryRow>
  ))}
</section>

<Hairline draw />
<section id="education">
  <SectionLabel num="04" name="EDUCATION" draw />
  <EntryRow when={education.when} title={education.title} org={education.org}>
    <span set:html={education.lede} />
  </EntryRow>
</section>
```

- [ ] **Step 2: Visual check**

Refresh. Verify Trifecta entry has working link, ML Lead row has no `read →` (no href), education row shows a single entry with CGPA in accent.

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/index.astro
git commit -m "feat(home): 03 LEADERSHIP + 04 EDUCATION sections"
```

---

### Task 28: `05 SKILLS`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Append skills section**

Update imports:
```astro
import { profile, nowSpecs, nowParagraph, nowPipeline, recognitions, work, projects, earlier, leadership, education, skills } from '../content/site';
```

After education, append:
```astro
<Hairline draw />
<section id="skills">
  <SectionLabel num="05" name="SKILLS" draw />
  {skills.map((g) => (
    <div class="skills-group">
      <div class="k">{g.k}</div>
      <div class="v">{g.v.map((s) => <span>{s}</span>)}</div>
    </div>
  ))}
</section>
```

- [ ] **Step 2: Visual check**

Refresh. Verify each skill group has its mono accent label and the items separated by `·`. Test that long lines wrap cleanly on a 600px viewport.

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/index.astro
git commit -m "feat(home): 05 SKILLS section"
```

---

### Task 29: `06 CONTACT` with form + ModeToggle

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Append contact section**

Update imports to add ModeToggle and icons:
```astro
import ModeToggle from '../components/ModeToggle.astro';
import GithubIcon from '../components/icons/GithubIcon.astro';
import LinkedinIcon from '../components/icons/LinkedinIcon.astro';
import EnvelopeIcon from '../components/icons/EnvelopeIcon.astro';
```

After skills, append:
```astro
<Hairline draw />
<section id="contact">
  <SectionLabel num="06" name="CONTACT" draw />
  <p class="body-text">Open to internships, research collaborations, and conversations about retrieval systems. Email is fastest.</p>

  <ul class="contact-list">
    <li><a href={`mailto:${profile.email}`}><EnvelopeIcon /> {profile.email}</a></li>
    <li><a href={profile.github} target="_blank" rel="noopener"><GithubIcon /> github.com/lawn-mimower</a></li>
    <li><a href={profile.linkedin} target="_blank" rel="noopener"><LinkedinIcon /> linkedin.com/in/mihir-mohite</a></li>
  </ul>

  <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" class="form">
    <input type="hidden" name="form-name" value="contact" />
    <p class="hp"><label>Don’t fill this out: <input name="bot-field" /></label></p>
    <div><label for="name">name</label><input id="name" name="name" type="text" required /></div>
    <div><label for="email">email</label><input id="email" name="email" type="email" required /></div>
    <div><label for="subject">subject</label><input id="subject" name="subject" type="text" required /></div>
    <div><label for="message">message</label><textarea id="message" name="message" rows="5" required /></div>
    <button type="submit">Send →</button>
  </form>

  <ModeToggle />
</section>
```

Add to `src/styles/primitives.css`:
```css
.contact-list {
  list-style: none;
  margin-top: var(--sp-3);
  display: grid;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.contact-list a { display: inline-flex; align-items: center; gap: 0.6rem; color: var(--ink); }
.contact-list a:hover { color: var(--accent); }
```

- [ ] **Step 2: Visual check**

Refresh. Verify:
- Mailto link, GitHub link, LinkedIn link with inline SVG icons.
- Form renders all four fields + Submit button.
- Mode toggle at the bottom of contact, three buttons; clicking each cross-fades the page (View Transitions API).

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/index.astro src/styles/primitives.css
git commit -m "feat(home): 06 CONTACT — form, links, mode toggle"
```

---

## Phase 3 — Case-study shells + pages (Tasks 30–41)

### Task 30: Writeup-stub page

**Files:**
- Create: `src/components/WriteupStub.astro`

- [ ] **Step 1: Create `src/components/WriteupStub.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Frame from './Frame.astro';
import Nav from './Nav.astro';

interface Props {
  title: string;
  drawing?: string;
}
const { title, drawing = '00 / 06' } = Astro.props;
---
<Base title={`${title} — writeup in progress`}>
  <Frame drawing={drawing} context="WRITEUP IN PROGRESS">
    <Nav />
    <h1 class="display" style="margin-top: 2.5rem">{title}.</h1>
    <p class="role">writeup in progress · rev 2026.05</p>
    <p class="body-text" style="margin-top: 1.5rem">
      A full case study lives here once the section is finished. In the meantime,
      see <a href="/" style="color: var(--accent)">the home page</a> for the short version,
      or email <a href="mailto:mihir.moe@gmail.com" style="color: var(--accent)">mihir.moe@gmail.com</a>.
    </p>
  </Frame>
</Base>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/components/WriteupStub.astro
git commit -m "feat(case-study): WriteupStub for in-progress pages"
```

---

### Task 31: CaseStudy layout + TLDR + shell

**Files:**
- Create: `src/components/case-study/TLDR.astro`
- Create: `src/components/case-study/CaseStudyShell.astro`
- Create: `src/layouts/CaseStudy.astro`
- Modify: `src/styles/primitives.css`

- [ ] **Step 1: Create `src/components/case-study/TLDR.astro`**

```astro
---
import SpecGrid from '../SpecGrid.astro';
import SpecCell from '../SpecCell.astro';

interface Props {
  cells: Array<{ k: string; v: string }>;
}
const { cells } = Astro.props;
---
<SpecGrid>
  {cells.map((c) => <SpecCell k={c.k}><span set:html={c.v} /></SpecCell>)}
</SpecGrid>
```

- [ ] **Step 2: Add case-study type styles**

Append to `src/styles/primitives.css`:
```css
.case-body { max-width: 70ch; }
.case-body h2 {
  font-family: var(--font-sans); font-weight: 500; font-size: 1.25rem;
  margin: var(--sp-6) 0 var(--sp-2);
}
.case-body h3 {
  font-family: var(--font-sans); font-weight: 500; font-size: 1.05rem;
  margin: var(--sp-5) 0 var(--sp-2);
}
.case-body p { font-family: var(--font-sans); font-size: var(--fs-body); line-height: var(--lh-body); margin: 0 0 var(--sp-3); }
.case-body p b { font-weight: 500; }
.case-body code { font-family: var(--font-mono); font-size: 0.85em; color: var(--accent); background: var(--code-bg); padding: 1px 5px; border-radius: 2px; }
.case-body pre {
  font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;
  background: var(--code-bg); border: 1px solid var(--rule); padding: var(--sp-3); overflow-x: auto;
  margin: var(--sp-3) 0;
}
.case-body pre code { background: transparent; padding: 0; color: var(--ink); }
.case-body ul, .case-body ol { padding-left: 1.25rem; margin: 0 0 var(--sp-3); }
.case-body li { margin-bottom: 0.4rem; }
.case-body table { border-collapse: collapse; font-family: var(--font-mono); font-size: 0.8rem; margin: var(--sp-3) 0; }
.case-body th, .case-body td { border: 1px solid var(--rule); padding: 0.35rem 0.6rem; text-align: left; }
.case-body th { color: var(--accent); font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.7rem; }
.back-link { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--mid); }
.back-link:hover { color: var(--accent); }
```

- [ ] **Step 3: Create `src/components/case-study/CaseStudyShell.astro`**

```astro
---
import Frame from '../Frame.astro';
import Nav from '../Nav.astro';
import SectionLabel from '../SectionLabel.astro';
import TLDR from './TLDR.astro';
import Hairline from '../Hairline.astro';

interface Props {
  num: string;
  section: string;       // e.g. "WORK"
  drawing: string;       // "01 / 02"
  context: string;       // "BEYONDBOT — IN-PROGRESS"
  title: string;
  role?: string;
  tldr: Array<{ k: string; v: string }>;
  backHref?: string;
  backLabel?: string;
}
const {
  num, section, drawing, context, title, role,
  tldr, backHref = '/', backLabel = '← back to index',
} = Astro.props;
---
<Frame drawing={drawing} context={context}>
  <Nav current={section} />
  <a href={backHref} class="back-link">{backLabel}</a>
  <SectionLabel num={num} name={section} />
  <h1 class="display">{title}.</h1>
  {role && <p class="role">{role}</p>}
  <TLDR cells={tldr} />
  <Hairline />
  <article class="case-body">
    <slot />
  </article>
</Frame>
```

- [ ] **Step 4: Create `src/layouts/CaseStudy.astro`**

```astro
---
import Base from './Base.astro';
import CaseStudyShell from '../components/case-study/CaseStudyShell.astro';

interface Props {
  title: string;
  description?: string;
  num: string;
  section: string;
  drawing: string;
  context: string;
  pageTitle: string;
  role?: string;
  tldr: Array<{ k: string; v: string }>;
}
const { title, description, ...shell } = Astro.props;
---
<Base title={title} description={description}>
  <CaseStudyShell
    num={shell.num}
    section={shell.section}
    drawing={shell.drawing}
    context={shell.context}
    title={shell.pageTitle}
    role={shell.role}
    tldr={shell.tldr}
  >
    <slot />
  </CaseStudyShell>
</Base>
```

- [ ] **Step 5: Commit**

Run:
```
git add src/components/case-study/ src/layouts/CaseStudy.astro src/styles/primitives.css
git commit -m "feat(case-study): layout + shell + TLDR + body styles"
```

---

### Task 32: `/work/beyondbot` case study

**Files:**
- Create: `src/pages/work/beyondbot.mdx`

- [ ] **Step 1: Create `src/pages/work/beyondbot.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "BeyondBot — Legal-compliance RAG"
description: "RAG over a 1,210-page Indian-law corpus. Hybrid retrieval reached 0.77 RAGAS vs 0.51 naive."
num: "01"
section: "WORK"
drawing: "01 / 02"
context: "BEYONDBOT — IN-PROGRESS"
pageTitle: "BeyondBot"
role: "machine learning intern · oct 2025 — present · pune"
tldr:
  - { k: "Corpus",          v: "1,210 pp · IN industrial / mfg / env law" }
  - { k: "Pipeline stages", v: "5 (ocr → router → retrieval → agent → api)" }
  - { k: "Eval queries",    v: "315" }
  - { k: "RAGAS Δ",         v: "<b>+0.26</b> hybrid vs naive" }
---

## Problem

The platform team needed an on-site question-answering layer over a 1,210-page corpus of Indian industrial, manufacturing and environmental law. Three constraints made naive RAG insufficient: (1) **statute structure**: legal text mixes definitions, sections, tables, and amendments, which a flat semantic index conflates; (2) **citation precision**: legal answers must cite the exact section, not paraphrase; (3) **change tracking**: amendments live in separate documents that supersede older sections.

## Pipeline

`mistral ocr` → custom regex router (definitions / sections / tables / amendments) → **LightRAG** (KG + vector) with SQLite tabular lookups and a JSON amendment index → **Agno** agent on Gemini 3 Flash with 4 tools → **FastAPI** with SSE streaming → chat UI with PDF.js viewer and citation badges.

The regex router is the load-bearing piece. It runs before retrieval and tags each chunk with a structural type, which lets the retrieval layer route — definitions hit a small, exact-match path; tables hit SQLite; amendments hit the JSON index; everything else goes to LightRAG.

## Evaluation

Built a RAGAS-style evaluation harness benchmarking five LightRAG retrieval modes across **315 queries** on a 10k-excerpt FinDER subset. Metrics: faithfulness, answer relevancy, context precision, context recall, plus retrieval latency, token count, and deployment cost.

| Mode    | RAGAS  |  Δ vs naive |
|---------|-------:|------------:|
| naive   | 0.51   |  —          |
| local   | 0.62   | +0.11       |
| global  | 0.66   | +0.15       |
| graph   | 0.71   | +0.20       |
| **hybrid** | **0.77** | **+0.26** |

Hybrid retrieval reached **0.77 RAGAS** against **0.51** for the naive baseline — a roughly 49% lift on the same harness.

## OpenCV visual chunker

Wrote a custom OpenCV visual chunker that rasterizes PDF pages and uses blob detection to extract bounding boxes for text blobs, recovering page hierarchy for downstream chunking. Pages with a clear title/body/table layout get clean structural tags; complex multi-column statute pages sometimes need a fallback to plain layout heuristics.

## Handover

The PoC was handed to platform engineers for product integration. Open work includes promoting the regex router to a learned classifier and adding an evaluator-in-the-loop loop for the amendment index.
```

- [ ] **Step 2: Visual check**

Run dev server. Visit `http://localhost:4321/work/beyondbot/`. Verify:
- TLDR has 4 cells with the right values.
- Title `BeyondBot.` rendered in display sans.
- Role line in mono.
- Markdown headings render in case-body styles.
- Code spans amber on cream.
- Table renders with mono headers in accent.
- Back link works.

- [ ] **Step 3: Commit**

Run:
```
git add src/pages/work/beyondbot.mdx
git commit -m "feat(case-study): BeyondBot writeup — pipeline, eval, opencv chunker"
```

---

### Task 33: `/work/heera` case study

**Files:**
- Create: `src/pages/work/heera.mdx`

- [ ] **Step 1: Create `src/pages/work/heera.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "Heera — Address validation"
description: "Scoring service combining Google Maps, fuzzy matching, and reverse-geocoded cosine similarity."
num: "01"
section: "WORK"
drawing: "02 / 02"
context: "HEERA — SHIPPED"
pageTitle: "Heera"
role: "software intern · jun 2025 — oct 2025 · pune"
tldr:
  - { k: "Records processed", v: "<b>~13,500</b>" }
  - { k: "Components",        v: "Google Maps · fuzzy · reverse-geo cosine" }
  - { k: "Output",             v: "score + components per record" }
  - { k: "Status",             v: "shipped to production data pipeline" }
---

## Problem

Existing internal datasets contained address strings of mixed quality — partial matches, transliteration variance, missing localities. The team needed a scoring service that validated each record and emitted a confidence score plus the component contributions, so downstream pipelines could threshold or route by confidence.

## Approach

Three signals, combined into a weighted score:

1. **Google Maps API match** — query the address; compare returned formatted address against input.
2. **Fuzzy string match** — token sort + ratio over normalized strings to catch transliteration / spacing variance.
3. **Reverse-geocoded cosine similarity** — geocode the address, reverse-geocode the resulting lat/lng, compare embeddings of the two textual addresses.

The combined score and per-component breakdown were attached to each record. Approximately **13,500** records were processed during the engagement.

## Notes

This was a scoring service, not a multi-class classifier. The previous portfolio framing of "ML-based multi-class classification" was wrong and is corrected here.
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/work/heera.mdx
git commit -m "feat(case-study): Heera address-validation writeup (corrected framing)"
```

---

### Task 34: `/projects/foresites` case study

**Files:**
- Create: `src/pages/projects/foresites.mdx`

- [ ] **Step 1: Create `src/pages/projects/foresites.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "ForeSites — Construction Site Management"
description: "3-person pilot. NL-to-SQL agent on AWS Lambda + WhatsApp ingest service for snag reports."
num: "02"
section: "PROJECTS"
drawing: "01 / 04"
context: "FORESITES — PILOT"
pageTitle: "ForeSites"
role: "team of 3 · pilot stage with a Pune real-estate developer"
tldr:
  - { k: "Team",   v: "3 · me + 2 collaborators" }
  - { k: "Status", v: "pilot · production with 1 customer" }
  - { k: "Stack",  v: "AWS Lambda · Gemini · Postgres · Node" }
  - { k: "Schema", v: "9 tables · per-session memory + ownership" }
---

## Problem

Construction site managers in India report snags (defects, delays, materials issues) over WhatsApp — text, voice notes, photos. The data never makes it into a system of record, so progress reviews are reconstructed from screenshots. ForeSites is the system of record: a WhatsApp-first ingestion pipeline plus a dashboard that lets the developer query and assign across sites.

## My contributions

### NL-to-SQL agent (AWS Lambda · Gemini)

Built a Python AWS Lambda agent (Gemini API) that performs streaming NL-to-SQL over a 9-table Postgres schema. Per-session memory is persisted across turns; session-ownership enforcement keeps each conversation scoped to a single project so cross-tenant leaks are impossible by construction.

### WhatsApp ingestion service (Node · Express · S3 · Supabase)

Built the ingestion service: WhatsApp Business API webhook → Express handler → S3 for media → Supabase (Postgres) for the structured snag record. Voice notes are transcribed, images are OCR'd, text snags are written directly. Each snag carries a project ID derived from the sender's project membership.

### Dashboard + schema

Redesigned the React dashboard frontend; authored the relational schema and the snag-assignment workflow (assignee, status, SLA, audit trail).

## Status

Pilot stage with a Pune real-estate developer. The platform is producing usable snag records and the agent answers project queries in production. Next: cost-aware routing for the agent and a structured snag-template layer above the freeform ingestion.
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/projects/foresites.mdx
git commit -m "feat(case-study): ForeSites — NL-to-SQL agent + WhatsApp ingestion"
```

---

### Task 35: `/projects/agrosense` case study

**Files:**
- Create: `src/pages/projects/agrosense.mdx`

- [ ] **Step 1: Create `src/pages/projects/agrosense.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "AgroSense — Precision Agriculture (PBL4, MIT-WPU)"
description: "UAV photogrammetry + ESP32 ground module + Firebase dashboard with multilingual AI assistant."
num: "02"
section: "PROJECTS"
drawing: "02 / 04"
context: "AGROSENSE — PBL4"
pageTitle: "AgroSense"
role: "team · MIT-WPU PBL4 · ay 2025–26"
tldr:
  - { k: "Aerial",  v: "UAV photogrammetry · orthomosaic · ExG / VARI" }
  - { k: "Ground",  v: "ESP32 · Modbus soil sensor · GPS waypoints" }
  - { k: "Inference", v: "on-device ML for NPK estimation" }
  - { k: "Dashboard", v: "Firebase · Vercel · multilingual AI assistant" }
---

## Pipeline

### Aerial layer (RGB → orthomosaic → vegetation indices → zoning)

The UAV captures RGB imagery over a target plot. The pipeline:

1. **RGB capture + photogrammetry** — stitch overlapping captures into an orthomosaic.
2. **Vegetation indices** — compute Excess Green (`ExG`) and Visible Atmospherically Resistant Index (`VARI`) from the RGB orthomosaic. RGB-only because dedicated multispectral sensors weren't available.
3. **Zoning** — K-means cluster the index map into management zones (low / mid / high vigour).

### Ground layer (ESP32 + Modbus + GPS waypoints)

An ESP32 ground module carries a Modbus soil sensor and a GPS receiver. The rover follows a waypoint plan over the zones identified from the air. At each waypoint it samples the soil and runs an on-device ML model that estimates NPK (nitrogen / phosphorus / potassium) from the multivariate sensor reading.

### Dashboard

Firebase + Vercel dashboard surfaces the orthomosaic + zoning overlay alongside the ground-truth NPK readings. A multilingual AI assistant answers farmer queries in their preferred language and grounds answers in the current plot data.

## Team

Heramb · Pranav · Paresh · me — MIT-WPU Department of Electronics & Computer Engineering, AY 2025–26.
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/projects/agrosense.mdx
git commit -m "feat(case-study): AgroSense — UAV + ESP32 + Firebase precision-ag"
```

---

### Task 36: `/projects/ekg` short writeup

**Files:**
- Create: `src/pages/projects/ekg.mdx`

- [ ] **Step 1: Create `src/pages/projects/ekg.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "EKG — query-driven Neo4j mini-graphs"
description: "Demo ingesting SQL / JSON / TXT into query-driven Neo4j mini-graphs with a Gemini NL-query interface."
num: "02"
section: "PROJECTS"
drawing: "03 / 04"
context: "EKG — DEMO"
pageTitle: "EKG"
role: "solo · 2025"
tldr:
  - { k: "Status",  v: "demo · not a product" }
  - { k: "Input",   v: "SQL · JSON · TXT" }
  - { k: "Store",   v: "Neo4j · mini-graphs per query" }
  - { k: "UI",      v: "Gemini NL-query interface" }
---

## What it is

A demo that ingests three input shapes — relational rows, JSON documents, and free text — and emits per-query Neo4j mini-graphs with entities and edges extracted by Gemini. A natural-language query interface sits on top.

## What it is not

A production knowledge-graph system. The previous portfolio listed this as "Enterprise Knowledge Graph"; that framing was overstated and has been corrected.
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/projects/ekg.mdx
git commit -m "feat(case-study): EKG short writeup with corrected scope"
```

---

### Task 37: `/projects/earlier` list page

**Files:**
- Create: `src/pages/projects/earlier.astro`

- [ ] **Step 1: Create `src/pages/projects/earlier.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Frame from '../../components/Frame.astro';
import Nav from '../../components/Nav.astro';
import SectionLabel from '../../components/SectionLabel.astro';
import { earlier } from '../../content/site';

const expanded: Array<{ year: string; title: string; blurb: string; detail: string }> = [
  { year: '2024', title: 'scout rover for hazardous environments',
    blurb: 'matlab + lidar slam, mq5 / dht / ultrasonic',
    detail: 'A rover designed for hazardous environments. LiDAR-based SLAM in MATLAB for mapping; environmental sensors (MQ5 gas, DHT temperature/humidity, ultrasonic distance) for telemetry.' },
  { year: '2024', title: 'electric load forecasting (delhi)',
    blurb: 'mlp · keras',
    detail: 'Multi-Layer Perceptron forecasting Delhi electricity load against historical demand. Educational project; not deployed.' },
  { year: '2024', title: 'ldr-based solar tracker',
    blurb: 'arduino + servos',
    detail: 'Two-axis solar tracker using LDR pairs and servos to orient a panel toward the sun.' },
  { year: '2024', title: 'sos tracker (lora 433mhz)',
    blurb: 'embedded',
    detail: 'Long-range, low-power distress signaling over LoRa 433MHz for areas with poor cellular connectivity.' },
  { year: '2024', title: 'lidar fan-speed detector',
    blurb: 'matlab fft',
    detail: 'Non-contact rotational-speed measurement of fans using LiDAR distance traces and FFT in MATLAB.' },
];
---
<Base title="Earlier work — Mihir Mohite">
  <Frame drawing="04 / 04" context="EARLIER · 2024">
    <Nav current="PROJECTS" />
    <a href="/" class="back-link">← back to index</a>
    <SectionLabel num="02.5" name="EARLIER" />
    <h1 class="display">Earlier work.</h1>
    <p class="role">2024 · pre-resume — included for range, not depth.</p>
    <ul class="earlier" style="margin-top: 1.5rem">
      {expanded.map((e) => (
        <li>
          <span class="y">{e.year}</span>
          <span>
            <b>{e.title}</b>
            <div class="blurb" style="margin-top: 0.25rem">{e.blurb}</div>
            <p class="body-text" style="font-size: 0.85rem; margin-top: 0.4rem">{e.detail}</p>
          </span>
        </li>
      ))}
    </ul>
  </Frame>
</Base>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/projects/earlier.astro
git commit -m "feat(projects): /projects/earlier list page"
```

---

### Task 38: `/leadership/trifecta-2026` case study

**Files:**
- Create: `src/pages/leadership/trifecta-2026.mdx`

- [ ] **Step 1: Create `src/pages/leadership/trifecta-2026.mdx`**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: "Trifecta Challenge 2026"
description: "Three-day flagship symposium across Full-Stack, ML and Competitive Programming. 87 teams, GfG / HackerRank / AlgoZenith partners, ₹1.5L pool."
num: "03"
section: "LEADERSHIP"
drawing: "01 / 01"
context: "CODEC — TRIFECTA 2026"
pageTitle: "Trifecta Challenge 2026"
role: "president, codec · 2025.10 — present"
tldr:
  - { k: "Format",         v: "3 days · 3 tracks" }
  - { k: "Tracks",         v: "Full-Stack · ML · Competitive Programming" }
  - { k: "Teams",          v: "<b>87 registered</b>" }
  - { k: "Partner orgs",   v: "GfG · HackerRank · AlgoZenith" }
  - { k: "Prize pool",     v: "<b>₹1,50,000</b>" }
  - { k: "Reach",          v: "MIT-WPU + external engineering colleges" }
---

## Format

Three-day symposium organized end-to-end by CoDeC. Three parallel tracks ran simultaneously, each with its own selection round, problem set, and finale judging rubric:

- **Full-Stack Development** — product-build sprint with a brief judged on shipped functionality and code quality.
- **Machine Learning** — applied ML challenge with a held-out evaluation set.
- **Competitive Programming** — algorithmic contest run on partner platform infrastructure.

## Reach

87 teams registered across MIT-WPU and external engineering colleges. Partner network: GeeksforGeeks, HackerRank, AlgoZenith. ₹1,50,000 prize pool.

## What I led

End-to-end execution: track design, partner outreach, sponsor coordination, problem-set vetting across three tracks, on-the-day operations, and post-event recap. The CoDeC team is the surface area; the multi-week coordination across partner orgs was where the real work lived.
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/leadership/trifecta-2026.mdx
git commit -m "feat(case-study): Trifecta Challenge 2026 writeup"
```

---

### Task 39: Standalone `/contact` mirror

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/contact.astro`**

A small page that mirrors the home `06 CONTACT` section so direct linking to `/contact` works.

```astro
---
import Base from '../layouts/Base.astro';
import Frame from '../components/Frame.astro';
import Nav from '../components/Nav.astro';
import SectionLabel from '../components/SectionLabel.astro';
import GithubIcon from '../components/icons/GithubIcon.astro';
import LinkedinIcon from '../components/icons/LinkedinIcon.astro';
import EnvelopeIcon from '../components/icons/EnvelopeIcon.astro';
import ModeToggle from '../components/ModeToggle.astro';
import { profile } from '../content/site';
---
<Base title="Contact — Mihir Mohite">
  <Frame drawing="06 / 06" context="CONTACT">
    <Nav current="CONTACT" />
    <a href="/" class="back-link">← back to index</a>
    <SectionLabel num="06" name="CONTACT" />
    <h1 class="display">Get in touch.</h1>
    <p class="role">{profile.email} · {profile.location.toLowerCase()}</p>

    <ul class="contact-list">
      <li><a href={`mailto:${profile.email}`}><EnvelopeIcon /> {profile.email}</a></li>
      <li><a href={profile.github} target="_blank" rel="noopener"><GithubIcon /> github.com/lawn-mimower</a></li>
      <li><a href={profile.linkedin} target="_blank" rel="noopener"><LinkedinIcon /> linkedin.com/in/mihir-mohite</a></li>
    </ul>

    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" class="form">
      <input type="hidden" name="form-name" value="contact" />
      <p class="hp"><label>Don’t fill this out: <input name="bot-field" /></label></p>
      <div><label for="name">name</label><input id="name" name="name" type="text" required /></div>
      <div><label for="email">email</label><input id="email" name="email" type="email" required /></div>
      <div><label for="subject">subject</label><input id="subject" name="subject" type="text" required /></div>
      <div><label for="message">message</label><textarea id="message" name="message" rows="5" required /></div>
      <button type="submit">Send →</button>
    </form>

    <ModeToggle />
  </Frame>
</Base>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/contact.astro
git commit -m "feat(contact): standalone /contact page mirroring home section"
```

---

### Task 40: `/thank-you` page

**Files:**
- Create: `src/pages/thank-you.astro`

- [ ] **Step 1: Create `src/pages/thank-you.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Frame from '../components/Frame.astro';
import Nav from '../components/Nav.astro';
---
<Base title="Thank you — Mihir Mohite">
  <Frame drawing="06 / 06" context="MESSAGE RECEIVED">
    <Nav />
    <h1 class="display" style="margin-top: 2.5rem">Thanks.</h1>
    <p class="role">message received · i'll reply from mihir.moe@gmail.com</p>
    <p class="body-text" style="margin-top: 1.5rem">
      <a href="/" style="color: var(--accent)">← back to index</a>
    </p>
  </Frame>
</Base>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/thank-you.astro
git commit -m "feat(contact): /thank-you page replacing legacy thank_you.html"
```

---

## Phase 4 — Lint, polish, deploy (Tasks 41–49)

### Task 41: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Frame from '../components/Frame.astro';
import Nav from '../components/Nav.astro';
---
<Base title="404 — Mihir Mohite">
  <Frame drawing="—" context="PAGE NOT FOUND">
    <Nav />
    <h1 class="display" style="margin-top: 2.5rem">404.</h1>
    <p class="role">no drawing under that reference number.</p>
    <p class="body-text" style="margin-top: 1.5rem">
      <a href="/" style="color: var(--accent)">← back to index</a>
    </p>
  </Frame>
</Base>
```

- [ ] **Step 2: Commit**

Run:
```
git add src/pages/404.astro
git commit -m "feat: 404 page in spec-sheet register"
```

---

### Task 42: Banned-vocabulary lint script (TDD)

**Files:**
- Create: `scripts/lint-vocabulary.mjs`
- Create: `scripts/lint-vocabulary.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/scripts/lint-vocabulary.test.mjs`:
```js
import { describe, it, expect } from 'vitest';
import { findHits, BANNED } from './lint-vocabulary.mjs';

describe('lint-vocabulary', () => {
  it('returns no hits for clean text', () => {
    expect(findHits('shipped a thing.', 'a.md')).toEqual([]);
  });

  it('flags a banned phrase with line and column', () => {
    const text = 'we built a production-grade system';
    const hits = findHits(text, 'b.md');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ file: 'b.md', term: 'production-grade', line: 1 });
  });

  it('respects the inline allow comment on the same line', () => {
    const text = 'production-grade <!-- lint: allow "production-grade" -->';
    expect(findHits(text, 'c.md')).toEqual([]);
  });

  it('finds multiple terms across multiple lines', () => {
    const text = 'cutting-edge tools.\nresults-driven team.\n';
    const hits = findHits(text, 'd.md');
    expect(hits.map((h) => h.term).sort()).toEqual(['cutting-edge', 'results-driven']);
  });

  it('matches case-insensitively', () => {
    expect(findHits('Production-Grade thing', 'e.md')).toHaveLength(1);
  });

  it('includes every documented banned term', () => {
    const expected = [
      'production-grade', 'enterprise-grade', 'enterprise ai', 'cutting-edge',
      'results-driven', 'passionate about', 'leveraging', 'robust solutions',
      'scalable solutions', 'synergiz',
    ];
    for (const t of expected) expect(BANNED).toContain(t);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run scripts/lint-vocabulary.test.mjs`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the script**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/scripts/lint-vocabulary.mjs`:
```js
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

export const BANNED = [
  'production-grade',
  'enterprise-grade',
  'enterprise ai',
  'cutting-edge',
  'results-driven',
  'passionate about',
  'leveraging',
  'robust solutions',
  'scalable solutions',
  'synergiz',
];

const ALLOW_RE = /<!--\s*lint:\s*allow\s+"([^"]+)"\s*-->/g;
const SCAN_EXT = new Set(['.astro', '.mdx', '.md', '.html']);
const SCAN_ROOTS = ['src'];

export function findHits(text, file) {
  const out = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const allowed = new Set();
    let m;
    while ((m = ALLOW_RE.exec(line)) !== null) allowed.add(m[1].toLowerCase());
    ALLOW_RE.lastIndex = 0;
    for (const term of BANNED) {
      const lc = line.toLowerCase();
      const idx = lc.indexOf(term);
      if (idx === -1) continue;
      if (allowed.has(term)) continue;
      out.push({ file, line: i + 1, col: idx + 1, term });
    }
  }
  return out;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.') || name === '_legacy' || name === 'dist') continue;
      yield* walk(p);
    } else if (SCAN_EXT.has(extname(name))) {
      yield p;
    }
  }
}

function main() {
  const cwd = process.cwd();
  const hits = [];
  for (const root of SCAN_ROOTS) {
    try {
      for (const f of walk(join(cwd, root))) {
        const text = readFileSync(f, 'utf8');
        hits.push(...findHits(text, relative(cwd, f)));
      }
    } catch { /* root may not exist yet */ }
  }
  if (hits.length === 0) {
    console.log('lint-vocabulary: clean.');
    process.exit(0);
  }
  for (const h of hits) {
    console.error(`${h.file}:${h.line}:${h.col}  banned term: "${h.term}"`);
  }
  console.error(`\nlint-vocabulary: ${hits.length} hit${hits.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run scripts/lint-vocabulary.test.mjs`
Expected: 6 tests pass.

- [ ] **Step 5: Run linter on the actual content**

Run: `npm run lint:vocab`
Expected: `lint-vocabulary: clean.`

If it reports hits, edit the offending file to remove the banned term, or add `<!-- lint: allow "term" -->` on the same line if the use is genuinely intentional.

- [ ] **Step 6: Commit**

Run:
```
git add scripts/lint-vocabulary.mjs scripts/lint-vocabulary.test.mjs
git commit -m "feat(lint): banned-vocabulary script with tests"
```

---

### Task 43: Pre-commit hook for lint + tests

**Files:**
- Create: `.git/hooks/pre-commit` (chmod +x)
- Create: `scripts/install-hooks.sh`
- Modify: `package.json` (add `prepare` script that installs the hook)

- [ ] **Step 1: Create `scripts/install-hooks.sh`**

```sh
#!/usr/bin/env bash
set -euo pipefail
HOOK=".git/hooks/pre-commit"
mkdir -p .git/hooks
cat > "$HOOK" <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
echo "→ lint:vocab"
node scripts/lint-vocabulary.mjs
echo "→ tests"
npx vitest run --reporter=dot
HOOK
chmod +x "$HOOK"
echo "installed pre-commit hook"
```

- [ ] **Step 2: Wire into `package.json`**

Modify `package.json`. Add to `scripts`:
```json
"prepare": "node -e \"if(require('fs').existsSync('.git'))require('child_process').execSync('bash scripts/install-hooks.sh',{stdio:'inherit'})\""
```

- [ ] **Step 3: Install the hook**

Run: `npm run prepare`
Expected: `installed pre-commit hook`.

- [ ] **Step 4: Smoke-test the hook**

Run: `git commit --allow-empty -m "test: pre-commit hook"`
Expected: hook runs lint + tests, then commit succeeds.

- [ ] **Step 5: Commit the script + package.json change**

Run:
```
git add scripts/install-hooks.sh package.json
git commit -m "chore: pre-commit hook running lint:vocab + vitest"
```

---

### Task 44: View Transitions named morphs (display title)

**Files:**
- Modify: `src/styles/primitives.css`

- [ ] **Step 1: Add named transition to display heading**

Append to `src/styles/primitives.css`:
```css
/* View Transitions — name the display heading so home → case study cross-fades smoothly */
.display { view-transition-name: display-title; }

@keyframes vt-fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes vt-fade-out { from { opacity: 1; } to { opacity: 0; } }

::view-transition-old(root) { animation: 220ms ease both vt-fade-out; }
::view-transition-new(root) { animation: 220ms ease both vt-fade-in; }
```

- [ ] **Step 2: Visual check**

Run dev server. Click `BeyondBot` row from the home page. The page transition should cross-fade rather than hard-cut. Click back: same.

- [ ] **Step 3: Commit**

Run:
```
git add src/styles/primitives.css
git commit -m "feat(motion): named view-transition on display title; root cross-fade"
```

---

### Task 45: Build, fix any issues

**Files:** none (verification step)

- [ ] **Step 1: Type-check**

Run: `npm run check`
Expected: `0 errors`. If errors, fix and re-run.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `dist/` populated, no errors. Check that all routes from the IA are present:
```
ls dist
ls dist/work
ls dist/projects
ls dist/leadership
```
Expected: `index.html`, `work/beyondbot/index.html`, `work/heera/index.html`, `projects/foresites/index.html`, `projects/agrosense/index.html`, `projects/ekg/index.html`, `projects/earlier/index.html`, `leadership/trifecta-2026/index.html`, `contact/index.html`, `thank-you/index.html`, `404.html`.

- [ ] **Step 3: Preview**

Run: `npm run preview`
Open `http://localhost:4321/` and click through every route. Verify no broken links.

- [ ] **Step 4: Commit (only if any fixes were needed)**

If you changed files during this task, run `git add -A && git commit -m "fix: build issues from final QA pass"`. Otherwise skip.

---

### Task 46: Reduced-motion + mobile QA

**Files:** none (verification step)

- [ ] **Step 1: Reduced motion check**

Open Chrome DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → `reduce`. Reload the home page.
Expected: caret no longer blinks, hairlines render without draw-in animation, page-transition cross-fade is also disabled (per the global `@media (prefers-reduced-motion: reduce)` rule in reset.css). Visit a case study and back — no animations.

- [ ] **Step 2: Mobile responsive check**

DevTools → Device toolbar → 375×812 (iPhone). Check:
- Home page: nav right side hidden, spec grid shifts to 1 col, entry rows collapse to single column.
- BeyondBot case study: TLDR collapses, table is horizontally scrollable.
- Contact form: inputs at full width, button readable.

- [ ] **Step 3: Light/dark cycling**

Click Mode toggle: `System → Light → Dark → System`. Each click should cross-fade the whole page (no flicker, no FOUC). Refresh in the middle: chosen mode persists.

- [ ] **Step 4: Commit (only if any fixes were needed)**

If you changed files during this task, run `git add -A && git commit -m "fix: mobile + reduced-motion adjustments from QA"`. Otherwise skip.

---

### Task 47: README + favicons

**Files:**
- Create: `public/favicon.svg`
- Modify: `src/layouts/Base.astro` (add favicon link)
- Create: `README.md`

- [ ] **Step 1: Create a minimal favicon**

Create `/Users/mihirmohite/MIT/Interview/portfolio_final/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0c0c0e"/>
  <text x="16" y="22" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" font-weight="500" fill="#ffb547">m.</text>
</svg>
```

- [ ] **Step 2: Link favicon from Base**

In `src/layouts/Base.astro` `<head>`, add (after the `<link rel="canonical">` line):
```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 3: Create `README.md`**

```markdown
# mihirmohite.in

Personal site for Mihir Mohite. Astro 5, IBM Plex Sans + Plex Mono, vanilla CSS, deployed to Netlify.

## Develop

```
npm install
npm run dev          # http://localhost:4321
npm run build
npm run preview
```

## Test + lint

```
npm test             # vitest (theme + lint-vocabulary)
npm run lint:vocab   # banned-words scan against src/
npm run check        # astro type check
```

## Pre-commit hook

`npm run prepare` installs a hook that runs `lint:vocab` + `vitest` on every commit.

## Layout

- `src/pages/index.astro` — home (00 NOW → 06 CONTACT inline scroll)
- `src/pages/work/*.mdx` — internship case studies
- `src/pages/projects/*.mdx` + `earlier.astro` — project case studies + earlier-work list
- `src/pages/leadership/*.mdx` — leadership case studies
- `src/components/` — Frame, SectionLabel, SpecGrid, EntryRow, etc.
- `src/styles/` — tokens · reset · primitives · motion
- `src/content/site.ts` — single source of truth for home-page content
- `_legacy/` — pre-rewrite vanilla site, kept for reference

## Spec

`docs/superpowers/specs/2026-05-04-portfolio-redesign-design.md`
```

- [ ] **Step 4: Commit**

Run:
```
git add public/favicon.svg src/layouts/Base.astro README.md
git commit -m "chore: favicon + README"
```

---

### Task 48: Deploy preview + cutover

**Files:** none (deploy)

- [ ] **Step 1: Push the redesign branch**

Run: `git push -u origin redesign`
Expected: branch published. Netlify should pick this up and produce a deploy preview at a `redesign--<site>.netlify.app` URL (Netlify default for branch deploys).

- [ ] **Step 2: Verify preview**

Open the preview URL. Click through every page. Submit the contact form once with a real email — confirm Netlify Forms catches it (visible in the Netlify dashboard under Forms).

- [ ] **Step 3: Open PR**

If you have GitHub access, open a pull request from `redesign` → `main`. Otherwise, prepare for a direct merge (next step).

- [ ] **Step 4: Merge to main**

Once you've verified the preview:

```
git checkout main
git merge redesign --no-ff -m "feat: portfolio redesign — Astro spec-sheet site"
git push origin main
```

Netlify rebuilds from `main` and pushes to `mihirmohite.in`. Domain doesn't move — same Netlify site, same DNS.

- [ ] **Step 5: Post-deploy smoke**

Open `https://mihirmohite.in/` (and the same in dark mode by toggling system preference or using the footer toggle). Walk through every section + every case-study link. If anything's wrong on production, push a fix to `main` (which redeploys).

---

### Task 49: Final cleanup (optional)

**Files:**
- Optional: delete `_legacy/`

- [ ] **Step 1: Decide whether to keep `_legacy/`**

Keep for one more month so you can copy anything you might have missed (old project blurbs, photos). After that:

```
git rm -r _legacy
git commit -m "chore: remove _legacy/ — redesign live for 30+ days"
git push
```

This task is **optional and time-gated**. Don't run it on launch day.

---

## Self-review

I checked the plan against the spec section by section.

### Spec coverage
- §1 Goals & non-goals → Tasks 1–49 collectively, lint script (T42) enforces honesty rule.
- §2 Stack → T3, T4, T5, T11, T20.
- §3 IA → T24–T29 (home), T32–T40 (inner pages).
- §4 Visual design system: tokens (T8), reset (T9), primitives (T10), motion (T11), layout (T12), each component (T13–T20), observer (T21).
- §5 Page-by-page content → T24–T40, all sections covered, BeyondBot/Heera resume bullets ported verbatim into MDX.
- §6 Removals → T2 (legacy fence), T5 (chat function dropped from netlify.toml), T18 (icons replace FontAwesome).
- §7 Honesty rules → T42 (lint script with tests), T43 (pre-commit hook).
- §8 Migration plan → matches the Phase 0 / 1 / 2 / 3 layout in this plan.
- §9 Open questions → CommonForms / FFDNet and "Advanced RAG" omitted by default per spec; if Mihir confirms either is real and rewrites framing, add a new T34/35-style task before T48.
- §10 Out of scope → respected (no /writing, no analytics, no ⌘K).
- Appendix A (component inventory) → maps 1:1 to T13–T20 + T31.
- Appendix B (banned vocabulary) → T42 BANNED list.

### Placeholder scan
No "TBD", no "TODO", no "implement later", no "similar to Task N". Every code block is complete.

### Type consistency
- `Theme` type (`'system' | 'light' | 'dark'`) consistent across `theme.ts` and `ModeToggle.astro`.
- `EntryRow` props (`when`, `title`, `org`, `href`, `readLabel`) consistent with usage in T25, T26, T27.
- `Frame` props (`rev`, `drawing`, `domain`, `context`) consistent with all callers (home, case-study shell, stub).
- `SpecCell` `k` prop consistent.
- Content data type `skills: Array<{ k: string; v: string[] }>` consistent with T28's iteration.

### Open questions to resolve before / during execution
1. CommonForms/FFDNet and "Advanced RAG" projects — confirm or default-omit (already defaulted to omit per spec §9).
2. Anything to link from the Trifecta case study (event recap, photos)? Currently no links section. Add later if Mihir provides URLs.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-05-portfolio-redesign-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
