---
target: src/pages/Projects.tsx
total_score: 35
p0_count: 0
p1_count: 1
timestamp: 2026-06-13T04-51-48Z
slug: src-pages-projects-tsx
---
# Projects — Critique

## Anti-Patterns Verdict
LLM: Clean. Four project sections read as notebook entries. Code blocks treated correctly (mono filename caption above paper-edge block, no fake-Mac chrome). No AI tells visible.
Detector: 0 findings.
Visual overlays: not available.

## Design Health Score: 35/40 (Good)

## Priority Issues
- [P1] Same heavy image issue: stackchatterflow 3.72 MB, group 1.78 MB. → /impeccable optimize
- [P2] Inconsistent date metadata across the 4 projects (only HackBeanPot has year in title). → /impeccable clarify projects
- [P2] Code blocks scroll horizontally on mobile (longest line 99ch). Acceptable trade-off.
- [P3] No live-demo links, only GitHub.
- [P3] Project ordering is unmotivated; mix chronology and strength.

## Persona Red Flags
- Recruiter: date inconsistency hurts the "is this recent" scan
- Casey (mobile): 5.5+ MB of images + horizontal scroll on code
