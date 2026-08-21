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

## Internal system (separate repo)

**Status: BLOCKING for P2+. Repo not yet provided.**

Questions to answer on first read of that repo:

1. Does it own the Supabase project and schema, or will this site have its own?
2. Does it expose an API this site calls, or do both hit Supabase directly with RLS?
3. Where does auth live — one shared Supabase project (SSO across both) or separate?
4. Do canonical `jobs` / `applications` tables already exist?
5. Who writes candidate records — this site, the internal system, or both?

Until answered, P1 is built with the data layer behind a thin adapter so the boundary can
be swapped without touching UI code.

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
