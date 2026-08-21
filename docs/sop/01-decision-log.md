# 01 — Decision Log

Append-only. Newest at the bottom. A decision is not made until it's here.

Format: `ID · date · decision · why · alternatives rejected`

---

### D-001 · 2026-08-20 · Rebuild arsancg.com from scratch
Full rebuild rather than incremental improvement of the existing site.
**Why:** existing site is thin and is being repositioned as the front door to a new
internal system. **Alternatives rejected:** patch the current site (doesn't support the
portal direction).

### D-002 · 2026-08-20 · Stack: Next.js (App Router) + TypeScript strict + Tailwind + Framer Motion + Bun
**Why:** specified by Drew, and matches the standing house stack. Server Components by
default keeps JS shipped to the browser near zero on marketing pages; Framer Motion
covers the motion requirements with a `prefers-reduced-motion` escape hatch.
**Alternatives rejected:** none seriously considered — this is the house default.

### D-003 · 2026-08-20 · Scope includes a candidate/client portal, not just a brochure site
**Why:** Drew's call. The site is the public face of a real recruiting operation, not a
flyer. **Alternatives rejected:** brochure-only; brochure + job board.

### D-004 · 2026-08-20 · Data layer: Supabase for product data, GHL for CRM, synced
Supabase holds jobs/applications/resumes; GHL holds the contact record and owns all lead
communication (SMS, email, calls). **Why:** house rule — GHL is CRM system of record,
Supabase is product data; never conflated. **Alternatives rejected:** GHL-only (can't
model jobs); Supabase-only (loses CRM follow-up).

### D-005 · 2026-08-20 · Bilingual EN/ES built in from day one
Locale routing and message catalogs in P1, even if Spanish copy lands later.
**Why:** ARSAN's entire positioning is bilingual/bi-cultural US–Mexico; retrofitting i18n
means touching every route and component. Cheap now, expensive later.
**Alternatives rejected:** English-only; structure-now-content-later (kept as a fallback
if translation is slow — the architecture is identical either way).

### D-006 · 2026-08-20 · Phased delivery (P1→P4), each phase with its own spec and plan
**Why:** four independent subsystems in one spec produces a spec nobody can review and
locks in portal decisions before the marketing build teaches us anything.
**Alternatives rejected:** one big up-front spec; foundation-only-then-stop.

### D-007 · 2026-08-20 · Visual direction driven by reference images supplied by Drew
Not a from-scratch identity, not an evolution of the current brand.
**Status:** images pending. See [11-open-questions.md](11-open-questions.md).

### D-008 · 2026-08-20 · Jobs, auth, and candidate data are owned by a separate internal repo
The public site is a **client** of that system, not the owner of the schema. The
integration boundary (direct Supabase + RLS vs. an API the internal system exposes) is
undecided until that repo is reviewed.
**Why:** Drew is building the internal system separately; duplicating its schema here
would create two sources of truth. **Alternatives rejected:** site owns its own jobs
tables (guarantees drift).

### D-009 · 2026-08-20 · This SOP folder exists and is updated in real time
Location: `docs/sop/`. Rules in [README.md](README.md).
**Why:** Drew's request — capture tools, frameworks, packages, and prompts as we go so
the process is repeatable for the next client build.

### D-010 · 2026-08-20 · Project-root `CLAUDE.md` enforces SOP maintenance
Every session is instructed to log decisions, packages, prompts, and open questions as
they happen. **Why:** a SOP updated "at the end" is written from memory, and memory does
not survive context compaction. The rule has to live somewhere the harness reads on every
session start. **Alternatives rejected:** a PostToolUse hook on `package.json` changes
(more friction, can misfire — revisit if the CLAUDE.md rule proves too easy to skip);
relying on Drew to prompt for updates.

### D-011 · 2026-08-20 · Git initialized; SOP is the first commit
Repo initialized before any scaffolding. `.env.local` gitignored.
**Why:** the decision log is worth more with dates git can verify, and scaffolding
Next.js into an untracked directory means no clean diff of what the scaffold generated.
**Remote:** not yet created — deferred.

### D-012 · 2026-08-20 · Prompt log records decisions and turning points, not every message
`06-prompts.md` captures prompts that changed direction, produced real output, or failed —
verbatim, with the resulting lesson. Routine back-and-forth is omitted.
**Why:** a full transcript buries the reusable patterns. **Alternatives rejected:** log
everything verbatim; keep only distilled patterns with no context.

### D-013 · 2026-08-20 · SOP is ARSAN-specific for now
Not written as a reusable client-build template.
**Why:** extract the general playbook after one build actually finishes and we know which
parts held up. Generalizing before that is guessing.

### D-014 · 2026-08-20 · Internal system identified: Supabase project "AIOS"
Ref `aqonwletymrrukybyfzy`. Multi-tenant executive-search operating system, 40 objects,
schema complete and zero rows. Inspected read-only via PostgREST. Details and the three
findings that shape the website in [07-integrations.md](07-integrations.md).

### D-015 · 2026-08-20 · A `search` is not a job posting — publication must be an explicit act
AIOS `searches` are confidential client mandates carrying fee terms. The website will
never read them directly. Publishing a role to the public site requires a separate,
human-approved, public-safe record.
**Why:** publishing a search directly leaks client engagements and violates the
`confidential` / `selective_client_path` flags the schema already defines.
**Where it's built:** the AIOS repo owns the schema addition, not this one.
**Alternatives rejected:** filter `searches` by `confidential = false` on read (one
misconfigured row or policy publishes a client engagement — wrong layer for the guard).

