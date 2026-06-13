---
target: src/pages/Home.tsx
total_score: 35
p0_count: 0
p1_count: 2
timestamp: 2026-06-13T04-51-37Z
slug: src-pages-home-tsx
---
# Home — Critique

## Anti-Patterns Verdict
LLM: Does not look AI-generated. Notebook treatment committed: paper, ink, one accent, em-dash bullets, polaroid frames, ruled breaks, mono metadata. Risk lanes (editorial-typographic; photo-floated-right composition) brushed but not failed.
Detector: 1 false-positive (single-font on index.html; detector can't see @font-face in index.css).
Visual overlays: not available (no browser injection).

## Design Health Score: 35/40 (Good)

## Priority Issues
- [P1] Heavy image payload (group 1.78 MB, me 397 KB on first scroll). → /impeccable optimize
- [P1] iA Writer Quattro woff2 files missing from public/fonts/. Body text falling back to Helvetica Neue. → manual
- [P2] Mobile nav layout risk at 320px (no hamburger). → /impeccable adapt
- [P2] Nav touch targets <44px on mobile. → /impeccable adapt
- [P3] Hero photo float-right is the AI-default composition. → /impeccable layout

## Persona Red Flags
- Casey (mobile): heavy images + cramped nav
- Recruiter: experience list parity break (only MHCPS/Panorama have one-line context)
