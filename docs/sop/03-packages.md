# 03 — Packages

**Last updated:** 2026-08-20 · **Status:** nothing installed yet. This table is filled in
as packages are actually added — one row per `bun add`, at the time of the install.

**Rule:** a package is not installed until it has a row here. Before adding anything,
check whether the project already has something that does the job.

| Package | Version | Dev? | Why it's here | What breaks without it |
|---|---|---|---|---|
| _(none yet)_ | | | | |

## Planned (approved, not yet installed)

These follow from [02-stack.md](02-stack.md). Versions are resolved at install time, never
guessed.

- `next`, `react`, `react-dom` — framework
- `typescript`, `@types/react`, `@types/node` — dev
- `tailwindcss` + config toolchain — styling
- `framer-motion` — animation
- `clsx`, `tailwind-merge` — the `cn()` helper
- `@biomejs/biome` — dev, lint + format
- `zod` — boundary validation
- `next-intl` — locale routing and messages *(provisional — verify against current docs first)*
- `@supabase/supabase-js`, `@supabase/ssr` — Supabase client *(P2+, unless P1 needs it)*
- Radix primitives — added individually, only when a component actually needs one

## Rejected / removed

| Package | Date | Why it's not here |
|---|---|---|
| _(none yet)_ | | |
