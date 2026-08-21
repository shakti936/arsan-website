# 11 — Open Questions

**Last updated:** 2026-08-20

Resolved items move to [01-decision-log.md](01-decision-log.md) with their reasoning.

## Blocking

| # | Question | Blocks | Asked |
|---|---|---|---|
| Q-16 | **Portal conflict** — website P3 assumes a candidate portal; AIOS lists portals as an explicit non-goal of its first slice. Who owns candidate-facing data and auth? | P3, and the "For Candidates" nav in the mockups | 2026-08-20 |
| Q-17 | **Repo topology** — monorepo with AIOS, or two repos against one Supabase project? | Where P1 code lives | 2026-08-20 |
| ~~Q-14~~ | ~~**Which ATS is canonical**~~ — Drew's job-centric `arsan-aios`, or Marianna's mandate-centric AIOS? **Answered 2026-08-20:** `aios-arsancg` is canonical (D-020). | — | 2026-08-20 |
| Q-15 | **What does "unify the two" mean** — one monorepo, two repos against one database, or merge the two schemas into one system? | Repo structure | 2026-08-20 |


| # | Question | Blocks | Asked |
|---|---|---|---|
| Q-01 | ~~Internal system repo~~ — **partially answered 2026-08-20** by direct inspection of the AIOS Supabase project. Still want the repo itself for server-side logic, migrations, and the requirements doc behind `arsan_requirements`. | P2/P3 detail | 2026-08-20 |
| Q-10 | **Integration boundary decision** — does the site read AIOS via server-only credentials, hold a browser anon key, or run its own Supabase project fed by AIOS domain events? | All data-backed pages | 2026-08-20 |
| Q-11 | **Where do website submissions land?** AIOS has no inbound-application model. Needs a write-only landing table in AIOS that internal triage promotes to `candidates`. | Resume upload, apply flow | 2026-08-20 |
| Q-12 | **Candidate-facing auth doesn't exist in AIOS** (`profiles`/`memberships` are staff-only). Does P3 add candidate auth to AIOS, or does the site own it separately? | P3 portal | 2026-08-20 |
| Q-13 | **The requirements doc** behind the `arsan_requirements` table — phases, human checkpoints, accountable owners. Likely answers several questions above. | Phase planning | 2026-08-20 |
| Q-02 | **Reference images** for visual direction, plus one line each on what to take from them (layout / type / color / motion / vibe). | Design system; P1 build | 2026-08-20 |

## Non-blocking (needed before P1 ships)

| # | Question | Blocks | Asked |
|---|---|---|---|
| Q-03 | **Deploy & DNS** — what is arsancg.com currently hosted on, and who controls DNS? | Cutover plan | 2026-08-20 |
| Q-04 | **Copy** — port existing copy as-is, or rewrite? Rewrite requires research context (offer, audience, competitors, voice samples) per house rules. | Content build | 2026-08-20 |
| Q-05 | **Spanish copy timing** — does ES launch with EN, or does the architecture ship with EN-only content first? Architecture is identical either way. | Launch scope | 2026-08-20 |
| Q-06 | **Proof points** — are the 30+ years / 99% / 100+ stats substantiated, and are there named client logos, case studies, or reviews we can use? Current site has very little. | Copy credibility | 2026-08-20 |

## Deferred

| # | Question | Revisit at |
|---|---|---|
| Q-07 | Auth method for the portal (magic link vs. LinkedIn OAuth vs. password) | After internal repo review — that system may already decide it |
| Q-08 | Whether P4 (employer/admin surface) is needed at all, or already covered by the internal system | After internal repo review |
| Q-09 | Analytics/tracking stack | Before cutover |
