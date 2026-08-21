# 09 — Content & i18n

**Last updated:** 2026-08-20

## Locales

| Locale | Code | Status |
|---|---|---|
| English (US) | `en` | Primary |
| Spanish (MX) | `es` | Built for from day one (D-005); copy timing TBD |

**Why day one:** ARSAN's entire positioning is bilingual, bi-cultural US–Mexico. Locale
routing and message extraction are cheap to build now and expensive to retrofit — adding
them later means touching every route and component.

### Rules

- Locale-prefixed routes; `en` default
- Correct `hreflang` on every page, plus `x-default`
- No hardcoded user-facing strings in components — everything through message catalogs
- Spanish is **translation with localization**, not machine output. Manufacturing and
  recruiting terminology differs between US and MX usage.
- Metadata, JSON-LD, form validation messages, and error states are all localized too —
  these are the ones that get missed

**Implementation:** `next-intl` (provisional — verify against current Next.js App Router
docs at scaffold time; see [02-stack.md](02-stack.md)).

## Copy

**Status: OPEN — port existing copy vs. rewrite not yet decided.** See
[11-open-questions.md](11-open-questions.md).

Existing arsancg.com copy is thin. The full substance is roughly: "Expert One-on-One Career
Matchmakers," 30+ years, 99% placement success, 100+ projects, plus a services list. That's
not enough to fill a modern site, and it's not enough to rank or get cited.

If rewriting, research context is required first per house rules — offer, audience, desired
action, competitor positioning, brand voice samples. Never write cold.

### Banned in all copy

Filler ("leverage," "cutting-edge," "in today's world"), passive voice, feature-first
framing. Lead with the transformation, not the mechanism.

### Content inventory

| Page | EN | ES | Source | Status |
|---|---|---|---|---|
| Home | | | | ⬜ |
| Services | | | | ⬜ |
| Find a Job | | | | ⬜ |
| Reviews | | | | ⬜ |
| Get in Touch | | | | ⬜ |
| About | | | | ⬜ |

Where P1 content lives (typed content files vs. CMS): typed content files, per
[02-stack.md](02-stack.md). Revisit only if someone non-technical needs to edit.
