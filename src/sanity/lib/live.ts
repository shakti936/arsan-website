import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Live content: the site re-renders as an editor types in the Studio.
 *
 * `sanityFetch` reads published content normally and switches to drafts when
 * Next's draft mode is on, which is what makes the Presentation tool show
 * unpublished work in place rather than a stale published page.
 *
 * The token is the same viewer token the preview routes use — read-only, and
 * server-side only, which is why it is not `NEXT_PUBLIC_`. It is passed as
 * `serverToken` only: handing the browser a token would put a credential that
 * can read every draft in the dataset into a public bundle. The cost is that
 * live updates are proxied through the server rather than opened directly from
 * the browser, which is the correct trade for a client's unpublished content.
 *
 * Absent token — a fresh clone, or a deploy before the secret is set — is a
 * supported state: published reads work, drafts simply do not resolve.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
});
