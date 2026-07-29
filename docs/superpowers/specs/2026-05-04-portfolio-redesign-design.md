# Portfolio redesign — design spec

**Repo:** `lawn-mimower/portfolio_final`
**Live target:** `https://mihirmohite.in`
**Author:** Mihir Mohite
**Date:** 2026-05-04
**Status:** Draft for review

---

## 1. Goals & non-goals

### Goals
1. **Tell the truth.** The current site overstates work, invents tech (Pinecone/Milvus/IBM Docling/FFDNet), and omits the strongest current projects (ForeSites, AgroSense). Fix this first; visual second.
2. **Read like an engineer wrote it, not a template.** No "production-grade", "enterprise-grade", "cutting-edge" filler.
3. **Make the home page answer the recruiter's question without a click.** Long single-page scroll with every numbered section inline; case-study pages exist for depth.
4. **Earn the visual register.** Portfolio should feel like a datasheet or engineering quarterly — not a SaaS landing page or dev-portfolio template.

### Non-goals
- Not a blog yet. Writing index ships hidden until the first post lands.
- Not a CMS. All content is in the repo as MDX/HTML.
- Not a JS-heavy SPA. Static-first, hydrate only what needs to be interactive (mode toggle, hairline draw-on-scroll).
- No analytics in v1. Add Plausible later if useful.

---

## 2. Stack

| Concern | Choice | Why |
|---|---|---|
| Build | **Astro 5** | Static-first SSG, partial hydration, MDX, view transitions built-in. Zero JS by default. |
| Content | **MDX** for case studies, Astro `.astro` for shells | Code blocks + inline diagrams + components in case studies without HTML pain. |
| Styling | **Vanilla CSS + CSS variables** for theming | No Tailwind. Visual register is opinionated; classnames stay readable. One stylesheet per layer (tokens, primitives, layout). |
| Type | **IBM Plex Sans + IBM Plex Mono** via `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` (self-host, no Google Fonts request at runtime) | Subset to weights actually used (300/400/500/600). |
| Mode | CSS `@media (prefers-color-scheme)` + manual override stored in `localStorage`, applied via `data-theme` on `<html>` before paint (inline script in `<head>` to prevent FOUC) | Honor system pref by default, allow override. |
| Deploy | **Netlify** (existing site) | New build deploys to the same Netlify site that already serves `mihirmportfolio.netlify.app` and the mapped custom domain `mihirmohite.in`, so DNS does not need to move. Build command `astro build`, output `dist/`. |
| Forms | **Netlify Forms** (existing markup pattern) | Same as today, no backend. |
| Chat function | **Removed.** | See §6. |

---

## 3. Information architecture

```
mihirmohite.in/
├── /                          home — scrolling spec sheet, all 6 sections inline
│
├── /work/
│   ├── beyondbot/             case study (MDX) — RAG pipeline + RAGAS results
│   └── heera/                 case study (MDX) — address validation
│
├── /projects/
│   ├── foresites/             case study (MDX) — construction-tech pilot
│   ├── agrosense/             case study (MDX) — UAV + ESP32 + Firebase
│   ├── ekg/                   short writeup (MDX)
│   └── earlier/               one-page list of pre-2025 work
│
├── /leadership/
│   └── trifecta-2026/         case study (MDX) — Trifecta Challenge
│
├── /writing/                  hidden until first post (no link in nav)
│
└── /contact                   form + links
```

**Home page section order (top to bottom, all inline):**
- `00 NOW` — name + role + 4-cell spec grid + 1-paragraph current focus + pipeline line + recognitions one-liner.
- `01 WORK` — entry list: BeyondBot, Heera. Each row: date · title · org · 1-line lede · `read →`.
- `02 PROJECTS` — entry list: ForeSites, AgroSense, EKG, then a sub-block `02.5 EARLIER` with 5–6 one-liners.
- `03 LEADERSHIP` — Trifecta Challenge entry + ML Projects Division Lead one-liner.
- `04 EDUCATION` — single-row entry: MIT-WPU, B.Tech ECE w/ AI/ML specialization, expected May 2027, CGPA 8.56.
- `05 SKILLS` — flat list grouped by category, mono labels. No "skill bars". No icons.
- `06 CONTACT` — form + email + LinkedIn + GitHub.

