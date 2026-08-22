import { isSanityConfigured } from "@/sanity/env";
import { StudioSetup } from "./setup";
import StudioClient from "./studio-client";

/**
 * Sanity Studio at /studio.
 *
 * Dynamic, not static: the Studio renders entirely client-side and owns its
 * own routing below this segment. This file stays a Server Component so it can
 * export metadata; the Studio itself is behind a client boundary — see
 * `studio-client.tsx` for why that matters.
 */
export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  // Rendering a Studio pointed at a project that does not exist gives an
  // editor a spinner and a console error. Say what is missing instead.
  if (!isSanityConfigured) return <StudioSetup />;
  return <StudioClient />;
}
