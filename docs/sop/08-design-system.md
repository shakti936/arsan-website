# 08 — Design System

**Last updated:** 2026-08-20 · **Status:** references received (6 full-page mockups).
Direction not yet chosen — the references contain **two different visual systems**.

## Reference images

All in `refs/`, tracked in git. These are AI-generated mockups, so **the visual direction
is signal and the written content is placeholder** — names, titles, client logos, and stats
in them are invented and must not be trusted (see Conflicts below).

| File | Shows | Taking from it |
|---|---|---|
| `Home1.png` | Homepage, **Direction A** | Full homepage section order; hero split; logo wall; 3-card "talent challenge" chooser; team row; insights row |
| `clients main page.png` | For Clients landing, Direction A | Landing-page pattern for a top-level section |
| `ChatGPT ... 06_10_41 PM (1).png` | Executive Search service page, Direction A | Service-page template: process cards, pull-quote band, function grid, story cards |
| `ChatGPT ... 06_10_41 PM (2).png` | Mexico Advisory service page, Direction A | Second service-page variant; featured case study with stat row |
| `ChatGPT ... 05_56_21 PM.png` | All five mega-menu panels | **The information architecture** — this is the most valuable of the six |
| `ChatGPT ... 06_11_19 PM.png` | Homepage, **Direction B** | Alternative palette and nav treatment |

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

**Exact hex values are sampled from the chosen mockup at build time, then contrast-checked
against WCAG 2.2 AA before being written into the Tailwind config.** Not eyeballed.

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
