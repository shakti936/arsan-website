import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

/**
 * Turns on Next's draft mode so the site renders unpublished content.
 *
 * `defineEnableDraftMode` validates a signed secret that the Presentation tool
 * appends to the URL, then sets the cookie. That validation is the whole point:
 * without it this route is an open door to every draft in the dataset for
 * anyone who guesses the path.
 *
 * The token is read-only and server-side. It never reaches the browser.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