### D-016 · 2026-08-20 · Site reaches AIOS through server-only credentials — no browser Supabase key
Server Components and server actions read/write AIOS with a server-only key. **No Supabase
credential is ever shipped to the browser.**
**Why:** AIOS holds candidate PII, `candidate_compensation` with legal disclosure gates,
and client fee terms across 40 tables. A browser anon key makes every RLS policy on every
table a public attack surface; one misconfiguration exposes the ATS. Server-only keeps one
source of truth without putting a credential on the public internet.
**Alternatives rejected:** browser anon key + RLS (blast radius); separate Supabase project
fed by domain events (strongest isolation, but a second project and a sync consumer to
build and monitor — revisit if the site ever needs data AIOS won't expose); build-time
static fetch (stale postings, deploy per publish).
**Note:** RLS is still required on every table regardless — this is defense in depth, not a
replacement.

### D-017 · 2026-08-20 · Website-driven schema additions are written as migrations in the AIOS repo
Claude writes them, in the AIOS repo, following that repo's existing migration and RLS
conventions. Two additions needed: a public-safe job-postings table (published by explicit
human approval from a `search`) and a write-only inbound intake table that triage promotes
to `candidates`.
**Why:** AIOS stays the sole owner of its schema. Two repos writing one schema means drift
and a migration-ordering problem the first time both change something.
**Blocked on:** the AIOS repo path. See [11-open-questions.md](11-open-questions.md) Q-01.

### D-018 · 2026-08-20 · P1 starts now, in parallel with the boundary work
The marketing site needs zero AIOS data. Scaffold and build proceeds while schema and
integration questions resolve.

### D-019 · 2026-08-20 · There are TWO ATS systems, not one — canonical system undecided
Discovered while looking for the internal repo.

| | **`TheContentLabsAI/arsan-aios`** (Drew's) | **AIOS Supabase project** `aqonwletymrrukybyfzy` (Marianna's) |
|---|---|---|
| Last activity | 2026-07-30 | created 2026-08-04 |
| Model | Job-centric ATS | Mandate-centric search OS |
| Tables | `jobs`, `applications`, `application_notes`, `candidates`, `clients`, `contacts`, `locations`, `onboarding_tasks`, `vendor_registrations` | 40 objects: `searches`, `search_candidates`, `search_agreements`, `aios_engines`, `arsan_requirements`, `domain_events`, `approvals`, `audit_events`, … |
| Overlap | **none** — zero shared table names | |

Drew's repo **has** the `jobs` and `applications` tables the website needs. Marianna's has
neither, but has the governance/event architecture. They model the domain incompatibly:
a `job` is a public posting; a `search` is a confidential client mandate.

**Status:** unresolved. Drew is obtaining collaborator access to Marianna's repo
(`aios-arsancg`, not on his account). The website cannot build any data-backed page until
one is named canonical — but P1 (marketing) is unaffected and proceeds (D-018).

**Correction to earlier note:** `TheContentLabsAI/arsan-aios` was cloned to
`/Users/imdrewrodriguez/Websites/arsan-aios` on the assumption it was the internal system.
It is not. Kept for reference pending the canonical-system decision.

### D-020 · 2026-08-20 · Canonical internal system is `shakti936/aios-arsancg` (ARSAN AIOS)
Cloned to `/Users/imdrewrodriguez/Websites/aios-arsancg`. Drew has collaborator access via
Marianna. **This supersedes the assumption in D-019** — `TheContentLabsAI/arsan-aios` is an
earlier, job-centric prototype and is **not** canonical.

**What it contains:**
- 26 Supabase migrations + 19 pgTAP test files — DB-first, with `arsan_rls`, append-only
  audit enforcement, a candidate stage machine, activation gates, domain-event contracts,
  and a delivery worker
- An internal Next.js app (`web/`): dashboard, clients, searches, search detail, login,
  bootstrap. Uses `@supabase/ssr`, shadcn + Base UI, `motion`, react-hook-form, Zod
- A full spec set: 11 numbered docs (product scope, domain model, state machines, roles,
  AI governance, security/privacy, build-readiness gates, acceptance criteria,
  architecture decisions, engine architecture, cross-engine handoffs) plus JSON specs for
  engine catalog, handoff contracts, and a requirements registry

**Two constraints it imposes on this project:**
1. `01_PRODUCT_SCOPE.md` lists **"Client or candidate portals"** as an *explicit non-goal*
   of the first slice, and states candidates/clients are external participants "not full
   internal users in the MVP unless ARSAN later approves portals."
2. It also lists **"Running migrations before the existing Supabase schema is documented"**
   as a non-goal — so D-017 (Claude writes migrations in AIOS) must go through that repo's
   build-readiness gates, not around them.

**Notes for whoever works in that repo:** the source tree sits under a doubled directory
name (`ARSAN_AI_OS_..._FINAL/ARSAN_AI_OS_..._FINAL/`) which its own npm scripts have to
path around; and it uses ESLint + shadcn, while this project's standard is Biome.

### D-021 · 2026-08-20 · CONFLICT: website P3 (candidate portal) is an AIOS non-goal
The website scope approved on 2026-08-20 includes a candidate/client portal, and the
reference mockups already advertise "View Opportunities," "Submit Your Profile," and "Join
Our Talent Network." AIOS's own spec excludes portals from its first slice.
**Unresolved.** Options: AIOS takes on the portal as a scope change through its governance
process; the website owns candidate-facing data in a separate store; or P3 is deferred.
See [11-open-questions.md](11-open-questions.md) Q-16.

### D-022 · 2026-08-20 · Two repos, one database
`arsan-website` (public) and `aios-arsancg` (internal) stay separate repos, both against the
AIOS Supabase project, with server-only credentials from the website (D-016). Generated DB
types are committed into this repo.
**Why:** the marketing site needs to ship fast; AIOS is deliberately gated by build-readiness
and approval processes. Putting a marketing site inside that governance slows it for no
benefit, and the shared-types problem is solved by committing generated types.
**Alternatives rejected:** monorepo under `aios-arsancg` (marketing inherits AIOS governance,
ESLint/shadcn tooling, and the doubled directory name); pulling AIOS into this repo (AIOS is
the mature system — it shouldn't be the one that moves); deferring the decision to P2.

### D-023 · 2026-08-20 · Candidate intake goes through AIOS governance as a scope change
Rather than the website building a parallel candidate store, candidate intake is raised as a
formal AIOS scope change so there is one source of truth for candidate data.
**Why:** a second candidate store means an eventual reconciliation against a system that
already enforces append-only audit, consent status, and a stage machine. Not worth it.
**Cost accepted:** this is Marianna's spec and their gate process — not a unilateral call,
and not fast. **Consequence:** the "For Candidates" nav in the mockups cannot be built until
that change is approved. P1 must not promise a portal it can't deliver.

### D-024 · 2026-08-20 · Read all 11 AIOS spec docs before writing the P1 design
**Why:** P2/P3 integration decisions get made once instead of twice, and the security/privacy
and build-readiness constraints are binding on this project.

### D-025 · 2026-08-20 · Stack corrected to match AIOS ADR-011 — Tailwind 4 is CSS-first
`02-stack.md` previously said tokens live in `tailwind.config.ts`. **That was wrong for
Tailwind 4**, which is CSS-first: `@import "tailwindcss"` + `@theme inline` in `globals.css`,
with no JS config file. Also corrected: `middleware.ts` → `proxy.ts` in Next 16 (fails
silently if wrong), route props are generated types, and Framer Motion's package is now
`motion`. Versions aligned to AIOS: Next 16.3 · React 19.2 · Tailwind 4.3 · Zod · TS 5.x.
next-intl routing verified against current docs the same day.

### D-026 · 2026-08-20 · The website is the Revenue Engine's public surface
`10_AIOS_ENGINE_ARCHITECTURE.md` assigns "sales, demand creation, commercial agreements,
testimonials" to the **Revenue Engine**, which has only 3 requirements in the current slice
and is explicitly not yet documented ("build those engines later from their own approved
process discovery").

**This reframes every gap found so far.** AIOS has no job postings, no candidate intake, and
no portal not because they were overlooked, but because the engine that owns the public
surface has not been specified. The website is not a client bolted onto Delivery — it is the
Revenue Engine's first surface.

**The seam already exists:** contract **HC-003 `search_request_registered`** is produced by
the Revenue Engine and Client Experience Engine, and consumed by Delivery and Operations.
A "Discuss a Search" submission on the website is exactly that event. The website's primary
conversion action has a defined home in the architecture.

### D-027 · 2026-08-20 · Website writes must respect ADR-013 — no service-role key in app code
AIOS rejects holding an RLS-bypassing credential in application code. The website therefore
uses the **anon key, server-side only**, with RLS as the enforcing boundary (ADR-004: "UI
hiding is never authorization"). Server-only is defense in depth, not the control.
**This refines D-016** — the credential is the anon key, not the service role key.

**Also binding, from ADR-014:** every migration, route, and test must trace to an approved
requirement ID in `specs/requirements_registry.json`. A website-driven migration cannot be
written until its requirement is approved — which is precisely the governance path D-023
commits to.

### D-028 · 2026-08-20 · Direction A approved; all mockup content confirmed as mock data
Drew's call. Direction B kept in refs as `dirB-home-rejected.png`. Team names, client
logos, stats, and job listings in the mockups are placeholders — real content comes later
(Q-06 still open for the real proof points).

### D-029 · 2026-08-20 · Type system: Cormorant Garamond display + Libre Franklin everything else
Cormorant pinned by Drew; pairing chosen via /impeccable typeset. Cormorant is display-only
(hairline strokes collapse at body sizes) — 500+ weights, ≥24px, heavier on navy. Libre
Franklin carries body, UI, and the letterspaced eyebrow labels. Details in
[08-design-system.md](08-design-system.md).

### D-030 · 2026-08-20 · Palette sampled from dirA-home-v2.png, contrast-verified
navy #061E39 · brass #A2865A · teal #003439 · cream #F9F7F6, sampled with ImageMagick and
WCAG-checked. **Binding constraint found: brass on cream is 3.23:1 — large/bold text only,
never body or small links.** Brass-on-navy and navy-on-brass both pass AA at 4.87.

### D-031 · 2026-08-20 · Framework scaffolded manually, not via create-next-app
`create-next-app` refuses directories containing files outside its whitelist (CLAUDE.md,
refs/, .env.local). Manual scaffold also gives exact control over the three Next 16
conventions from ADR-011. Verified: `bun run build`, `tsc --noEmit`, `biome check` all
green; `/en` and `/es` prerender static. Resolved versions: Next 16.3.1 · React 19.2.8 ·
Tailwind 4.3.3 · next-intl 4.13.7 · motion 13.1.1 · Zod 4.4.3 · TS 7.0.2 · Biome 2.5.9.

### D-032 · 2026-08-20 · Logo lockup is rendered as real text, not an image
The lockup is pure type — letterspaced serif caps over a letterspaced subtitle — which
Cormorant Garamond reproduces natively. Code version: recolorable per surface (white on
navy, navy on cream), crisp at any DPI, zero image bytes in the header, localizable
subtitle, screen-reader native. `refs/dirA-logo-lockup.png` is kept as a
proportion/spacing reference only.
**Caution that motivated this:** the first generated logo file was misspelled "ARSON."
Generator output is not a source of truth for brand-critical strings — the corrected file
was verified letter-by-letter, and the code version keeps the spelling reviewable in git.

### D-033 · 2026-08-20 · Repo hosted under Marianna's GitHub; deployed on her Vercel
`shakti936/arsan-website` (private), Drew as collaborator — the mirror of the aios-arsancg
arrangement. Vercel connects via her dashboard's GitHub import; previews per branch,
production from `main`. Local branch renamed `master` → `main` before first push (house
rule: main is production).
**Noted trade-off (raised with Drew 2026-08-20):** code and hosting ownership sit with
Marianna, not Drew. Accepted per Drew's call.

### D-034 · 2026-08-20 · P1 component library + all 10 pages built, hand-rolled (no shadcn yet)
Direction A components: text logo lockup, header with CSS-only mega-nav (hover +
focus-within, zero JS), client mobile nav, 5-column footer, split hero, chooser cards,
value props, story cards, quote band, teal CTA band with watermark A, page hero, point
grid. One shared motion pattern (`Reveal`, motion/react, reduced-motion → static). All
content through next-intl catalogs — zero hardcoded strings. 10 pages × en/es, all SSG.
Candidate page deliberately promises no portal (D-023): positioning + confidential
conversation CTA only.
**shadcn deferred:** P1 marketing chrome needs almost none of it; its token system would
need retheming to Direction A. Revisit at the contact form (inputs/toasts) where AIOS
consistency also argues for it.

### D-035 · 2026-08-20 · 21st.dev marquee + testimonials integrated — adapted, not pasted
Logo wall (fictional placeholder wordmarks, pending Q-06 logo permissions) on Home;
testimonial columns (mock quotes, pending AIOS gate D-018 consent) on Results. Both run on
one rewritten server-component Marquee. Zero new dependencies. Adaptation details in
[06-prompts.md](06-prompts.md) P1.5.

### D-036 · 2026-08-21 · Forms ship UI-first; GHL wiring deferred pending Marianna review
Drew's call. Both forms (client `/contact`, candidate `/for-candidates`) built with full
validation, localized errors, success states, and spam gates (honeypot + min-time) — but
the server actions stop at validation. No GHL fields/values are created, no n8n workflow
built. The full wiring design (grilled + self-reviewed 2026-08-20, Codex unavailable) is
recorded in this log and in chat; it activates unchanged once Drew + Marianna approve the
forms. Launch gate stands: published AI workflows in the ARSAN location get paused before
any GHL wiring goes live.

### D-037 · 2026-08-21 · Full Direction A page build-out complete (mock content)
Every page now carries its mockup's full section set. New shared components: icon system
(16 authored line icons, one stroke weight), IconRow, TeamRow, ArticleCards, FunctionGrid,
FeaturedCase, TrustStrip. Home gained team + insights rows; Executive Search gained quote
band, 8-function grid, stories, why-choose row; Mexico Advisory gained the 4-question
grid, featured case with stat row, involve-early row, insights; For Candidates gained
trust strip, values row, help cards; Insights is a 6-card article grid; Why ARSAN gained
the team section.
**Mock-content flags:** team names/titles from mockups (unverified — Q-06); article cards
render "coming soon," unlinked (no detail pages yet); case-study stats invented; job-board
surfaces still excluded (D-023).

### D-038 · 2026-08-21 · Typeset + polish + harden pass (via /impeccable)
**Typeset:** enforced the Cormorant ≥24px floor everywhere — seven components were
rendering display serif at 18–20px (article/story/team/point/help cards, logo wall).
**Polish:** select was a blank box — added placeholder option + chevron; maxLength hints
matching Zod caps.
**Harden:** hreflang/canonical alternates on every page (P1 criterion, was missing);
locale switcher in header (site had NO way to switch languages); skip-to-content link;
localized 404 + catch-all route + error boundary; robots.ts + sitemap.ts (20 URLs with
locale alternates); metadataBase + OpenGraph + themeColor. `NEXT_PUBLIC_SITE_URL` env
(defaults to production domain).
Verified in built HTML output, not just source. 24 SSG routes.

### D-039 · 2026-08-21 · Type scale rebuilt; mega menus rebuilt to reference; active nav state
**Root cause of "sizes look off":** `--text-display-*` tokens were declared without paired
`--text-*--line-height`, so `.text-display-xl` compiled to font-size ONLY and every heading
inherited whatever leading its component happened to set. Sizes were also ~25-30% oversized
(hero 72px against a measured ~55px in the mockup).
**Fixed at the token layer:** hero 36→56px, page hero 30→44px, section 24→32px, each with a
paired line-height (1.12/1.15/1.2). Per Drew, sizes target *normal readable* rather than
mockup-exact. Card/section body 14→16px; hero and page-hero intros → 18px. Ad-hoc
`leading-*` overrides removed so the token owns leading.
**Mega menus** rebuilt to `refs/dirA-meganav-all-panels.png`: full-viewport-width panels
(header is `relative`; panels absolute against it), left icon+title+description rows on
rules, right featured card with illustration/heading/body/CTA, "Explore …" link. Still
CSS-only — hover + `focus-within`, zero JS.
**Active page** marked with a brass underline and `aria-current="page"` (desktop) and a
brass left rule (mobile).
**Also fixed:** `/results` rendered the same sentence as H1 and section heading — the
section is now "Selected case studies."
**D-023 held:** mega-menu candidate items link only to pages that exist. No "View
Opportunities" / "Submit Your Profile" / "Join Our Talent Network" until the portal is real.

### D-040 · 2026-08-21 · Type scale normalized to conventional web sizes
Sizes now target ordinary readable web values rather than the mockups (Drew's call, twice).
Mobile → desktop: hero **32→48**, page hero **28→40**, section **24→30**, card title **22**
(fixed), body **16**, intros **18**, eyebrow/label **13** (was 12). All paired with
line-heights at the token layer; card titles moved from `text-2xl` to a `display-sm` token
so one value governs them.

### D-041 · 2026-08-21 · Candidate-portal nav items ship now as real routes — supersedes D-023 exclusion
Drew's call: the site should look like the final version for review. "View Opportunities,"
"Submit Your Profile," and "Join Our Talent Network" are back in the mega menu, each as a
**real route** — nothing 404s.
- `/for-candidates/submit-profile` and `/for-candidates/talent-network` carry the working
  candidate form (validation live, delivery still stubbed per D-036)
- `/for-candidates/opportunities` carries an **honest empty state**, not invented listings:
  "Most of our searches never get posted" — which is true of confidential executive search
  and converts to the profile/network CTAs
**What D-023 still governs:** no real job data, no candidate auth, no application records
until the AIOS scope change lands. The routes are the shell; the portal is not live.

### D-042 · 2026-08-21 · Message-key validator added as a prebuild gate
**Bug:** the mega menu threw at runtime — `nav.ts` still referenced `whyWork`/`conversation`
while the catalogs had moved to `opportunities`/`submitProfile`/`talentNetwork`.
**Root cause:** Biome reformatted `nav.ts` (wrapping object literals multiline) after it was
written, so a later string-replace silently matched nothing and the file kept the old keys.
The deeper problem: **nothing validated that message keys resolve.** next-intl falls back
silently in production and throws only in dev, so the mismatch passed `tsc`, Biome, and a
green `next build`.
**Fix (structural, not a patch):** `scripts/validate-messages.mjs`, wired as `prebuild`.
It fails the build when (1) `nav.ts` references a key no catalog defines, or (2) the locale
catalogs drift apart in either direction. Verified by deliberately deleting a key — the
build fails with the exact key named. Currently: 61 nav keys, 204 total, 2 locales in sync.
**Process note:** third time this session a Biome reformat has silently broken a blind
string-replace. Re-read a file before editing it if any formatter has run since it was
written — the SOP's Edit read-state rule applies to script-driven edits too.

### D-043 · 2026-08-21 · `cn()` was silently deleting every custom font size
**Bug:** section headings rendered at inherited body size sitewide. Drew reported "all the
text feels small."
**Root cause — not taste, not the tokens.** `tailwind-merge` only knows Tailwind's built-in
font-size scale. Custom `text-display-*` classes fell into its *text-color* group, so
`cn("text-display-md", "text-navy-900")` resolved them as conflicting and **dropped the
size**. Verified directly: `twMerge("text-display-md","text-navy-900")` → `"text-navy-900"`,
while `twMerge("text-2xl","text-navy-900")` keeps both. Affected every component that
combined a display size with a colour through `cn()` — SectionHeading (used on nearly every
section), IconRow, ArticleCards.
**Fix (at the cn() layer, not the call sites):** `extendTailwindMerge` registers the four
`display-*` values as font sizes. Verified sizes now survive a colour merge and still
dedupe against each other.
**Lesson:** a custom Tailwind token needs a matching tailwind-merge class-group, or `cn()`
eats it silently — no error, no lint, no build failure.

### D-044 · 2026-08-21 · Body scale up one step, leading opened up
`--text-base` 16→**17px**/1.7, `--text-sm` 14→**15px**/1.65, `--text-lg` 18→**19px**,
`--text-xl` 20→**21px**; display leading 1.18/1.22/1.3/1.35. All ad-hoc `leading-relaxed`
overrides removed so the tokens own leading in one place. At a 1000px window: hero 44 ·
page hero 36 · section 28 · card 22 · body 17.

### D-045 · 2026-08-21 · Mega-menu wrapper was an invisible full-page curtain — hero CTA was unclickable
**Reported symptom:** hovering nowhere near the navbar opened the mega menu.
**Actual severity: worse.** The same defect made the hero's primary CTA ("Discuss a Search")
impossible to click — the site's main conversion action was dead on every page.

**Root cause.** The panel wrapper `div.absolute.inset-x-0.top-full` is always mounted and
spans the full viewport width. Its open/closed state used `visibility: hidden` on the inner
panel — and **hidden elements still occupy layout space**, so the wrapper stayed ~450px tall.
The wrapper itself was visible with default `pointer-events: auto`, so it hit-tested first
across the entire top of every page. Being inside `li.group`, hovering it also fired
`group-hover` and opened a menu. Proven by `document.elementFromPoint` returning the wrapper
at every probe from 20px to 450px below the header, and at the CTA's own centre point.

**Fix (one change, at the wrapper):** `pointer-events-none` on the always-mounted wrapper;
`pointer-events-auto` restored on the inner panel only under `group-hover` / `group-focus-within`.

**Why this needed a browser to catch:** tsc, Biome, the message validator, `next build`, and
the design detector were all green throughout. Static analysis cannot see hit-testing.
`@playwright/test` added and `e2e/nav-overlay.spec.ts` written **failing first** (2 of 3 red),
then green after the fix: CTA reachable · no panel opens below the header · nav hover still
opens its panel. `bun run test:e2e`.

### D-046 · 2026-08-21 · Layout + adapt pass across five viewports
Audited 10 routes × 5 viewports (320/390/768/1280/1920) with real browser measurement.

**Fixed:**
- **WCAG 2.2 AA target-size failures: 551 → 0.** Footer links were 18px tall and arrow
  links 20px — both below the 24px AA minimum. Footer links now 36px, arrow links 44px,
  locale switcher 44px, nav links 44px.
- **Section rhythm unified.** Ad-hoc `py-16`/`py-20`/`lg:py-28` scattered across 18 files
  replaced with one `.section-y` scale (56px phone → 72px tablet → 96px desktop). Phones
  were getting desktop-sized whitespace.
- **Mobile nav rebuilt as a full-screen overlay.** It was `fixed top-[72px]` — a hard-coded
  header height that drifts every time the type scale changes (it already had). The overlay
  owns its own top bar, locks background scroll, and closes on Escape.
- **Hero CTAs stack full-width on phones** instead of wrapping awkwardly; CTA-band watermark
  hidden below `sm` where it only added noise.
- **Card rows now align.** A two-line category label ("Organizational Transformation") used
  to shove its card's title out of line with the row; `.eyebrow-block` reserves two lines.
  Verified: title offset spread 0px across every row.
- **Arrow links keep their arrow with the last word** when the label wraps, instead of
  floating it right of the block.

**Measured clean afterwards:** 0 AA target failures · 0 prose over 78ch (real `ch`
measurement, not an estimate) · 0 page-level horizontal overflow at any viewport.

**Deliberate:** footer links sit at 36px — comfortably past the 24px AA floor, short of the
44px AAA guidance, because 44px per link makes a five-column footer enormous on a phone.

### D-047 · 2026-08-21 · Scroll reveal moved from JS to CSS — 65% of each page was invisible without JS
**Found during the layout pass.** `Reveal` used motion/react with `initial={{opacity: 0}}`,
which **server-renders `style="opacity:0"` into the HTML**. Measured with JS disabled:
**51 of 79 text nodes hidden** on the homepage. Any JS failure, or the window before
hydration, left most of every page blank. The component's own comment claimed content was
"visible by default" — it wasn't.

**Fix:** CSS scroll-driven animation (`animation-timeline: view()`), guarded by
`@supports` and `prefers-reduced-motion`. Content is visible by default and the reveal is
layered on only where supported; unsupported browsers simply show the content. `Reveal` is
now a **Server Component** — zero client JS.

**Verified:** JS disabled → 0 of 79 hidden (was 51). Every reveal already in the viewport
renders at full opacity; scrolled content animates to 1.00. `motion` is no longer imported
anywhere — kept as a dependency for future interactive motion, not currently bundled.

### D-048 · 2026-08-21 · Visual system: the "Plate" media treatment replaces empty placeholders
**Problem:** the hero's right column was literally `<div aria-hidden className="hidden lg:block" />`
— half the primary viewport was empty — and every card carried a flat navy gradient. The site
read as a template awaiting assets.

**`Plate`** (`src/components/ui/plate.tsx`) is now the treatment for every media surface:
deep navy ground, fine orthographic grid, corner registration ticks, warm brass light, film
grain. The language is an engineering drawing — what ARSAN's clients actually work from —
so a slot without a photograph reads as designed rather than missing. Pure CSS/SVG: no image
requests, no layout shift, three variants so repeated plates don't twin.
**When photography arrives, a plate becomes the frame:** drop `<Image fill>` inside and keep
the ticks and grain over it. No layout changes needed.

**Hero right column** now carries the practice index (automotive, aerospace, medical,
industrial) inside a plate — real content from ARSAN's business, not decoration.

**Also:** film grain on all navy surfaces (one inline SVG, no request) so large flat fills
read as printed ink; card hover elevation with real offset+blur; header wrapping fixed
(logo subtitle was a long ribbon pushing nav items to two lines — now capped and hidden
below `sm`, nav set to `whitespace-nowrap`); marquee fade widened so no word is hard-cut.

### D-049 · 2026-08-21 · Mobile navigation rebuilt as a single-open accordion
The desktop mega menu shows every section's children at once because there's room; the same
content on a phone was ~20 stacked links. Now: full-screen overlay, five top-level rows,
**one section open at a time**, each opened section mirroring the mega panel's icon + label +
description so both navigations read as one system. The section you're currently on opens
automatically. Pinned CTA and locale switcher at the base with `env(safe-area-inset-bottom)`.
Proper dialog semantics: `role="dialog"`, `aria-modal`, focus moved in, **focus trapped**,
Escape closes, background scroll locked.

### D-050 · 2026-08-21 · Font payload halved
Cormorant weight 700 was loaded and never used (audit: 25 × `font-semibold`, 6 × `font-medium`,
0 × `font-bold`). Dropping it took the font set from 30 files / 768K to 15 files / 384K on disk.

### D-051 · 2026-08-21 · Header is sticky and condenses on scroll
**Decision:** yes, sticky. Pages run ~5,000px desktop and ~9,000px mobile; a visitor deep in
a service page who decides to act should not scroll back to the top to reach "Discuss a
Search." For a site whose only job is starting one conversation, a persistent CTA is the
highest-leverage thing the header does.

**Not plain sticky:** at 109px it would eat that much viewport all the way down. It now
condenses to 89px (desktop) / 56px (mobile) past 180px of scroll, darkening to navy-950 with
a shadow to separate from content. **Pure CSS** via `animation-timeline: scroll()` — the same
mechanism as `.reveal`, so no scroll listener and no JS. Unsupported browsers get a normal
full-height sticky header. Reduced-motion collapses the transition to 1ms rather than
removing the behaviour.

**Cascade trap worth remembering:** `position: sticky` set from a `@layer components` class
was silently overridden by Tailwind's `relative` utility on the same element — utilities win.
The header condensed correctly while scrolling away, so it *looked* like it worked. Removing
`relative` fixed it; `sticky` is itself a positioned element, so the mega panels still anchor
to the header. Covered by an e2e test asserting `y === 0` after scroll.
Anchor targets moved to `scroll-mt-28` to clear the condensed bar.

### D-052 · 2026-08-21 · The nav wordmark stays live text — Cormorant, not a PNG
**Question raised:** "should we use the logo actually — in the nav?"

**Measured first, decided second.** An earlier read of `refs/dirA-logo-lockup.png` called it a
Didone and concluded it was a different typeface from ours. That was wrong. Rendering
Cormorant Garamond against the lockup at matched width shows the same skeleton — flat-serifed
`A` apex, straight flaring `R` leg, same `S` spine and `N`. The apparent difference was
**weight and tracking**, not family:

| | reference lockup | site before | site now |
|---|---|---|---|
| aspect ratio at 1200px wide | 1200×198 | 1200×240 (8% off) | 1200×196 |
| tracking | ~0.18em (solved numerically) | 0.26em | **0.18em** |
| ink coverage at matched geometry | 0.161 | 0.175 (wt 500) | 0.175 (wt 500) |

Weight stays at 500 even though the lockup measures ~430 (between Cormorant 400 at 0.152 and
500 at 0.175). The lockup is a 1370px black-on-white artwork; the nav is 28px reversed out of
navy, where light-on-dark optically thins strokes. One step more weight is the standard
compensation, not a mismatch.

**So no image.** Live text recolors via `currentColor` for the light/dark `tone` prop, stays
crisp at any DPI, costs zero bytes and zero requests, is selectable and readable by screen
readers, and needs no separate asset per locale. A PNG buys nothing the type doesn't already
give us, and the first supplied version was misspelled "ARSON" — evidence it was generated,
not drawn.

**Subtitle removed from the header and the mobile overlay** (`withSubtitle={false}`); it stays
in the footer. At header widths it wrapped to **three** lines and drove the bar to 109px on
desktop against 76px on mobile. The header is now **77.5px at every breakpoint** and the
wordmark reads as a mark rather than a stack of text. The descriptor still appears in the
footer lockup and the footer bottom bar. Subtitle `max-w` widened 13.5rem → 15.5rem so the
footer lockup breaks to **two** lines, matching the reference. `scroll-mt-28` → `scroll-mt-24`
to track the shorter condensed bar.

**Still open — a brand decision, not a code one (Q-18).** ARSAN's *live* site uses a different
mark entirely: a four-square icon with figures, plus "ARSAN **INTERNATIONAL** CONSULTING GROUP"
in navy/blue/gray. Saved as `refs/arsan-current-live-logo.png`. Direction A discards both the
icon and the "International Consulting Group" descriptor in favour of "Executive Search &
Manufacturing Talent Advisory". Marianna and Armida have to confirm that's intended — it is a
change of legal-ish name presentation and of the icon, not a styling preference. Note the
icon's palette (bright blue, teal, gray) does not sit in the navy/brass system.

### D-053 · 2026-08-21 · The descriptor stays in the header — and the header row was over-subscribed all along
Drew: keep the slogan under the wordmark. Restoring it exposed a real defect that had been
hiding behind it.

**What was actually wrong.** The logo was a flex item with default `min-width: auto`, so the
header row was *compressing it* whenever the row ran out of space. Measured natural vs.
available width of the three header children:

| | available | logo · nav · right | needed | slack |
|---|---|---|---|---|
| EN 1024 (before) | 944 | 145 · 471 · 296 | 944 | 0 — logo squeezed from 209 to **145** |
| EN 1280/1440 (before) | 1072 | 209 · 503 · 296 | 1072 | 0 |
| **ES 1280/1440 (before)** | 1072 | 212 · 627 · 376 | **1279** | **−207 — spilled off-screen** |

So the Spanish header never fit, at any width; below ~1600px it visibly overflowed the
viewport. The subtitle was not the cause — it costs 3px — it just removed the slack that was
masking it.

**Fixes, at the layer each belongs to:**
- `shrink-0` on the logo. The wordmark is a brand mark; it does not get compressed to make
  room for chrome. This is what turned a silent squeeze into a visible overflow we could fix.
- **Desktop nav moves `lg` → `xl`.** At 1024 the row needed every pixel it had; the nav and
  the logo were fighting. 1024–1279 now gets the overlay nav, which has room to spare.
  `mega-panel` and `mobile-nav` moved with it so the three stay in lockstep.
- Row gap `xl:gap-8` → `xl:gap-6`, nav gap `gap-6 xl:gap-8` → `gap-5 xl:gap-6`, CTA `px-5` →
  `px-4`. Header CTA `sm:` → `md:inline-flex` — at 640 it did not fit in either language, and
  the overlay already pins a CTA.
- **ES nav copy tightened:** "Para Empresas" → "Empresas", "Para Candidatos" → "Candidatos",
  CTA "Hablemos de su Búsqueda" → "Hablemos". Spanish runs ~23% longer than English and this
  header has five mega-nav items plus a CTA; the labels had to carry that. Flag for the Q-05
  native review — these are the shortest idiomatic forms, not a translation shortcut.

**Result:** EN +53px slack, ES +69px, zero page overflow at 390/640/768/1024/1280/1440/1920 in
both locales. Header 91.8px in EN (2-line descriptor) and 103.6px in ES (3 lines — Spanish is
longer and the height is allowed to follow it rather than being reserved).

**Rejected: `xl:max-w-7xl` on the header.** It fits everything comfortably, but the header
container then runs 128px wider than the `max-w-6xl` page content, putting the logo 64px left
of the H1 on every page. Measured `logoLeft:120` vs `h1Left:184`. Alignment with the content
grid is worth more than the slack; shortening two Spanish nav labels bought the same room for
free. Logo and H1 now both land at 184.

**Subtitle sizing.** `0.59375rem`/`0.1em` — solved so the longest line ("MANUFACTURING TALENT
ADVISORY", 203.6px) stays inside the wordmark's 208.9px, so the descriptor can never widen the
logo block. Tested 10px/0.08em (208.5px — 0.4px of margin, too tight) and 9px (legibility for
no gain). `max-w-[13.25rem]`.

### D-054 · 2026-08-21 · Site photography generated with KIE / nano-banana-pro
Eleven photographs generated with KIE.ai's `nano-banana-pro` (Gemini 3 Pro Image) via the
CLI copied in from `local-service-template`. This closes the "photography hasn't been
supplied" note that `plate.tsx` was written against.

**What was generated — and what deliberately was not.** ARSAN is an executive search firm
with named people on the site. Every image is environmental: plant floors, an empty
industrial shell, a stamping line at night, a shift-change corridor, a Bajío industrial park
from the air, a border truck queue, an empty executive office, a desk of printed
spreadsheets. Where people appear they are distant and turned away — no invented faces.

**Not generated, and not to be:** headshots for the team section, faces for testimonials, or
any frame that could read as a named client's facility. Synthetic portraits of real named
people are misrepresentation, and the AIOS threat model names public leakage of confidential
client identity as a risk. Those slots need real photography (Q-06).

**Prompting followed the `/gen-images` v3 corrections:** one flowing 55–110-word paragraph
each, **no negative/AVOID block** (this model binds to concrete nouns regardless of "no", so
naming a failure summons it), real capture-device physics, and deliberately varied light
across slots — hard morning side-light, broken overcast, harsh night work lighting, blue
pre-dawn, dusk. The aerial specifies a level gimbal horizon and "distance softened only by
atmospheric haze, not blur".

**Plate became a frame rather than being replaced.** `plate.tsx` now takes `src`/`alt`: the
photograph sits underneath, a navy scrim holds it inside the palette, and the orthographic
grid drops from 0.18 to 0.07 opacity so it reads as registration rather than competing
texture. Corner ticks and grain stay on top. A plate with no `src` renders exactly as before.

**Scrim strength was measured, not eyeballed.** `overlay="heavy"` (the home hero plate, which
carries nine lines of type) started at 78%/88% and buried the photograph completely. At
58%/80% the plant reads and **all nine text runs still pass WCAG AA against the lightest
pixel in their own band** — worst case 4.71:1 on the brass eyebrow, best 12.98:1. Card plates
use `light` (34%/52%) since nothing sits on them.

**Alt text is localized** — 11 new keys per locale, sitting beside the copy they describe
(`home.hero.plateAlt`, `home.stories.items[N].imageAlt`, `insightsRow.items[N].imageAlt`,
`mexicoCase.imageAlt`). These are content images, not decoration; each alt describes the
frame.

**Originals are 4K and 3–10MB each; committed files are not.** Downscaled to 1800px longest
edge at q82 — the widest slot renders at ~460 CSS px, so 1800 covers 2× DPR with room, and
`next/image` resizes from there per request. 32MB → 3.4MB total. 4K originals kept out of the
repo in the session scratchpad.

### D-055 · 2026-08-21 · Photographs follow the reference: full-bleed hero, plain plates, photos in the nav
Drew, against `refs/dirA-home-v2.png`: the images should be full-background, and the "Where
we work" practice index isn't in the reference.

**He's right — it never was.** The reference hero is one photograph running the full width of
the band with navy laid over the left where the type sits. The practice index was something I
invented to fill an empty column back when there were no photographs (D-032 era). It's gone,
along with its `plateEyebrow`, `practices` and `plateAlt` message keys.

Hero is now a full-bleed `<Image fill>` with **two scrims rather than one**: below `lg` the
copy crosses the middle of the frame so navy has to cover everything (88%→84% vertical); from
`lg` up it rakes off to the right (96% → 92% → 62% → transparent at 86%). New image
`hero-wide.jpg`, prompted with the left third deliberately open so the headline sits on quiet
ground.

**Photographed plates dropped the drawing treatment.** The reference shows plain, full-colour
photographs in cards and nav panels — no grid, no registration ticks, no heavy tint. A plate
with `src` now renders the photograph with a 6%→14% navy whisper for palette cohesion and
nothing else. The engineering-drawing treatment is what an *empty* plate renders; it exists to
stop an unphotographed slot reading as a grey box, and that is the only job it now has.

**The mega nav carries photographs too** (`refs/dirA-meganav-all-panels.png`): Results and
Insights get one beside the feature text, the other three keep their icon. `NavFeature` gained
an optional `image`; the alt comes from `nav.<key>.feature.imageAlt`. With an image the feature
title steps down to `display-sm` and the body to `text-sm` — at `[3fr_5fr]` in a ~400px column
`display-md` wrapped the Insights headline to four lines.

**Two instrument bugs worth recording, since both would have produced false confidence:**
1. The hero contrast pass first reported two failures. Both were the *checker*: it parsed
   `lab(...)` colours as if they were RGB, and it hid the CTA's own brass ground before
   sampling. Rebuilt to resolve any CSS colour through a canvas and to composite translucent
   text onto its measured ground — 0 real failures, worst case 5.07:1 on the solid CTA and
   5.22:1 on the headline.
2. The image sweep reported 44 broken images. They were lazy images that had not loaded,
   counted because the check read `img.src` (which for a Next `fill` image is the largest
   srcset candidate) instead of `currentSrc`, and never scrolled. Rebuilt to scroll the page,
   ignore hidden images and read `currentSrc`: **0 broken, 0 oversized, 0 overflow across 18
   route/width combinations and 102 displayed images.**

**One real bug did fall out of that sweep:** the mega-panel `sizes` was
`"(min-width: 1280px) 20vw, 0px"`. A `sizes` that resolves to `0px` makes the browser fetch
the *largest* candidate — it was requesting a 3840px variant for a 150px slot. Now `"260px"`.

### D-056 · 2026-08-21 · Hero carries the reference's two executives
Drew: make the hero look like the reference. `refs/dirA-home-v2.png` has two executives on a
plant floor filling the right of the frame. Three candidates generated and culled; the chosen
one has both subjects right of centre, mid-conversation, plant soft behind them. Checked at
1:1 before committing — hands have the right number of fingers and real tendon detail, faces
have pores and asymmetry. The two runners-up are kept out of the repo.

**These are synthetic people and that is a different thing from the team section.** Nobody
real is depicted, nothing is passed off as ARSAN's own staff or premises. The line I am not
crossing is inventing faces for the *named* people on the site or for testimonials — that
misrepresents real individuals. An anonymous hero photograph is ordinary commercial practice.
Worth confirming with Marianna that she is comfortable shipping a generated hero at all.

**Gradient retuned to the reference**, which cuts from navy to photograph much harder than my
first pass: 98% → 95% at 44% → 58% at 55% → clear by 68%.

**A real contrast failure fell out of that.** Tightening the gradient pulled the fade left,
and the subhead's right end landed on a light pixel of the walkway: **3.63:1**, under AA. Fixed
by narrowing the copy column `36rem → 32rem` and the subhead `46ch → 40ch` so the text stops
before the fade — now **8.53:1**, with the headline at 10.73:1. Not fixed by darkening further,
which would have cost the photograph.

**Mobile gets the photograph as atmosphere, not as subject.** A 390px portrait band cannot both
feature two people and carry five lines of copy over them; the first attempt left a half-lit
face at the right edge that read as an accident. Flat 86%/88% scrim. The reference only
specifies desktop.

`hero-plate.jpg` and `hero-wide.jpg` are now unreferenced and were removed from `public/images`
(originals kept in the session scratchpad). An orphan check runs over the folder.

### D-057 · 2026-08-21 · The mega panel was unreachable with a mouse
Drew: hovering the nav then moving toward the panel closes it.

**Measured before touching anything.** The `li` that owns `:hover` ends at the link, at
y=67.9. The panel is anchored to the header's bottom edge at y=91.8. Between them sits
**27.9px of header padding belonging to neither element** — `elementFromPoint` in that strip
returns `header.site-header`, not the `li`. Crossing it dropped `group-hover` and closed the
panel before the pointer could arrive. Reproduced as three failing tests first
(`e2e/mega-menu-travel.spec.ts` walks the pointer down 3px at a time and asserts the panel
survives every step).

**Fix: a bridge inside the group** covering the gap, interactive *only* while the group is
hovered — which is precisely what stops it becoming the invisible curtain that
`e2e/nav-overlay.spec.ts` guards against. The nav link takes `z-50` so it always outranks the
bridge in the hit test, even when the condensed header shrinks the gap under the bridge's
height.

**A 150ms close delay was added on top, then removed.** The bridge alone passes every travel
test, and holding a panel open on the way out made two full-width panels overlap when moving
right-to-left along the nav. A second guard on a fixed root cause is a band-aid; it went.

**Click dismissal (`NavItem`, the header's only client component).** After clicking through,
the pointer is still parked on the item, so a pure `:hover` panel stays open over the page you
just asked for. Clicking suppresses the panel until the pointer leaves; Escape does the same.

**Two test-locator bugs found and fixed along the way**, both from `li` matching inside the
panels: `hasText: "Insights"` matched the *For Candidates* item, whose feature copy reads
"Career Resources — Insights and guidance for your career journey." Locators are now scoped to
`header nav[aria-label] > ul > li`. The second was self-inflicted: a blind string-replace
no-opped because Biome had reformatted the line since I wrote it — the same trap logged four
times before. Read the file first.
