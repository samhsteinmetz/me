# Product

## Register

brand

## Users

The primary visitor is a recruiter or hiring manager — someone reviewing the site as part of evaluating Sam for a software role. They are skimming, not reading; they have eight tabs open; they have already seen forty portfolios this week.

Secondary visitors are peers in software (former classmates, collaborators, the occasional referrer following a link from LinkedIn or GitHub) and curious strangers (friends of friends, people Sam has met once). The site should not actively exclude them, but the structure is shaped for the recruiter case: who Sam is, what he has shipped, how to reach him — in that order, without theatrics.

The job to be done, in the recruiter's words: *"In two minutes, decide whether this person is worth a thirty-minute screen."*

## Product Purpose

A personal site for Samuel Steinmetz that makes the case for hiring him without making the case feel like sales. The site exists because LinkedIn doesn't tell a story and a PDF résumé can't show work; this is the canonical place where his work, his interests, and his contact channels live in one place under his own control.

Success looks like a recruiter spending ninety seconds on the site and coming away with: (1) a clear sense of what kind of engineer Sam is, (2) confidence that the projects on display were really shipped and really his, and (3) a low-friction way to reach out. Vanity metrics — time on page, scroll depth, animation polish — are not the goal. Reply rate on outreach is.

## Brand Personality

Three words: **quiet, considered, dry.**

- **Quiet** — short sentences, few headings, no exclamation marks. The page does not announce itself. If something is impressive, it is stated plainly; the visitor draws the inference. Hype is the absence of evidence.
- **Considered** — every word, line, and spacing decision has been thought about. Nothing is there by default. The notebook is the metaphor: a smart person carries a Field Notes book, not a leather portfolio, because the contents matter and the container should disappear.
- **Dry** — warmth shows up through specificity and the occasional plain joke, not through tone-shifting copy. No "Hi friend! 👋" energy. No "Let's build something amazing together!" CTAs. When personality leaks in, it leaks in at the level of word choice, not at the level of decoration.

Emotional goal: the visitor finishes the page and thinks *"this person is calm and pays attention to things,"* before they think *"this person can code."* The technical credibility follows from the carefulness of the site itself, not from a `<Skills />` grid.

## Anti-references

Three explicit avoidance targets, plus one watch-list.

1. **The generic dev-portfolio template.** Dark mode with neon green or cyan accents. Animated typing hero ("Hi, I'm X, a full-stack developer"). Identical project cards in a three-column grid. Tailwind-UI defaults. A "Skills" section that is a colored bubble for every language. The current state of this codebase is, regrettably, exactly this. The new version is its opposite.
2. **SaaS landing page applied to a person.** Hero with big headline + subhead + primary CTA. Three-column feature grid. Testimonials. Logo wall. A person is not a product; the page should not pitch.
3. **Brutalist or aggressively quirky personal sites.** Helvetica caps everywhere. Intentionally "broken" layouts. Unreadable type as personality. Cursor-tracking blobs. The opposite over-design from #1, equally unserious for the recruiter context.

**Watch list (not in the user's explicit avoids, but worth naming so we don't drift into it):**

- **The editorial-typographic / Klim-magazine lane.** Display serif italic headlines, small mono labels above every section, three-column ruled grids, monochromatic restraint pretending to be a magazine cover. Sam's brief — serif headings, monochrome, ruled lines, generous margins — is one careless step away from this saturated AI-design family. The differentiator is *personal-notebook handmade*, not *magazine specimen page*. If a section starts looking like a Stripe-press-kit page, it has drifted; pull it back toward the notebook.

## Design Principles

Five principles, ordered from most-load-bearing to least. Subsequent design decisions inherit these.

1. **Restraint is the voice.** Color, motion, and ornament are punctuation, not paint. One accent color, used like a bookmark. One small entrance motion, not a choreography. The default state of any new element is "do less." If a section needs more attention, it earns it through hierarchy and word choice, not through chrome.

2. **The page is a document, not a pitch.** Treat the visitor as a reader. No CTAs disguised as content. No urgency. No "let's build something amazing." Section endings should feel like the end of a paragraph, not the end of a sales funnel. The Contact page is a way to write to a person; it is not a lead capture form.

3. **Specifics earn their place; generalities don't.** A project listed with a real outcome ("won 1st at the Whitehall Hackathon, built the Twitter→GPT pipeline in 36 hours") beats five projects listed for completeness. If a line could appear on anyone's site, cut it or rewrite it as something only Sam could write. "Hi! I'm a CS student" is the failure mode; "I am the kind of person who reads about Model Context Protocol on Saturdays" is the success.

4. **The chrome stays out of the way.** Navigation, layout, and spacing should be invisible to a reader and obvious to a designer. The visitor should never think about the nav bar; they should only know it is there when they look for it. No persistent banners. No floating CTAs. No scroll progress indicators. The content is the design.

5. **Handmade is not the same as messy.** The notebook reference is about considered imperfection — a real notebook is meticulously kept, not scribbled in. Hand-feel comes from specificity (rule lines instead of card shadows, real text instead of lorem-ipsum-shaped bullet lists, an actual photograph instead of a placeholder gradient), not from literal sketchiness, hand-drawn fonts, or fake-paper textures. Quiet authority, not artisan affectation.

## Accessibility & Inclusion

- **Target:** WCAG 2.1 AA across the entire site. AAA on body copy where the off-white background allows it without forcing a stark pure-black.
- **Color contrast:** Body ink against the `#FAFAF8` background must hit ≥4.5:1; the accent must hit ≥3:1 for large text and ≥4.5:1 for inline links. Pure decorative elements (rule lines, image borders) can sit below 3:1 since they carry no information.
- **Reduced motion:** Every animation must have a `prefers-reduced-motion: reduce` alternative. Default to instant or crossfade. The Matrix-rain canvas in the current codebase is removed; nothing like it returns.
- **Keyboard:** Every interactive element gets a visible focus ring (the accent color at 2px offset). The current site has no `:focus-visible` styling; the new one does, everywhere.
- **Type sizing:** All sizes in `rem`, never `px`. The base of `1rem` respects user browser settings; nothing should disable zoom or break at 200%.
- **Touch targets:** 44×44 minimum on phone. Most of the site is reading, not tapping, but contact links and nav must clear this.
- **Screen reader:** Image alt text describes the information ("Sam at the HackBeanPot 2024 awards"), not the file. Decorative images get `alt=""`. Icon-only buttons get `aria-label`.
- **No color-only signal:** Links must be distinguishable from body text without relying on color alone — an underline, a weight shift, or a hover state, in addition to the accent color.

## Production Notes

Things downstream commands should assume:

- **Single primary entry:** `/` is the home; `/me` continues to alias home for legacy GitHub Pages reasons but should be quietly retired in copy. The `vite.config.ts` base URL is currently broken (`https://samhsteinmetz.github.io/me` is a full URL, not a path); it needs to become `/me/` or `/` depending on the final deploy strategy.
- **Routes:** Home, About, Projects, Contact. Drop the `/other` route entirely — it shipped a personal message to production.
- **Stale data:** Copy currently says "junior" and "summer 2025 internship search" — that horizon has passed; refresh the language during the rebuild.
- **Existing privacy issues:** The Home page currently posts the visitor's IP to a public mockapi.io endpoint with no notice. Remove it. The Contact form posts to the same endpoint; replace with a real form handler or `mailto:` before relaunch.
