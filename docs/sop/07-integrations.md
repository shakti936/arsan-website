# 07 — Integrations

**Last updated:** 2026-08-20

## System map

```
                    ┌──────────────────────────┐
                    │  Internal system (repo)  │  ← owns jobs, candidates, auth,
                    │  [PENDING REVIEW]        │    internal workflow
                    └───────────┬──────────────┘
                                │  boundary UNDECIDED:
                                │  (a) shared Supabase + RLS, or
                                │  (b) API exposed by internal system
                                ▼
┌────────────────┐      ┌───────────────────┐      ┌──────────────────┐
│  Public site   │─────▶│     Supabase      │      │       GHL        │
│  (this repo)   │      │  product data,    │      │  CRM: contacts,  │
│                │─────────────────────────────────▶  pipelines, all  │
└────────────────┘      │  Storage: resumes │      │  lead comms      │
                        └───────────────────┘      └──────────────────┘
```

**Hard boundary:** GHL is CRM. Supabase is product data. Never conflated. All lead
communication — SMS, email, calls — goes through GHL.

---

## Internal system — "AIOS"

**Supabase project:** `AIOS` · ref `aqonwletymrrukybyfzy` · us-east-2 · Postgres 17 ·
created 2026-08-04. Inspected read-only via PostgREST on 2026-08-20.

**State: schema built, zero rows.** Greenfield.

### What it is

A multi-tenant executive-search operating system — every table carries
`organization_id`. It is not a CRM and not a job board; it models the full search
lifecycle: `clients` → `search_agreements` → `searches` → `search_criteria` →
`search_candidates` (staged pipeline) → `interviews` → `offers` → `placements` →
`finance_handoffs`.

Around that sits a governance layer: `aios_engines`, `arsan_requirements`
(phase/requirement/human-checkpoint definitions), `approvals`, `human_decisions`,
`ai_action_runs`, `audit_events`, and an event bus — `domain_events`,
`handoff_contract_definitions`, `domain_event_deliveries`, plus a
`domain_event_delivery_health` view.

40 objects total. Full list captured at inspection time; regenerate with
`supabase gen types` once the site is linked.

### The three findings that shape the website

1. **There is no public job-postings model.** `searches` are *client mandates*, carrying
   `confidential`, `selective_client_path`, and fee terms in `search_agreements`.
   Publishing them directly would leak client engagements. A search is not a job posting.
2. **There is no inbound-application model.** `search_candidates` requires a `search_id`
   and represents internally-sourced pipeline. The website's "Submit My Resume" and
   "apply to this job" have nowhere to land.
3. **Auth is internal-staff only.** `profiles` + `memberships` (role, active) — no
   candidate-facing auth concept exists.

### Consequences

- The website **cannot** be a direct reader of `searches`.
- Publishing a job must be a **deliberate, human-approved act** producing a public-safe
  record — which fits the system's existing approval / human-checkpoint pattern.
- Both additions belong in the **AIOS repo**, not this one. This repo does not define
  the canonical schema (D-008).

### RLS status: UNVERIFIED

Anon-key reads on `candidates`, `searches`, `clients`, `placements`, `documents`, and
`organizations` all returned `200 []`. **That is not proof RLS works — the tables are
empty.** Re-test with seeded data before anything ships. Given this schema holds candidate
PII, `candidate_compensation` (with legal disclosure gates), and client fee terms, RLS
verification is a launch blocker, not a nicety.

## Supabase

**Status:** not yet provisioned for this project.

- Typed clients generated via `supabase gen types` — never hand-written row types
- Server-side clients for all mutations
- **RLS policies required before any table ships.** No exceptions.
- Service role key is server-side only, never in a Client Component or `NEXT_PUBLIC_` var
- Resumes go in Supabase Storage with a private bucket + signed URLs

## GoHighLevel

**Status:** `GHL_API_KEY` already present in local env.

- All API calls server-side. Keys in env vars only.
- Contact create/upsert on form submission
- **Tags: `add` vs `replace` — replace overwrites the full tag set.** Use add.
- No PIT webhooks available; polling patterns documented in global memory
- Every write needs an error path and a notification path on silent failure

## Env vars

**Names and sources only. Values never appear in this repo's docs, commits, or prompts.**

| Variable | Where it's used | Source | Status |
|---|---|---|---|
| `GHL_API_KEY` | Server — contact upsert on form submit | GHL location settings | ✅ present locally |
| `GHL_LOCATION_ID` | Server — scopes GHL writes | GHL location settings | ⬜ needed |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Supabase project settings | ⬜ P2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client — RLS-gated reads | Supabase project settings | ⬜ P2 |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never exposed | Supabase project settings | ⬜ P2 |

A `.env.example` with these names (no values) ships in the repo at scaffold time.
