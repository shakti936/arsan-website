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

## 1. Scaffold — as run 2026-08-20

`create-next-app` refuses non-empty directories (this repo already held docs/, refs/,
CLAUDE.md), so the scaffold is manual:

```bash
# package.json written by hand with scripts (dev/build/start/lint/format/typecheck), then:
bun add next@latest react@latest react-dom@latest next-intl@latest   motion@latest zod@latest clsx@latest tailwind-merge@latest
bun add -d typescript@latest @types/react@latest @types/node@latest   @types/react-dom@latest tailwindcss@latest @tailwindcss/postcss@latest @biomejs/biome@latest
```

Resolved versions live in [03-packages.md](03-packages.md) and `bun.lock`.

## 2. Tooling config — as run

Files written by hand (all at repo root unless noted):

- `tsconfig.json` — strict, `noUncheckedIndexedAccess`, `@/*` → `src/*`. **Next build
  auto-rewrites `jsx` to `react-jsx`** — expect that diff after first build.
- `next.config.ts` — wraps config in `createNextIntlPlugin()`
- `postcss.config.mjs` — `@tailwindcss/postcss` only (Tailwind 4 has no JS config file)
- `biome.json` — schema 2.5.9. Two non-defaults: `css.parser.tailwindDirectives: true`
  (else `@theme` is a parse error) and `complexity.noImportantStyles: off` (the
  `prefers-reduced-motion` global reset legitimately uses `!important`)
- `src/app/globals.css` — `@import "tailwindcss"` + `@theme inline` tokens (palette from
  [08-design-system.md](08-design-system.md)), `.eyebrow` utility, reduced-motion reset
- `src/proxy.ts` — **NOT `middleware.ts`** (Next 16 renamed it; old name silently ignored).
  Wraps `next-intl/middleware` with an api/_next/file-extension matcher
- `src/i18n/routing.ts` (`defineRouting`, en/es, `localePrefix: "as-needed"`),
  `src/i18n/request.ts` (`getRequestConfig` + `hasLocale` fallback),
  `src/i18n/navigation.ts` (`createNavigation` wrappers — use these, not `next/link`)
- `src/app/[locale]/layout.tsx` — `next/font/google` (Cormorant Garamond 500–700 +
  italics; Libre Franklin variable), `generateStaticParams`, `setRequestLocale`,
  `NextIntlClientProvider`
- `messages/en.json`, `messages/es.json` — placeholder hero copy

## 3. Environment

Copy `.env.example` to `.env.local` and fill in. Variable names and their sources are
documented in [07-integrations.md](07-integrations.md). **Values never appear in this repo's
docs or commits.**

## 4. Verify

```
bun run dev          # dev server
bunx tsc --noEmit    # type check
bunx biome check .   # lint + format
bun run build        # production build
```

All four must pass before opening a PR. **Verified green 2026-08-20** — `/en` and `/es`
both prerender as SSG, proxy registered.

## 5. Deploy

See [10-deploy-and-ops.md](10-deploy-and-ops.md).

---

## Surprises / gotchas encountered

_Anything that cost more than five minutes goes here, with the fix._

| Date | What happened | Fix |
|---|---|---|
| 2026-08-20 | First `bun add` timed out at 2min in the sandbox | Run installs with `run_in_background` (or outside sandbox); completed in ~1s once free |
| 2026-08-20 | Biome flagged `@theme` as a CSS parse error | `css.parser.tailwindDirectives: true` in biome.json |
| 2026-08-20 | Biome 2.5 deprecated `files.includes` negation patterns for ignores | Rely on `vcs.useIgnoreFile: true` + `.gitignore` instead |
| 2026-08-20 | `next build` rewrote tsconfig (`jsx: react-jsx`) | Expected — commit the rewrite |
