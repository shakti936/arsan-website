# 05 — Conventions

**Last updated:** 2026-08-20

Project-specific rules. The full house standards live in the global CLAUDE.md; this file
records only what's specific to this build or worth restating because it bites.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `job-card.tsx` |
| Component exports | `PascalCase` | `JobCard` |
| Functions / vars | `camelCase` | `getJobBySlug` |
| Constants | `SCREAMING_SNAKE_CASE` | `DEFAULT_LOCALE` |

## Structure

- Colocate a component with its types and tests
- Imports ordered: external → internal (`@/`) → relative → types
- Components under ~150 lines. A file that keeps growing is doing too much — split it.
- Server Components by default. `"use client"` requires a reason: interactivity, a browser
  API, or a hook.

## Styling

- Tailwind utilities only. Custom CSS only where Tailwind provably can't do it.
- Design tokens live in the Tailwind config. **No hardcoded hex in components.**
- `cn()` for conditional classes. No inline `style`.
- Fluid type via `clamp()`. Mobile-first. `dvh`/`svh` over `vh`.

## Motion

- Every Framer Motion animation checks `prefers-reduced-motion` and degrades to no motion
- Motion serves hierarchy and feedback. Decoration that costs INP gets cut.

## Accessibility

- WCAG 2.2 AA floor. Semantic HTML first; ARIA only where semantic HTML can't express it.
- Every interactive element keyboard-reachable with a visible focus state
- Never rely on color alone to convey meaning

## Errors and boundaries

- All external input validated with Zod before it's used
- Every `catch` either handles the error or re-throws with context. No silent swallows.
- Every automated external action (GHL write, Supabase write, file upload) needs an error
  path **and** a notification path for silent failure

## Git

- `main` is production-ready, always
- Branches: `feature/<short-description>` / `hotfix/<short-description>`
- Conventional commits (`feat:`, `fix:`, `chore:`, `content:`, `refactor:`, `docs:`),
  under 72 chars, body explains *why*
- Pre-PR gate: `tsc --noEmit` + `biome check` + `bun run build`

## Forbidden

- `any`, `@ts-ignore`, `@ts-expect-error` used to silence the compiler
- Skipping Biome
- Secrets in commits, PR bodies, logs, or user-visible output
- Modeling product data in GHL, or CRM data in Supabase
