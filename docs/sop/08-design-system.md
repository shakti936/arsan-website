# 08 — Design System

**Last updated:** 2026-08-20 · **Status:** BLOCKED on reference images from Drew (D-007).

## Direction

Reference-image driven. Not a from-scratch identity, not an evolution of the current
arsancg.com look. Drew supplies the references; this file records what was pulled from each.

### Reference images

Drop into `refs/` in the repo root. For each one, record **what** we're taking from it —
"the layout," "the type pairing," "the motion," "the color restraint" — not just "looks good."

| Image | Taking from it | Notes |
|---|---|---|
| _(pending)_ | | |

## Tokens

Filled in once direction is set. All tokens live in the Tailwind config — **never
hardcoded hex in components**. Tailwind palette or `oklch()`.

| Token group | Values | Status |
|---|---|---|
| Color — brand | TBD | ⬜ |
| Color — surface / text | TBD | ⬜ |
| Color — semantic (success/error/warn) | TBD | ⬜ |
| Type scale (fluid, `clamp()`) | TBD | ⬜ |
| Font families (`next/font`) | TBD | ⬜ |
| Spacing scale | Tailwind default unless a reason appears | ⬜ |
| Radii / shadows | TBD | ⬜ |

## Motion language

Framer Motion. Rules that hold regardless of direction:

- **Every animation gates on `prefers-reduced-motion`** and degrades to no motion
- Motion serves hierarchy and feedback, not decoration
- Nothing that animates may cause layout shift (CLS < 0.1) or block INP
- Entrance animations on scroll: one shared pattern, not per-section improvisation

| Interaction | Treatment | Status |
|---|---|---|
| Section entrance | TBD | ⬜ |
| Hover / focus states | TBD | ⬜ |
| Page transitions | TBD | ⬜ |
| Loading / skeleton | TBD | ⬜ |

## Accessibility floor

WCAG 2.2 AA. Contrast checked against **final** token values, not intentions. Visible
focus state on every interactive element. Never color alone.

## Conversion rules (carried into every page)

- Above the fold: fast load + one clear CTA
- One primary CTA per section; specific action verbs ("Book a Call," "Submit My Resume" —
  not "Learn More")
- Trust signals near CTAs (the 30+ years / 99% / 100+ stats, plus reviews)
- Outcome-focused headlines, not feature lists
