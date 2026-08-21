# 11 — Open Questions

**Last updated:** 2026-08-20

Resolved items move to [01-decision-log.md](01-decision-log.md) with their reasoning.

## Blocking

| # | Question | Blocks | Asked |
|---|---|---|---|
| Q-01 | **Internal system repo** — local path or GitHub URL. Needed to determine schema ownership, whether it exposes an API, where auth lives, and whether canonical jobs/applications tables exist. | Integration boundary; all of P2/P3 | 2026-08-20 |
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
