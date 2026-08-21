# 03 — Packages

**Last updated:** 2026-08-20 · **Status:** scaffold installed 2026-08-20 via
`bun add` (see [04-setup-from-scratch.md](04-setup-from-scratch.md) for the exact commands).

**Rule:** a package is not installed until it has a row here. Before adding anything,
check whether the project already has something that does the job.

| Package | Version | Dev? | Why it's here | What breaks without it |
|---|---|---|---|---|
| `clsx` | `^2.1.1` |  | Half of cn() | Conditional classes get stringly |
| `motion` | `^13.1.1` |  | Animation (Framer Motion current package name) | No motion language |
| `next` | `^16.3.1` |  | Framework — App Router, RSC, SSG | No site |
| `next-intl` | `^4.13.7` |  | EN/ES locale routing + messages (D-005) | No i18n — retrofit costs every route |
| `react` | `^19.2.8` |  | UI runtime | No site |
| `react-dom` | `^19.2.8` |  | React DOM renderer | No site |
| `tailwind-merge` | `^3.6.0` |  | Other half of cn() | Conflicting utilities silently stack |
| `zod` | `^4.4.3` |  | Boundary validation — forms, server actions | Unvalidated external input |
| `@biomejs/biome` | `^2.5.9` | ✓ | Lint + format, single source of truth | No lint gate |
| `@tailwindcss/postcss` | `^4.3.3` | ✓ | Tailwind 4 PostCSS plugin | Tailwind does not compile |
| `@types/node` | `^26.2.0` | ✓ | Node types | tsc fails |
| `@types/react` | `^19.2.18` | ✓ | React types | tsc fails |
| `@types/react-dom` | `^19.2.4` | ✓ | React DOM types | tsc fails |
| `tailwindcss` | `^4.3.3` | ✓ | Styling — v4, CSS-first | No styles |
| `typescript` | `^7.0.2` | ✓ | Type checking (TS 7 — Go-based tsc) | No gate |

**Added 2026-08-21:** `@playwright/test` (dev) — browser-level regression tests. Justified
by D-045: an invisible overlay made the hero CTA unclickable, and no static check (tsc,
Biome, next build, design detector) could have caught it. Run with `bun run test:e2e`.

## Planned (approved, not yet installed)

- `@supabase/supabase-js`, `@supabase/ssr` — P2+, when AIOS reads begin
- Radix primitives — added individually, only when a component actually needs one

## Rejected / removed

| Package | Date | Why it's not here |
|---|---|---|
| `@radix-ui/react-avatar` | 2026-08-20 | 21st.dev testimonials wanted it for photo avatars; mock testimonials use monogram initials. Revisit when real testimonial photos exist (gate D-018). |

## Build-time scripts (not runtime dependencies)

| Script | Source | Why it's here |
|---|---|---|
| `scripts/generate-image.ts` + `scripts/lib/kie-client.ts` | copied from `local-service-template` | KIE.ai image generation CLI (nano-banana-pro / Gemini 3 Pro Image). Run with `bun --env-file=.env.local scripts/generate-image.ts`. Not imported by the app and not in the Next build — but it *is* covered by `tsc --noEmit` and Biome, so it was patched to satisfy `noUncheckedIndexedAccess` (two index accesses narrowed, four non-null assertions replaced with a `process.exit` guard that TypeScript can narrow through). |

**New env var: `KIE_API_KEY`** — source: the KIE.ai account, copied from `local-service-template/.env.local`. Value lives only in `.env.local` (gitignored). Not needed by Vercel; images are generated locally and committed as static files under `public/images/`.
