# 04 — Setup From Scratch

**Last updated:** 2026-08-20 · **Status:** not yet executed. Steps get written here **as
they are actually run**, with the real command and any surprises — not from memory.

The test for this file: someone with a clean machine and this file should end up with a
running dev server and a green build, without asking questions.

---

## 0. Prerequisites

- Bun installed
- Vercel CLI + account access
- Supabase project access *(needed from P2; see [07-integrations.md](07-integrations.md))*
- GHL API access for the location *(P1 forms)*

## 1. Scaffold

_To be filled in when run. Record the exact command, the prompts it asks, and the answers
given._

```
# TBD
```

## 2. Tooling config

_Biome config, TypeScript strict settings, path aliases (`@/`), Tailwind token setup._

```
# TBD
```

## 3. Environment

Copy `.env.example` to `.env.local` and fill in. Variable names and their sources are
documented in [07-integrations.md](07-integrations.md). **Values never appear in this repo's
docs or commits.**

## 4. Verify

```
bun run dev          # dev server
tsc --noEmit         # type check
bunx biome check .   # lint + format
bun run build        # production build
```

All four must pass before opening a PR.

## 5. Deploy

See [10-deploy-and-ops.md](10-deploy-and-ops.md).

---

## Surprises / gotchas encountered

_Anything that cost more than five minutes goes here, with the fix._

| Date | What happened | Fix |
|---|---|---|
| _(none yet)_ | | |
