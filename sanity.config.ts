import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  apiVersion,
  dataset,
  PLACEHOLDER_PROJECT_ID,
  projectId,
} from "@/sanity/env";
import { schemaTypes } from "@/sanity/schema";

/**
 * Sanity Studio, served from /studio on this same deployment.
 *
 * Co-hosted rather than run separately so there is one URL, one deploy and one
 * auth surface — an editor goes to arsancg.com/studio and is done.
 *
 * `structureTool` gives the default document lists; `visionTool` is the GROQ
 * playground and is developer-facing. Vision is intentionally left in: it is
 * read-only, it is behind the same auth as the Studio, and it is the fastest
 * way to answer "what is actually in the dataset" when content looks wrong.
 */
export default defineConfig({
  name: "arsan",
  title: "ARSAN",
  basePath: "/studio",
  projectId: projectId ?? PLACEHOLDER_PROJECT_ID,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