**Removed sections (vs current site):**
- "About Me" wall-of-text. Replaced by `00 NOW` paragraph.
- "Achievements & Awards" stock-icon grid. Replaced by single mono one-liner under `00 NOW`.
- Light/dark toggle in nav (replaced by a discreet text toggle in the footer + system-pref default).

---

## 4. Visual design system

### 4.1 Type
- **Family pair:** IBM Plex Sans + IBM Plex Mono, self-hosted via `@fontsource`.
- **Weights:** 300 (rare body), 400 (default), 500 (emphasis, accent), 600 (rare display).
- **Roles:**
  - **Sans:** name (weight 400, large), section H2s, body paragraphs, entry titles.
  - **Mono:** all data (dates, metrics, kvs), section labels (`00 NOW`), drawing-corner annotations, code blocks, the role line, nav.
- **Scale (rem, base 16px):**
  - Display name: `2.6rem` desktop / `2rem` mobile, line-height `1.0`, letter-spacing `-0.04em`
  - H2 (entry title): `1.05rem`, weight 500
  - Body: `0.95rem`, line-height `1.6`
  - Mono label: `0.66rem`, uppercase, letter-spacing `0.22em`
  - Mono data: `0.78rem`
- **`font-feature-settings`:** `'ss02', 'ss03'` on mono (Plex Mono's slashed zero + dotted i variants).

### 4.2 Color tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f6f2e6` (warm cream) | `#0c0c0e` (warm near-black) |
| `--ink` | `#18181b` | `#f0ece2` |
| `--mid` | `#5a5a60` | `#9a958a` |
| `--muted` | `#7a7a82` | `#6a655c` |
| `--rule` | `#18181b` @ 32% opacity | `#f0ece2` @ 32% opacity |
| `--dot` | `#c9c5b8` | `#1d1d1f` |
| `--accent` | `#b54a00` (amber-rust) | `#ffb547` (amber) |
| `--code-bg` | `#efe9d9` | `#1a1a1d` |
| `--selection-bg` | `--accent` @ 25% | `--accent` @ 25% |

Selection color (`::selection`) uses `--accent` background with `--bg` text — small flair, immediate signal of intent.

### 4.3 Layout primitives (reusable Astro components)

- `<Frame>` — page shell with dot-grid background, top + bottom hairline rules, four drawing-corner annotations (`REV`, `DRAWING n/n`, `MIHIRMOHITE.IN`, `PUNE, IN`).
- `<SectionLabel num="00" name="NOW" />` — mono uppercase label with greyed numeral + accent name.
- `<SpecGrid>` — 4-column grid of spec cells, mono, hairline-top per cell. `cols` prop overrides. **Responsive:** 4 → 2 cols at `≤720px`, 2 → 1 cols at `≤420px`.
- `<EntryRow date title org lede href />` — the canonical "list entry": 3-column grid (date | content | `read →`), hairline divider top. **Responsive:** below `720px` collapses to single-column (date as small mono label above content, `read →` inline at end).
- `<Hairline />` — `<hr>` styled as 1px rule, `--rule` color.
- `<TerminalCursor />` — blinking caret span.
- `<Pipeline>{...steps}</Pipeline>` — renders inline with `→` separators in accent color.
- `<DrawingCorner pos="tl|tr|bl|br" />` — absolute-positioned annotation.

All primitives are pure presentational. No data fetching.

### 4.4 Motion

| Element | Motion | Trigger | Duration |
|---|---|---|---|
| Role-line caret | Blink | always | 1s steps(2) |
| Section hairlines | Width 0 → 100% draw-in | first scroll-into-view via IntersectionObserver, **fires once per element**, gated by `prefers-reduced-motion` | 250ms ease-out |
| Entry-row hover | `→` arrow translates `4px` right, color → `--accent` | `:hover` | 120ms |
| Page navigation (home → case study) | Astro View Transitions cross-fade + named morph on the title | `<a>` click | 220ms |
| Mode toggle | View Transitions API: `document.startViewTransition` on `[data-theme]` flip → cross-fades whole page | toggle click | 180ms |
| Section-label number on scroll-into-view | Fade in (`opacity 0 → 1`) | once per scroll | 200ms |

**Banned:** parallax, scroll-jacking, sticky horizontal scrolls, custom cursor, custom scrollbar, Framer-Motion-style staggered-reveal-everything, "magnetic" buttons, glassmorphism. All `prefers-reduced-motion` users get zero motion except the page-load cross-fade (still gated).

### 4.5 Drawing-corner annotations
Per page, the four corners hold:
- `tl`: `REV  YYYY.MM` (auto-set from build date)
- `tr`: `DRAWING  NN / NT` (page number / total in current section, e.g. `01 / 06`)
- `bl`: `MIHIRMOHITE.IN`
- `br`: `PUNE, IN` (or page-context, e.g. case studies show `BEYONDBOT — IN-PROGRESS`)

Generated via Astro layout slot, not hand-written per page.

---

## 5. Page-by-page content

### 5.1 `/` (home)

Single scroll. Each section is a `<Frame>`-wrapped block separated by full-width hairline rules.

**`00 NOW`**
- Label: `00  NOW`
- H1: **Mihir Mohite.**
- Role line (mono): `applied ml engineer · b.tech ai/ml @ mit-wpu · president, codec` + caret
- SpecGrid (4 cells):
  - `Role` → `ML Intern · BeyondBot`
  - `Working langs` → `Python · C++`
  - `RAGAS Δ` → `+0.26 hybrid v naive`
  - `Corpus` → `1,210 pp · IN law`
- Body (1 paragraph, ≤60 words):
  > Building a legal-compliance RAG system at BeyondBot over a 1,210-page corpus of Indian industrial, manufacturing and environmental law. Benchmarked five retrieval modes on a 315-query RAGAS harness — hybrid retrieval reached **0.77** against **0.51** for the naive baseline.
- Pipeline line: `mistral ocr → regex router → lightrag (kg + vector) → agno · gemini 3 flash → fastapi sse`
- Recognitions one-liner (mono, muted): `recognitions · sih r2 ′24 · circuit heist runner-up ′24 · dataquest finalist · hackmitwpu finalist`

**`01 WORK`**
- Label: `01  WORK`
- H2: `internships`
- Entry rows:
  1. `2025.10 — now` · **Machine Learning Intern** · BeyondBot Technology Pvt. Ltd. · Pune
     Lede: "Designed legal-compliance RAG over 1,210pp Indian-law corpus. RAGAS harness across 5 modes on 315 queries — hybrid 0.77 vs 0.51 naive. Built custom OpenCV visual chunker." → `/work/beyondbot/`
  2. `2025.06 — 2025.10` · **Software Intern** · Heera Software Pvt. Ltd. · Pune
     Lede: "Address-validation scoring service combining Google Maps API, fuzzy matching, and reverse-geocoded cosine similarity. Processed ~13,500 records." → `/work/heera/`

**`02 PROJECTS`**
- Label: `02  PROJECTS`
- H2: `selected work`
- Entry rows:
  1. `pilot · 2026` · **ForeSites** — Construction Site Management · *3-person team* → `/projects/foresites/`
  2. `2025` · **AgroSense** — Precision Agriculture (PBL4) · *team* → `/projects/agrosense/`
  3. `2025` · **EKG** — query-driven Neo4j mini-graphs · *solo* → `/projects/ekg/`
- Sub-label: `02.5  EARLIER`
- Earlier list (one-liners, mono, with year and stack tags):
  - `2024 · scout rover for hazardous environments · matlab + lidar slam, mq5/dht/ultrasonic`
  - `2024 · electric load forecasting (delhi) · mlp · keras`
  - `2024 · ldr-based solar tracker · arduino + servos`
  - `2024 · sos tracker (lora 433mhz) · embedded`
  - `2024 · lidar fan-speed detector · matlab fft`
- **⚠ Verification needed before publishing**: the previous site listed two more projects that aren't on the current resume — `CommonForms / FFDNet` and `Advanced RAG Implementation (Pinecone / Milvus / IBM Docling)`. Both have framing that smells overstated and the FFDNet description appears to confuse two distinct papers (FFDNet is a Gaussian-noise CNN denoiser, not a form-field detector). **Default: omit both unless Mihir confirms each is real and corrects the framing.**

**`03 LEADERSHIP`**
- Label: `03  LEADERSHIP`
- H2: `codec`
- Entry rows:
  1. `2025.10 — now` · **President** · CoDeC, MIT-WPU
     Lede: "Organized Trifecta Challenge 2026 — three-day flagship symposium across Full-Stack, ML, and Competitive Programming tracks. 87 registered teams, partner network including GeeksforGeeks, HackerRank and AlgoZenith, ₹1,50,000 prize pool." → `/leadership/trifecta-2026/`
  2. `2025.01 — now` · **ML Projects Division Lead** · CoDeC
     Lede: "Drive AI/ML project initiatives and run knowledge-sharing sessions for the club." (no `read →`)

**`04 EDUCATION`**
- Label: `04  EDUCATION`
- Single row: `2023 — 2027 (exp.)` · **MIT-WPU, Pune** · B.Tech ECE w/ Specialization in AI & ML · `cgpa 8.56 / 10.00`

**`05 SKILLS`**
- Label: `05  SKILLS`
- Flat groups (mono category labels, sans tags). Lifted verbatim from resume — no padding additions:
  - `Languages` → C++, Python, JavaScript, SQL
  - `CS Fundamentals` → DS, Algorithms, OOD, Complexity, Problem Solving
  - `Retrieval / RAG` → RAG, GraphRAG, LightRAG, RAGAS-style eval, Sentence Transformers, BGE
  - `Vector DBs` → Pinecone, Milvus
  - `LLM Platforms` → Vertex AI, Gemini API, Agno
  - `ML / Vision` → PyTorch, TensorFlow, Keras, CNN, Transformers, OpenCV, OCR, IBM Docling, Mistral OCR
  - `Backend & Cloud` → AWS (Lambda, S3, EC2), GCP (Vertex AI), Node.js / Express, FastAPI, REST, SSE, serverless
  - `Databases` → PostgreSQL (Supabase), MySQL, SQLite, Neo4j
  - `Tools & Hardware` → Git, MATLAB, WhatsApp Business API, Meta API, Arduino, ESP32, Raspberry Pi, LiDAR

**`06 CONTACT`**
- Label: `06  CONTACT`
- Email: `mihir.moe@gmail.com`
- LinkedIn / GitHub icons (Plex-sans wordmarks, no FontAwesome)
- Form: name / email / subject / message → Netlify Forms POST → `/thank-you`
- Footer line under form: `mode · system / light / dark`  ← discrete inline text toggle.

### 5.2 `/work/beyondbot/` (case study, MDX)
Sections: TL;DR (4 spec cells: corpus, modes evaluated, hybrid Δ, deploy stack) → Problem → Pipeline (system diagram, ASCII or SVG) → Eval harness (table of 5 retrieval modes × 4 RAGAS metrics across 315 queries) → OpenCV chunker subsection → What didn't work → Handover note.

### 5.3 `/work/heera/` (case study, MDX)
Shorter than BeyondBot. TL;DR (records processed, components, runtime) → Problem → Scoring approach (Google Maps + fuzzy + reverse-geocoded cosine) → Outcome.

### 5.4 `/projects/foresites/` (case study, MDX)
TL;DR (team size, pilot status, stack) → Problem (snag reporting in Indian construction sites) → System (Lambda + Gemini NL-to-SQL over 9-table Postgres, WhatsApp ingest in Node + S3 backed by Supabase) → Front end (React dashboard redesign) → Schema + assignment workflow notes.

### 5.5 `/projects/agrosense/` (case study, MDX)
TL;DR (PBL4 college project, team) → UAV pipeline (RGB → orthomosaic → ExG/VARI vegetation indices → K-means zoning) → Ground module (ESP32 + Modbus soil sensor + GPS waypoint guidance + on-device ML for NPK estimation) → Dashboard (Firebase + Vercel) + multilingual AI assistant.

### 5.6 `/projects/ekg/` (short MDX)
Single-screen writeup. Honest framing: "demo ingesting SQL/JSON/TXT into query-driven Neo4j mini-graphs with a Gemini NL-query interface." No "Enterprise Knowledge Graph" claim.

### 5.7 `/projects/earlier/`
List page identical in structure to the home `02.5 EARLIER` block, with one short paragraph per item. No case studies.

### 5.8 `/leadership/trifecta-2026/` (case study, MDX)
TL;DR (87 teams, 3 tracks, ₹1.5L pool, partner orgs) → How it was organized → Tracks → Outcomes.

### 5.9 `/contact`
Same form as home `06 CONTACT`. Submitted form → existing `thank_you.html` (renamed `/thank-you`).

---

## 6. Removals (deletion list)

- `chat-widget` div + `chat-modal` + suggested-questions UI in `index.html`.
- `main.js` chat handlers (entire chat block).
- `netlify/functions/chat.js` Netlify function.
- `styles.css` chat-related CSS.
- Stock-photo project images (`download.png`, `download (1).png`, `download.jpeg`, `images.jpeg`, `omni.png`) — replaced with no images on cards (the spec-sheet aesthetic doesn't use cover images), or one custom SVG diagram per case study where it adds information.
- `WhatsApp Image 2025-04-19 at *.jpeg` — replaced with a single, properly-named portrait (`assets/portrait.jpg`) only if Mihir wants a face on the home page; **default: omit, the spec sheet doesn't need it**.
- All FontAwesome usage. Replaced with inline SVG for the 3–4 icons we still use (envelope, github, linkedin, external-link).
- "AIML & Physics Enthusiast" tagline (Physics not on current resume).
- "Production-grade", "enterprise-grade", "cutting-edge", "results-driven", "passionate about" — banned vocabulary list, lint via `astro:check` plugin in CI (or simple grep in a pre-commit hook).

---

## 7. Honesty rules (binding)

These apply to every line written for the new site. Hard constraints, not guidelines.

1. **Never claim a tool, library, or framework Mihir hasn't actually used in the project being described.** Pinecone/Milvus/IBM Docling do not appear on the new site unless they appear on the resume *for the same project*.
2. **Never use the words: production-grade, enterprise-grade, cutting-edge, results-driven, passionate, leveraging, robust, scalable** (in the marketing-adjective sense). A pre-commit grep hook blocks these.
3. **Verbs default to weaker forms.** "Built", "designed", "wrote", "shipped" beat "architected", "spearheaded", "engineered".
4. **Numbers must be real.** RAGAS deltas, corpus sizes, record counts, team sizes — all must match the resume or a verifiable artifact.
5. **Team projects say "team".** ForeSites is a 3-person pilot; AgroSense is a team PBL4. Never imply solo when it wasn't.
6. **"Demo" stays "demo".** EKG is a demo, not an enterprise platform.

---

## 8. Migration plan (phased)

**Phase 0 — Setup (~30 min)**
- Create a `redesign/` branch from `main`.
- Move legacy files (`index.html`, `styles.css`, `main.js`, `thank_you.html`, `netlify/functions/chat.js`, all loose `*.png`/`*.jpeg` images) to `_legacy/` in a single commit so they're recoverable but out of the build path.
- `npm create astro@latest .` (force install in repo root), choose minimal/empty template.
- Install: `@astrojs/mdx`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`.
- Port `netlify.toml` (form + redirect config). The chat function is gone, so its `[functions]` block goes too.
- Add `.gitignore` entries for `.superpowers/`, `dist/`, `.astro/`, `node_modules/`.

**Phase 1 — Design system + home page (ship-now target)**
- Tokens (`tokens.css`), primitives (`Frame`, `SectionLabel`, `SpecGrid`, `EntryRow`, `Hairline`, `TerminalCursor`, `Pipeline`, `DrawingCorner`).
- Mode toggle inline-script (FOUC prevention).
- Home `/` with all 6 sections inline. Case-study `read →` links resolve to a stub page in the same visual register: a single `<Frame>` with `WRITEUP IN PROGRESS · REV 2026.05` in mono and a back-link. Avoids "coming soon" copy.
- Hairline draw-on-scroll IntersectionObserver.
- Deploy to Netlify under a preview URL.

**Phase 2 — Case studies that matter most (ship-soon)**
- `/work/beyondbot/`, `/work/heera/`
- `/projects/foresites/`, `/projects/agrosense/`, `/projects/ekg/`
- `/leadership/trifecta-2026/`
- `/projects/earlier/`

**Phase 3 — Polish**
- View transitions wired between home and case studies.
- Inline SVG icon replacements.
- Honest-vocabulary pre-commit hook.
- 404 page (in the same visual register).
- Open Graph / Twitter card images generated per page from the spec-sheet template.
- Merge `redesign/` → `main`. Domain doesn't move — Netlify deploys the new build to the same site already mapped to `mihirmohite.in`.

**Phase 4 — Optional, later**
- `/writing/` index + first post.
- Plausible analytics.
- RSS feed.

---

## 9. Open questions / verification needed before build

1. **CommonForms / FFDNet project** — keep, drop, or rewrite? Current site description appears to confuse FFDNet (a CNN denoiser) with form-field detection. Need either a corrected description or removal.
2. **"Advanced RAG Implementation"** project listing Pinecone / Milvus / IBM Docling — same: not on resume, suspicious. Drop unless real.
3. **Portrait photo on the home page** — yes or no? (Default: no.)
4. **Canonical email** — resume + current site both use `mihir.moe@gmail.com`. Confirming this is what should appear on the new site.
5. **Trifecta Challenge** — anything to link out to (event page, recap, photos)? If yes, add a `Links` section to that case study.
6. **Light/dark default** — confirmed system-preference. The manual override is a discrete inline text toggle in the footer (`mode · system / light / dark`), not a sun/moon icon button. Confirm.

---

## 10. Out of scope

- Blog post content. Index ships hidden.
- Internationalization. English only.
- A search palette (`⌘K`). Not in v1.
- Comment system on case studies.
- Analytics dashboard. (Plausible can be added later in a single line.)
- Newsletter signup.
- A "uses" page (devices, tools). Could be added later if useful.

---

## Appendix A — Component inventory

```
src/
├── components/
│   ├── Frame.astro            page shell + dot-grid + corners + hairlines
│   ├── DrawingCorner.astro
│   ├── SectionLabel.astro
│   ├── SpecGrid.astro         + SpecCell.astro
│   ├── EntryRow.astro
│   ├── Hairline.astro
│   ├── TerminalCursor.astro
│   ├── Pipeline.astro
│   ├── ModeToggle.astro       footer text toggle
│   ├── Nav.astro
│   ├── icons/                 inline SVGs: github, linkedin, envelope, ext-link
│   └── case-study/
│       ├── CaseStudyShell.astro   wraps MDX with TL;DR + Frame
│       └── TLDR.astro             4-cell spec grid for case study tops
│
├── layouts/
│   ├── Base.astro             HTML head, mode-init script, font @import, View Transitions
│   └── CaseStudy.astro        Base + CaseStudyShell
│
├── pages/
│   ├── index.astro
│   ├── work/
│   │   ├── beyondbot.mdx
│   │   └── heera.mdx
│   ├── projects/
│   │   ├── foresites.mdx
│   │   ├── agrosense.mdx
│   │   ├── ekg.mdx
│   │   └── earlier.astro
│   ├── leadership/
│   │   └── trifecta-2026.mdx
│   ├── contact.astro
│   └── thank-you.astro
│
├── styles/
│   ├── tokens.css             color + type tokens, light + dark
│   ├── reset.css
│   ├── primitives.css         Frame / Hairline / SpecGrid / etc.
│   └── motion.css             keyframes + reduced-motion gate
│
└── content/                   (if Astro Content Collections used for case-study metadata)
    └── config.ts
```

## Appendix B — Banned-vocabulary lint

Pre-commit hook (or `npm run lint`) greps for these terms in `src/**/*.{astro,mdx,md}` and fails the commit if any are found:

```
production-grade
enterprise-grade
enterprise-AI
cutting-edge
results-driven
passionate about
leveraging
robust solutions
scalable solutions
synergiz
```

Override per-occurrence with an inline comment `<!-- lint: allow "production-grade" -->` if context truly demands it (rare).
