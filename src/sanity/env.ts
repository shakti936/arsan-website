/**
 * Sanity connection details, and the switch that makes them optional.
 *
 * The site MUST build and run with none of these set. Content currently lives
 * in `src/content/**` and `messages/*.json`; Sanity is being introduced
 * alongside it, and a repo that cannot `bun run build` without a CMS project
 * would block every other kind of work until the migration finished. This is
 * the same seam as `src/lib/jobs/` — a provider with an honest fallback (D-074)
 * — rather than a hard dependency added ahead of the thing it depends on.
 *
 * `next-sanity`'s `defineLive` throws on a missing token by design, so it is
 * only reached through `isSanityConfigured`.
 */
/**
 * The ARSAN project. Defaulted in source rather than required from the
 * environment, because it is not a secret — it ships to the browser inside the
 * Studio bundle and inside every image URL — and because a build that fails
 * without a `.env.local` is a build that fails for anyone who clones the repo.
 * `sanity init` writes it into `sanity.config.ts` for the same reason. Override
 * it to point a checkout at a different project or dataset.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "shop59xi";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Pinned. A floating API version changes query behaviour under you. */
export const apiVersion = "2026-05-19";

/**
 * A stand-in id so `sanity.config.ts` can be imported before a project exists.
 *
 * Throwing here instead — which is the obvious thing to write — takes the
 * whole build down: the config is imported statically by the Studio route, a
 * module that throws while evaluating exports nothing, and Turbopack reports
 * it as "Export default doesn't exist in target module" a long way from the
 * cause. The Studio route checks `isSanityConfigured` and renders setup
 * instructions rather than a Studio pointed at nothing.
 */
export const PLACEHOLDER_PROJECT_ID = "not-configured";
