# Design

The visual system for samhsteinmetz.github.io. Every component, page, and variant inherits from this document. When in doubt, default to the choice that does less.

## Theme

**Aesthetic:** a notebook. Specifically, the kind of small, well-kept paper notebook a thoughtful person carries — not a magazine, not a sketchbook, not a leather portfolio. The page feels like a single sheet of off-white paper with black ink on it.

**Physical scene** (per impeccable's light-vs-dark check): *the page is read on a laptop screen in a quiet room with a window open, by someone who has eight tabs open and is deciding whether to keep this one.* That sentence forces a light theme. Dark mode is not added; it would change what kind of object the page is.

**Color strategy:** **Restrained.** Tinted off-white + near-black ink + one cool-blue accent used at ≤5% of pixel weight. Never Committed, never Drenched. Color is punctuation.

**The lane we are not in:** editorial-typographic / magazine-specimen / Klim-press-kit. We share a few materials with that lane (serif headings, ruled lines, monochrome restraint) but the differentiator is personal notebook, not periodical. Concretely: no italic display headlines, no tiny mono eyebrows above sections, no three-column ruled grids, no centered drop caps. If a layout would look at home in a Recoleta-italic landing page, it has drifted.

---

## Color

Stored as OKLCH so the lightness ramp is perceptually even. Hex equivalents shipped alongside for legacy tooling.

### Palette

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `--paper` | `oklch(0.984 0.003 95)` | `#FAFAF8` | Page background. The off-white the brief specified. A whisper of warmth (chroma 0.003 toward yellow) to read as paper, not screen. |
| `--paper-edge` | `oklch(0.965 0.003 95)` | `#F2F2EE` | A half-step darker; the only second "surface" we permit. Used for code blocks and the rare callout. Never for cards. |
| `--ink` | `oklch(0.205 0.012 250)` | `#1B1F26` | Body text and headings. A near-black with a hair of cool — true `#000` reads as digital ink, this reads as fountain-pen ink on paper. Hits 16.4:1 on `--paper` (AAA at all sizes). |
| `--ink-soft` | `oklch(0.38 0.010 250)` | `#4D525B` | Secondary text: dates, captions, metadata. 8.6:1 on `--paper` — still AAA. |
| `--ink-muted` | `oklch(0.58 0.008 250)` | `#888C94` | Lowest-contrast text we permit, reserved for genuinely tertiary info (e.g. "updated 2024" timestamps). 4.6:1, AA only. Use sparingly. |
| `--rule` | `oklch(0.86 0.006 250)` | `#D5D6D9` | Horizontal rule lines, table dividers, input borders. Carries no information; can sit at low contrast. |
| `--rule-faint` | `oklch(0.92 0.005 250)` | `#E5E6E8` | Even fainter rules for sub-sectioning when needed. |
| `--accent` | `oklch(0.48 0.085 245)` | `#3F5A82` | The single accent. A faded ink blue, slightly desaturated, the color of old ballpoint pen. 6.8:1 on `--paper` (AA at all sizes, AAA for large). |
| `--accent-soft` | `oklch(0.48 0.085 245 / 0.12)` | `rgba(63, 90, 130, 0.12)` | The same accent at 12% alpha — for hover backgrounds, current-page indicators, and underline shadows. Never as fill on a card. |

### Rules of use

- **The accent appears in three places, and nowhere else:** (1) inline links, (2) the current-page indicator in the nav, (3) one optional emphasized word in the hero. Pixel weight stays under 5% of any given viewport.
- **No gradients. Anywhere.** Not on backgrounds, not on text, not on borders. If two colors meet, they meet at a hard edge.
- **No alpha on text.** Text colors are opaque. Alpha on `--accent-soft` is fine for backgrounds; alpha on ink reads as washed-out and signals "I forgot to pick a color."
- **No semantic-color palette** (no green success, no red error, no yellow warning). This is a personal site, not an app; semantic states show through copy and accent emphasis. The Contact form's only "error" surface is a single line of `--ink` text below the field.

---

## Typography

Three families. Each chosen against the impeccable reflex-reject list — Lora, Playfair Display, Fraunces, Inter, DM Sans, IBM Plex, and the Instrument family are all explicitly banned for greenfield work.

### Families

| Role | Family | Source | Why |
|---|---|---|---|
| **Headings** | Source Serif 4 | Google Fonts | A bookish transitional serif from Adobe, designed for reading at body size and holding shape at display size. Reads as "printed book," not "magazine cover" — which is the lane we are not in. Wide weight range (200–900) with a real italic. |
| **Body / UI** | iA Writer Quattro | Self-hosted (open-source from iA's repo) | Designed for the iA Writer text editor; literally a notebook-app font. Warmer than Inter, less generic than Source Sans, and almost no other site uses it. Carries the "handmade" reading without resorting to a script face. |
| **Mono / data / code** | JetBrains Mono | Google Fonts | Sharp on screen at small sizes, generous descenders, designed for code. Used for code snippets, inline data, timestamps when they want to read as data, and the small metadata line under section headings (sparingly). |

**Fallback stack** for each role, in order:

```css
--font-serif: 'Source Serif 4', 'Iowan Old Style', 'Georgia', ui-serif, serif;
--font-sans:  'iA Writer Quattro', 'Söhne', 'Helvetica Neue', 'Arial', ui-sans-serif, sans-serif;
--font-mono:  'JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', ui-monospace, monospace;
```

The current Playfair Display + League Spartan setup is removed from `index.html` and `tailwind.config.js`. Playfair is on the reflex-reject list; League Spartan is loaded but unused.

### Scale

Fixed `rem` scale, not fluid `clamp()`. Fluid type undermines the spatial predictability the notebook reading mode wants. Body text stays the same size at every viewport; headings step down once at `sm`.

| Token | Size | Line height | Use |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 4.2vw, 3.75rem)` | `1.05` | The one display heading — name on the home page. Only used once per site. |
| `--text-h1` | `2rem` (`sm`: `1.75rem`) | `1.15` | Page titles ("Projects", "About"). |
| `--text-h2` | `1.5rem` | `1.25` | Section headings within a page. |
| `--text-h3` | `1.125rem` | `1.35` | Subsection / project titles. |
| `--text-body` | `1rem` (`16px`) | `1.65` | All body copy. Never below this on mobile. |
| `--text-small` | `0.875rem` | `1.55` | Metadata: dates, captions, timestamps. |
| `--text-mono` | `0.875rem` | `1.55` | Mono inline. Slightly smaller because mono characters are wider. |
| `--text-code` | `0.8125rem` | `1.6` | Code blocks. |

**Letter-spacing:**
- Display heading: `-0.022em` (notebook serifs do not want to be cramped; this is the floor for our scale).
- All other headings: `-0.01em`.
- Body: `0`.
- All-caps anywhere: `+0.06em` — but we are not using all-caps as a pattern. The impeccable ban on uppercase-tracked eyebrows applies; no `<span class="eyebrow">` survives.

**Text-wrap:** `balance` on `h1`–`h3`, `pretty` on body paragraphs.

**Measure:** body paragraphs cap at `max-width: 68ch`. No prose runs the full width of the viewport, even on desktop.

### Hierarchy strategy

Three dimensions only: family + size + weight. No color shifts for hierarchy, no underlines for emphasis (those belong to links), no italic for headings (italic is for genuine emphasis within prose, not for decorative `<h2>`s).

- `h1`: Source Serif 4, 600, size `--text-h1`.
- `h2`: Source Serif 4, 500, size `--text-h2`.
- `h3`: iA Writer Quattro, 600, size `--text-h3` — the shift to sans here creates a hierarchical break without needing a fourth size step.
- Body: iA Writer Quattro 400, with **500** for in-prose emphasis (in place of `<strong>` defaulting to 700, which reads too loud on this aesthetic).

---

## Spacing & rhythm

A 4px base scale. The notebook reference is generous spacing — closer to a paperback's margins than a magazine's spreads.

| Token | Value | Use |
|---|---|---|
| `--space-1` | `0.25rem` (4px) | Hairline gap between tightly-coupled items (a label and its colon). |
| `--space-2` | `0.5rem` (8px) | Inside small components. |
| `--space-3` | `0.75rem` (12px) | Default gap between adjacent items in a list. |
| `--space-4` | `1rem` (16px) | Default inline padding. |
| `--space-6` | `1.5rem` (24px) | Between paragraphs. |
| `--space-8` | `2rem` (32px) | Between subsections. |
| `--space-12` | `3rem` (48px) | Between sections within a page. |
| `--space-16` | `4rem` (64px) | Between major sections, around section headings. |
| `--space-24` | `6rem` (96px) | Above page titles, around the one display heading. |
| `--space-32` | `8rem` (128px) | Between distinct page chapters when the page has narrative scope (the About page). |

**Vertical rhythm:** the baseline beat is `1.5rem` (24px), which is `--text-body × 1.5`. Section gaps are multiples of this where possible.

**Page margins:** the notebook margin is the most visible spatial decision. On desktop, the content column is `min(68ch, 100% - 12rem)` — meaning there is at least `6rem` of paper showing on each side of the text at any width. On mobile (`<640px`), this collapses to `1.5rem` side padding. The margins are part of the design; never squeeze them to fit more content.

**Vary, don't repeat.** Section gaps alternate between `--space-12` and `--space-16` deliberately. Equal spacing reads as a CMS template.

---

## Layout

- **Single content column.** Almost everything is one column, centered, capped at the measure. The Projects page can use a measured two-column for the project list on desktop (one column on mobile), but not three. Identical card grids are banned.
- **Flex over grid by default.** Grid is reserved for genuine 2D content (the future project list, when it has both a thumbnail and metadata).
- **No cards.** The brief is explicit; the system enforces. Sections are separated by:
  1. **Whitespace** — the primary tool. `--space-12` to `--space-16` between sections is usually enough.
  2. **A ruled line** — `1px` solid `--rule`, full content-column width, with `--space-8` above and below. Used when two sections would otherwise blur into each other.
  3. **A small all-mono label** — `--text-small` in `--font-mono`, `--ink-soft`, sitting on its own line above a section heading. Used sparingly — *not* above every section. The impeccable ban on eyebrow-above-every-section applies.
- **Z-index scale** (semantic, no arbitrary numbers):

```css
--z-base:    0;
--z-rule:    1;   /* the optional sticky hairline below the nav */
--z-nav:    10;
--z-dropdown: 20;
--z-modal-backdrop: 40;
--z-modal:  50;
--z-toast:  60;
```

---

## Rule lines (the load-bearing pattern)

The notebook aesthetic lives or dies on rule lines. Spec:

- **Default rule:** `border-top: 1px solid var(--rule)`, full content-column width, `margin-block: var(--space-8)`.
- **Faint rule:** same with `--rule-faint`, used for sub-sub-sectioning.
- **Margin rule** (optional, for narrative pages like About): a vertical line at `1rem` outside the left edge of the text column, `--rule-faint`, evoking a notebook's left margin. Used at most on one page.
- **No rules inside cards** (there are no cards). No rules inside lists (the list itself is the structure). No double rules. No rule-on-rule layouts.

The rule is doing the job that a `card` would do in a SaaS design system. Treat it with the same care.

---

## Components

This section enumerates the only components the system needs. Every UI surface composes from these; new components require a real justification.

### Navigation

- Fixed top, full-width, sitting on `--paper` (not blurred, not translucent — the glass effect is banned and would conflict with the paper metaphor).
- Single horizontal rule below it at `--rule`, full viewport width.
- Logo / name on the left in Source Serif 4 500. Three or four text links on the right in iA Writer Quattro 500, all-lowercase or title-case (not all-caps).
- Current page is marked with the accent color **plus** a `1px` underline at `--accent-soft`. Color alone is not the signal.
- Hover: link goes to `--accent`. No transform. No background pill. No box-shadow.

### Links

- `--accent` color, `text-decoration: underline`, `text-underline-offset: 3px`, `text-decoration-thickness: 1px`, `text-decoration-color: --accent-soft`.
- On hover: `text-decoration-color: --accent` (the underline darkens, the text doesn't move).
- Visited links use the same color — this is a personal site, not a wiki.

### Buttons

- Two variants only: **primary** and **quiet**.
- **Primary:** `1px solid --ink` border, `--ink` text, transparent background. On hover: background becomes `--ink`, text becomes `--paper`. Padding `--space-2` `--space-4`. Used at most once per page (Contact form's submit).
- **Quiet:** `--accent` text, no border, no background. Behaves as a link with extra padding.
- No filled-color buttons. No gradient buttons. No shadow on any button. No icon-on-the-left-of-button-label patterns unless the icon carries information.

### Form fields

- `1px solid --rule` bottom border only — top, left, and right are absent. The field is a notebook line you write on.
- On focus: bottom border becomes `1px solid --accent`, no glow, no box-shadow.
- Label above the field, `--text-small`, `--ink-soft`, never a placeholder-as-label.
- Error: one line of `--ink` text below the field, prefixed with a small `→`. No red.

### Lists

- Default `<ul>` uses an em-dash bullet, not a disc: `list-style: none` with a `::before { content: '— ' }`. The dash is the notebook's actual bullet.
- Numbered lists use lining numerals in `--ink-soft`, slightly outdented from the text.
- Nested lists are allowed up to one level. No three-deep trees.

### Code blocks

- `--paper-edge` background, no border, no shadow, no traffic-light dots.
- `--font-mono`, `--text-code`, line-height `1.6`.
- Inline code: `--paper-edge` background, `0.1rem 0.3rem` padding, `border-radius: 2px`. Used for short identifiers only; long snippets become blocks.
- Filename, if shown, appears as a small mono caption ABOVE the block in `--ink-soft`, not inside it.

### Images

- Photographic content (Sam, project shots) sits inside a `1px solid --rule` frame at `--space-2` padding, so the image looks pinned to the page like a polaroid taped into a notebook.
- No `border-radius` on photographs (notebook photos are rectangular). Avatars are the one exception and may be circular.
- No drop-shadow under images. The frame does the elevation work.
- Decorative images: none. We do not need a hero photo, a pattern, or a decorative shape. If an image is on the page, it's because it carries information.

### Tables / data

- `--text-small`, `--font-mono` for numeric columns, `--font-sans` for label columns.
- Header row: `border-bottom: 1px solid --ink` (heavier than the body rules).
- Body rows: `border-bottom: 1px solid --rule-faint`. No striped rows. No hover highlight unless rows are interactive.

---

## Iconography

- We do not commit to an icon system. Most pages do not need icons. The few that do (GitHub link, LinkedIn link, email link in the footer) use **inline SVG glyphs at `1em` size, `currentColor` fill, `1.5px` stroke when stroke-based.**
- No icon font (`@heroicons/react` is currently in dependencies; remove during the rebuild unless one specific page genuinely needs an icon set).
- Icon-only buttons get `aria-label`.

---

## Motion

The brief is "subtle and purposeful only." The system enforces this with two rules: a tight duration ceiling and an explicit easing whitelist.

### Easing

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);   /* default for everything */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);   /* for the one entrance animation */
```

No bounce. No elastic. No `ease-in-out` (it feels mechanical). No `linear` (it feels mechanical) — except for the matrix-rain-style canvases that we are not building.

### Durations

| Use | Duration |
|---|---|
| State change (link hover, button hover, focus ring) | `120ms` |
| Page-level entrance (name on home page, the one allowed entrance motion) | `600ms` |
| Form field focus transition | `150ms` |
| Anything else | does not exist |

Total motion budget for the entire site is one entrance and a handful of 120ms state transitions. No scroll-triggered reveals. No "fade up on scroll." No parallax. No floating elements. The Matrix-rain background in the current codebase is removed.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The home page entrance is replaced with an instant render under reduced-motion. Nothing else needs to change because nothing else animates.

---

## Imagery

The brief implies very little imagery (this is a personal-site portfolio, not a hotel landing page). What we will use:

- **One photo of Sam** on the About page. Framed per the image spec above.
- **One photo per featured project,** if the project has one (the FakeStackOverflow poster, the HackBeanPot group shot). Otherwise nothing — a colored placeholder is worse than no image.
- **No decorative photography.** No "person typing on laptop" stock. No abstract gradient banners. No hero photo on the home page.

Alt text follows the voice: specific and dry. "Sam at the HackBeanPot 2024 closing ceremony" beats "Group photo."

---

## Implementation notes

### Tailwind

Keep Tailwind, but slim it down. The current `tailwind.config.js` overrides the `sans` font with Playfair Display (a display serif as the body sans — a bug). Replace with:

```js
fontFamily: {
  serif: ['"Source Serif 4"', 'Iowan Old Style', 'Georgia', 'ui-serif', 'serif'],
  sans:  ['"iA Writer Quattro"', 'Söhne', '"Helvetica Neue"', 'Arial', 'ui-sans-serif', 'sans-serif'],
  mono:  ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'ui-monospace', 'monospace'],
},
colors: {
  paper:      '#FAFAF8',
  'paper-edge': '#F2F2EE',
  ink:        '#1B1F26',
  'ink-soft': '#4D525B',
  'ink-muted': '#888C94',
  rule:       '#D5D6D9',
  'rule-faint': '#E5E6E8',
  accent:     '#3F5A82',
},
```

CSS custom properties are the source of truth — define them in `src/index.css` `:root` and have Tailwind tokens reference them via `theme.colors`. This keeps theming overrideable in one place.

### Removals during the rebuild

- `framer-motion` stays (one entrance animation justifies it) — but is used at one site, not seven.
- `axios` removed (only usage is the IP-logging endpoint, which is removed).
- `@heroicons/react` removed unless a future page proves a need.
- `tailwind-variants` removed unless a real reusable component pattern emerges (it's currently a dep with zero imports).
- `"i": "^0.3.7"` removed (bogus dep).
- `src/App.css` deleted (Vite-starter leftovers).
- `src/pages/About.css` deleted (duplicated, unused).
- The Uiverse copy-paste `.card`/`.box1-4` styles in `src/index.css` removed entirely.
- `src/components/shared/HackerBackground.tsx` deleted.
- `src/components/GradientParagraph.tsx` deleted (gradient-text ban).
- `src/components/ProjectCard.tsx` deleted (card ban).
- `src/components/shared/spacing.tsx` deleted (gradient-text + per-letter animation, both off-brief).
- `src/pages/other.tsx` deleted, route removed.

### Fonts

- Source Serif 4 + JetBrains Mono: loaded via Google Fonts with `&display=swap`, preconnect to `fonts.gstatic.com`, preload the `400` weight of Source Serif 4 only.
- iA Writer Quattro: self-host the four weights (Regular, Italic, Bold, Bold Italic) as `woff2` under `public/fonts/` and define `@font-face` rules with `font-display: swap` and `size-adjust`/`ascent-override` set so the fallback (Helvetica Neue) doesn't shift on swap.

---

## Pattern bans (specific to this project)

In addition to the impeccable absolute bans (side-stripe borders, gradient text, glassmorphism, hero-metric template, identical card grids, tracked uppercase eyebrows above every section, numbered section markers, text-overflowing-container), this project also bans:

- **Any `card` pattern.** Sections are separated by space or rule, never by a bounded surface.
- **Any shadow.** No `box-shadow` anywhere in the codebase. Elevation is replaced by ruled lines and whitespace.
- **Any gradient.** Not on text, not on backgrounds, not on borders. Two colors meet at a hard edge or they don't meet.
- **Any `backdrop-filter: blur`.** The paper metaphor breaks if surfaces blur.
- **Dark mode.** Not added. The brief is paper; paper is light.
- **All-caps eyebrow labels above every section.** One mono caption above one section is voice; two is the pattern, and the pattern is banned.
- **Animated text** (per-letter reveals, typing effects, gradient slides). The hero name renders at once; the only motion is a 600ms opacity+y fade on the whole hero block.
- **Auto-playing canvas backgrounds.** No Matrix rain. No particle fields. No noise textures.
- **Visited-link color shifts.** Visited = unvisited; this is not Wikipedia.

---

## Verification checklist

Before any page or component ships, verify:

1. Zero `box-shadow` declarations in the diff.
2. Zero `background: linear-gradient` or `background-image: gradient` declarations.
3. Zero `border-radius` greater than `4px` on a non-image element (cards have rounded corners; we don't have cards).
4. Every color value resolves to a token in this document; no inline `#xxxxxx` literals outside `index.css`.
5. Every font-family string resolves to one of the three families.
6. Every animation has a reduced-motion alternative.
7. Body text contrast passes 4.5:1 against `--paper`.
8. The page reads cleanly with images turned off (the design does not depend on decoration).
9. At `320px` viewport width, no heading overflows; at `1920px`, the content column does not stretch beyond its measure.
