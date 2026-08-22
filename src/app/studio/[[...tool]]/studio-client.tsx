"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * The `"use client"` boundary is load-bearing, not stylistic.
 *
 * Importing `sanity.config` from a Server Component drags the whole Studio —
 * schema, structure tool, Vision — into the RSC module graph, where Turbopack
 * resolves dependencies through the `react-server` export condition. `swr`
 * ships no default export in that build, so Sanity's `import useSWR from "swr"`
 * fails with "Export default doesn't exist in target module", pointing at a
 * file nobody wrote. Declaring the boundary here compiles everything below it
 * for the browser instead, which is the only place a Studio ever runs.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
