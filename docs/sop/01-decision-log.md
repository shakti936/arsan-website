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
