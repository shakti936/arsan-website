import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Read-only client for published content.
 *
 * `null` when no project is configured, which is the normal state until the
 * migration lands — callers go through `src/sanity/lib/content.ts` and never
 * touch this directly, so there is exactly one place that has to know.
 */
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
