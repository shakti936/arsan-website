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

## Editing page copy (from 2026-08-22)

Every user-facing string on every page is editable in the Studio, in two ways:

**Click-to-edit.** `/studio` → **Presentation** → **flip the `Edit` toggle on**, top-left
next to the address bar. That toggle is what makes the page clickable; with it off nothing
responds. It is a per-user browser setting and sticks once flipped — Sanity offers no way
to default it on (D-100).

Then click any headline or paragraph and its box opens on the right. This is text editing,
not layout editing — sections cannot be reordered or moved, which is deliberate (D-099).

**Form editing.** `/studio` → **Structure**, then one of three groups:

| Group | What is in it |
|---|---|
| **Pages** | One entry per page with a URL — Home, For Clients, Contact, ... |
| **Repeated blocks** | Bits that appear on many pages — the "Let's talk" band, the newsletter sign-up, the team row |
| **Whole site** | Menu & header, footer, form labels, error messages, site title |

Boxes are labelled by what a visitor sees — "Headline — the highlighted words", "Main
button" — and each section is named after its own heading, so `Chooser` reads as
*The "What talent challenge are you facing?" block*.

### How the layers fit

```
messages/en.json  ─┐
                   ├─ deep merge in src/i18n/request.ts → useTranslations()
Sanity copy docs  ─┘   (Sanity wins; catalogue fills every gap)
```

The catalogue defines **which keys exist**; Sanity supplies **values**. Adding a *new*
string is still a code change — add it to `messages/*.json`, run `bun run generate:copy`
and `bun run seed:copy`. Changing the wording of an existing one is not.

If Sanity is unreachable the catalogue renders alone, so the site cannot be taken down by
the CMS.

### Spanish

Write English and press **Translate to Spanish**. The Spanish lands in the *draft* for
review, never straight to live.

It will not overwrite Spanish you wrote by hand. The rule is exact: a string the machine
produced and whose English has since changed is regenerated; a string you edited yourself
is yours permanently, whatever happens to the English. So correct a translation freely —
that correction is durable.

Requires `ANTHROPIC_API_KEY` and `SANITY_API_WRITE_TOKEN` on the server. Without them the
action says so and changes nothing; everything else still works.

### Commands

| Command | What it does |
|---|---|
| `bun run generate:copy` | Regenerates the 34 Studio schemas from `messages/en.json`. Run after adding a key. |
| `bun run seed:copy --dry-run` | Reports what would be created or backfilled. |
| `bun run seed:copy --ndjson > f.ndjson` | Emits documents for `bunx sanity dataset import f.ndjson --dataset production --missing` — uses your own CLI login, no write token. |
| `bun run seed:copy` | Same, writing directly. Needs `SANITY_API_WRITE_TOKEN`. Never overwrites existing values. |
