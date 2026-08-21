# 08 — Design System

**Last updated:** 2026-08-20 · **Status:** **Direction A approved by Drew.** All mockup
content (names, logos, stats, job listings) confirmed as mock data — visual direction only.

## Reference images

All in `refs/`, tracked in git. These are AI-generated mockups, so **the visual direction
is signal and the written content is placeholder** — names, titles, client logos, and stats
in them are invented and must not be trusted (see Conflicts below).

Renamed 2026-08-20 for legibility (Drew's request):

| File | Shows | Taking from it |
|---|---|---|
| `dirA-home-v2.png` | Homepage, **Direction A** | Full homepage section order; hero split; logo wall; 3-card chooser; team row; insights row. **Palette + type sampled from this file.** |
| `dirA-for-clients-landing.png` | For Clients landing | Landing-page pattern for a top-level section |
| `dirA-service-executive-search.png` | Executive Search service page | Service-page template: process cards, pull-quote band, function grid |
| `dirA-service-mexico-advisory.png` | Mexico Advisory service page | Second service-page variant; featured case study with stat row |
| `dirA-meganav-all-panels.png` | All five mega-menu panels | **The information architecture** — most valuable reference |
| `dirA-for-candidates-landing.png` | For Candidates landing | Candidate-side landing; trust strip; 4-card chooser. *P2+ surface (D-023 gate)* |
| `dirA-job-board.png` | Job board with search/filters/alerts | The P2 job-board spec in visual form. *Gated on AIOS scope change* |
| `dirB-home-rejected.png` | Homepage, Direction B | **Rejected 2026-08-20.** Kept as record of the decision |

## The two directions

Both share: deep navy base, serif display type with an italic emphasis word, letterspaced
uppercase eyebrows/buttons, generous whitespace, card grids, thin rule under headings.

| | **Direction A** (4 mockups) | **Direction B** (1 mockup) |
|---|---|---|
| Accent | Gold / brass — buttons, italics, eyebrows | Deep green / teal — solid buttons with arrows |
| Page bg | Warm off-white | Cooler off-white |
| Nav | Flat text links, gold outline CTA | Chevron dropdowns, solid green CTA |
| Band | Teal-green CTA band | Navy CTA band |
| Logo lock-up | "EXECUTIVE SEARCH & MANUFACTURING TALENT ADVISORY" | "TALENT ADVISORS TO MANUFACTURING LEADERSHIP" |
| Feel | Warmer, older-money, closer to Korn Ferry / Egon Zehnder | Cooler, more contemporary/tech-adjacent |

## Palette — sampled from `dirA-home-v2.png` with ImageMagick, 2026-08-20

| Token | Hex | Sampled from | Contrast notes (WCAG 2.2) |
|---|---|---|---|
| `navy-900` | `#061E39` | Hero/nav background | White on it: 16.77 ✓ |
| `navy-950` | `#001A36` | Footer | — |
| `brass-500` | `#A2865A` | Buttons, italic display words | On navy 4.87 ✓ AA · **on cream 3.23 — large/bold text only, never body** |
| `teal-900` | `#003439` | CTA band | White on it: 13.55 ✓ |
| `cream-50` | `#F9F7F6` | Warm section background | Navy on it: 15.70 ✓ |
| `white-warm` | `#FEFEFA` | Page background | — |

Button text: navy-on-brass 4.87 ✓. Full scale (tints/shades) derived at token time in
`globals.css` `@theme` — **Tailwind 4 CSS-first, no JS config.**

## Information architecture (from the mega-menu mockup)

Far larger than the current arsancg.com. Five top-level sections, each with a landing page
and a mega-menu panel with a featured item:

| Section | Menu items |
|---|---|
| **For Clients** | Executive & Professional Search · Mexico Expansion & Workforce Advisory · Enterprise Talent & Leadership Solutions |
| **For Candidates** | View Opportunities · Submit Your Profile · Candidate Experience · Join Our Talent Network · Career Resources |
| **Results** | Case Studies · Representative Searches · Client Outcomes · Testimonials |
| **Insights** | Latest Perspectives · Manufacturing Talent · Mexico Insights · Podcast & Video · Reports & Guides |
| **Why ARSAN** | Our Difference · Our People · How We Work · Our Story |

Persistent CTA: **"Discuss a Search."** Footer repeats all five columns.

**Note:** "View Opportunities" and "Submit Your Profile" are the P2/P3 surfaces. The
mega-menu is designed around a job board and candidate intake that do not exist yet in
AIOS — see [07-integrations.md](07-integrations.md).

## Repeatable section patterns

Worth building as components rather than per-page markup:

1. Split hero — headline with gold/green italic emphasis word, subhead, two CTAs, region eyebrow (`U.S. · MEXICO · CROSS-BORDER`), photo bleeding to the right edge
2. Logo wall with a centered eyebrow line
3. Three-card chooser ("What talent challenge are you facing?") — circular icon, title, category label, body, arrow link
4. Icon row — 4-5 items, thin vertical dividers
5. Story/case-study card grid — image, category eyebrow, headline, body, "Read the story →"
6. People row — portrait, name, title, one-line bio, "View profile →"
7. Insights row — image, category or date, headline, "Read article →"
8. Full-bleed pull-quote band on navy
9. Closing CTA band with oversized watermark "A"
10. Five-column footer

## Conflicts in the references — cannot ship without resolution

The mockups disagree with each other on **facts**, not just styling:

| Fact | Direction A says | Direction B says |
|---|---|---|
| Armida | Armida **Sánchez**, Managing Partner | Armida **Sanchez**, Founder & CEO |
| Second person | Marianna **Duran**, Partner, Mexico Practice | Marianna **Duarte**, Director of Operations |
| Third person | Manuel **Chavez**, Partner | Manuel **Cabrera**, Senior Talent Acquisition Partner |
| Client logos | Jabil, Phillips, Dover, Linamar, Amphenol, TE, Magna | BAC, TE, ConMet, Aletek, ITW, Genie, Amsted, Crane |
| Entity | "© 2024 ARSAN" | "© 2025 ARSAN International Consulting Group" |

**Client logos are the serious one.** Publishing a manufacturer's mark implies an
endorsement. Every logo needs to be a real client with documented permission, or the wall
becomes a legal and credibility problem. Same applies to the case studies and the stat
claims in the mockups — all invented by the image generator.

## Motion language

Framer Motion. Rules that hold regardless of direction:

- **Every animation gates on `prefers-reduced-motion`** and degrades to no motion
- Motion serves hierarchy and feedback, not decoration
- Nothing that animates may cause layout shift (CLS < 0.1) or block INP
- One shared scroll-entrance pattern, not per-section improvisation
- This is an executive-search brand — restraint reads as senior. Slow, small, few.

## Accessibility floor

WCAG 2.2 AA, checked against final token values. Watch specifically: gold on navy, and the
small letterspaced uppercase labels used throughout — both are contrast risks at the sizes
shown in the mockups.
