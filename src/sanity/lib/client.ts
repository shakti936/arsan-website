import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read-only client for published content.
 *
 * No token: the `production` dataset is public, so a build — anyone's build,
 * with no `.env.local` — can read it. Drafts are a different perspective and
 * do need a token; that lives with the Presentation tool, not here.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
