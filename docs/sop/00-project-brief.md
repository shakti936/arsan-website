# 00 — Project Brief

**Last updated:** 2026-08-20

## The client

**ARSAN Consulting Group** — bilingual, bi-cultural executive search and recruitment for
manufacturing and industrial companies across the USA and Mexico. Positions itself as
"Expert One-on-One Career Matchmakers." CEO: Armida Sanchez.

- **Services:** executive search & talent acquisition, nearshoring (access to skilled
  professionals in Mexico), corporate retreats & team building, 1:1 coaching and
  corporate mentorship
- **Buyers:** Fortune 100/500 and mid-market manufacturers hiring C-suite, executive,
  and professional-level roles
- **Industries:** automotive, aerospace, medical devices, pharma, electronics, chemicals,
  food & beverage, textiles, construction materials, heavy equipment, oil & gas
- **Claimed proof:** 30+ years experience, 99% placement success, 100+ projects

## Current site (rebuild target)

`https://www.arsancg.com/`

- **Nav:** Home · Services · Find a Job · Reviews · Get in Touch · About Us (links to LinkedIn)
- **CTAs:** Contact Us · Become a Candidate · Submit My Resume
- **Assessment:** thin on substance. Real proof points are limited to the three stats
  above. Content depth is a known gap, not just a design problem.

## What we're building

A rebuilt public site that is also the **front door to a separate internal system**
(own repo, provided by Drew) which owns jobs, candidates, and internal workflow. The
public site is a **client** of that system — it does not own the canonical schema.

### Phase plan

| Phase | Contents | Status |
|---|---|---|
| **P1 — Foundation + marketing site** | Repo scaffold, design system, i18n routing, motion, SEO, GHL-backed contact/lead forms, all public marketing pages | Not started |
| **P2 — Job board** | Public job listings + detail routes, filtering, apply flow with resume upload | Not started |
| **P3 — Candidate portal** | Auth, candidate profile, application status | Not started |
| **P4 — Employer / admin surface** | Scope TBD — depends on what the internal system already covers | Not started |

Each phase gets its own spec and implementation plan. Phases are shipped, not just built.

## Success criteria (P1)

- Lighthouse: LCP < 2.5s · INP < 200ms · CLS < 0.1
- WCAG 2.2 AA
- EN and ES routes both resolve with correct `hreflang`
- Every form submission lands in GHL, with a verified failure/notification path
- Nothing in P1 needs a refactor to add P2/P3 on top
