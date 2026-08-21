# 02 — Stack

**Last updated:** 2026-08-20 · **Status:** chosen, not yet installed. Versions get filled
in at scaffold time from the actual lockfile — do not guess them here.

| Layer | Choice | Why this one |
|---|---|---|
| Runtime / package manager | **Bun** | House default. `bun install`, `bun run`, `bun add`, `bun test`. Never npm or yarn. |
| Framework | **Next.js — App Router** | Server Components by default = near-zero JS on marketing pages. File-based routing suits the locale + job-detail dynamic routes coming in P2. |
| Language | **TypeScript, strict** | No `any`, no `@ts-ignore`. `unknown` + narrowing at boundaries. |
| Styling | **Tailwind CSS 4** | **CSS-first — there is no `tailwind.config.js`.** Tokens are declared with `@import "tailwindcss"` + `@theme inline` in `globals.css`. Adding a JS config file has no effect. `cn()` (clsx + tailwind-merge) for conditional classes. |
| Animation | **`motion`** | Framer Motion's current package name. Matches AIOS. Every animation gates on `prefers-reduced-motion`. |
| UI primitives | **Radix UI** | Accessible dialogs/dropdowns/menus without rebuilding focus traps and keyboard handling. |
| Lint / format | **Biome** | Single source of truth. Not ESLint + Prettier. |
| Validation | **Zod** | Every external input — form handlers, API routes, webhooks — validated before use. |
| Product data | **Supabase** | Postgres + Storage (resumes) + Auth. RLS policies required before any table ships. Service role key stays server-side. |
| CRM | **GoHighLevel** | Contact record, pipelines, and ALL lead communication. Server-side API calls only. |
| i18n | **next-intl** | Locale routing + message catalogs for EN/ES. **Verified against current docs 2026-08-20** — `defineRouting`, `[locale]` segment, `setRequestLocale`, `generateStaticParams`, `localePrefix: 'as-needed'`. |
| Hosting | **Vercel** | Preview per branch, production promotes from `main`. |

## Version alignment with AIOS

The internal system pins its stack in `09_ARCHITECTURE_DECISIONS.md` (ADR-011, implemented
2026-08-04). This project matches it so shared database types and developer context stay
portable: **Next 16.3 · React 19.2 · Tailwind 4.3 · shadcn/Radix · `motion` · Zod · TS 5.x**.

**Three Next 16 conventions that break older material** — quoted from ADR-011 because each
one fails silently:

1. **`middleware.ts` is deprecated and renamed `proxy.ts`**, with the export renamed
   `middleware` → `proxy`. Supabase's published session-refresh recipe still says
   `middleware.ts`, which Next 16 **silently never calls**.
2. **Tailwind 4 is CSS-first.** `@import "tailwindcss"` + `@theme inline` in `globals.css`.
   No `tailwind.config.js`; adding one has no effect.
3. **Route props are generated types**: `LayoutProps<"/[locale]">`, `PageProps<"/login">`.

**Divergence from AIOS, on purpose:** this repo uses **Biome**; AIOS uses ESLint. Separate
repos (D-022), so the tooling does not have to match — and Biome is the house standard.

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
