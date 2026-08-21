# 02 — Stack

**Last updated:** 2026-08-20 · **Status:** chosen, not yet installed. Versions get filled
in at scaffold time from the actual lockfile — do not guess them here.

| Layer | Choice | Why this one |
|---|---|---|
| Runtime / package manager | **Bun** | House default. `bun install`, `bun run`, `bun add`, `bun test`. Never npm or yarn. |
| Framework | **Next.js — App Router** | Server Components by default = near-zero JS on marketing pages. File-based routing suits the locale + job-detail dynamic routes coming in P2. |
| Language | **TypeScript, strict** | No `any`, no `@ts-ignore`. `unknown` + narrowing at boundaries. |
| Styling | **Tailwind CSS** | Utility-first. Tokens extended in config — never hardcoded hex in components. `cn()` (clsx + tailwind-merge) for conditional classes. |
| Animation | **Framer Motion** | Client-side motion where it earns its place. Every animation gates on `prefers-reduced-motion`. |
| UI primitives | **Radix UI** | Accessible dialogs/dropdowns/menus without rebuilding focus traps and keyboard handling. |
| Lint / format | **Biome** | Single source of truth. Not ESLint + Prettier. |
| Validation | **Zod** | Every external input — form handlers, API routes, webhooks — validated before use. |
| Product data | **Supabase** | Postgres + Storage (resumes) + Auth. RLS policies required before any table ships. Service role key stays server-side. |
| CRM | **GoHighLevel** | Contact record, pipelines, and ALL lead communication. Server-side API calls only. |
| i18n | **next-intl** *(provisional)* | Locale routing + message catalogs for EN/ES. Marked provisional until verified against current Next.js App Router docs at scaffold time. |
| Hosting | **Vercel** | Preview per branch, production promotes from `main`. |

## Hard rules carried into this build

- Server Components by default; `"use client"` only for interactivity, browser APIs, or hooks
- `next/image`, `next/font`, `next/link` — always
- Every route exports `metadata` or `generateMetadata`
- Fluid type via `clamp()`; no fixed `px` font sizes
- `dvh`/`svh` over `vh`
- Components under ~150 lines; compose rather than prop-drill
- Before any PR: `tsc --noEmit` + `biome check` + `bun run build`

## Deliberately NOT in the stack

| Not using | Instead | Why |
|---|---|---|
| npm / yarn / pnpm | Bun | House standard |
| ESLint + Prettier | Biome | One tool, one config |
| A headless CMS | Typed content files (P1) | Marketing copy changes rarely; a CMS is unearned complexity until someone non-technical needs to edit |
| Custom auth | Supabase Auth | Never roll auth |
| Twilio for lead comms | GHL | Lead communication is GHL's job |
