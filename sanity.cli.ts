import { defineCliConfig } from "sanity/cli";

/**
 * Config for the `sanity` CLI — `datasets`, `documents query`, `cors`,
 * `schema validate`.
 *
 * Reads the same two env vars the app does rather than hardcoding the ids,
 * which is what `sanity init` would have written. They are `NEXT_PUBLIC_`
 * because they ship to the browser inside the Studio bundle; neither is a
 * secret, and the project id never changes. One source beats two that agree
 * until the day they don't.
 *
 * The CLI loads `.env.local` itself, so these resolve without `--env-file`.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
