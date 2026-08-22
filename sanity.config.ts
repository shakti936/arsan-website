import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  apiVersion,
  dataset,
  PLACEHOLDER_PROJECT_ID,
  projectId,
} from "@/sanity/env";
import { schemaTypes } from "@/sanity/schema";
import { structure } from "@/sanity/structure";

/**
 * Sanity Studio, served from /studio on this same deployment.
 *
 * Co-hosted rather than run separately so there is one URL, one deploy and one
 * auth surface — an editor goes to arsancg.com/studio and is done.
 *
 * Three tools, in the order an editor meets them:
 *
 *   - **Presentation** is the default. It opens the site beside the form, shows
 *     unpublished drafts in place, and lets an editor click a heading on the
 *     page to jump to the field that produces it. Starting here rather than on
 *     a list of documents is the difference between a CMS and a database
 *     browser.
 *   - **Structure** is the document lists — see `src/sanity/structure.ts` for
 *     why they are not the default shape.
 *   - **Vision** is the GROQ playground and is developer-facing. Left in
 *     deliberately: read-only, behind the same auth, and the fastest way to
 *     answer "what is actually in the dataset" when content looks wrong.
 */
export default defineConfig({
  name: "arsan",
  title: "ARSAN",
  basePath: "/studio",
  projectId: projectId ?? PLACEHOLDER_PROJECT_ID,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      // relative, so the tool previews whatever origin the Studio is served
      // from — localhost in development, the deployment in production, with
      // nothing to keep in sync
      previewUrl: {
        origin: "same-origin",
        preview: "/",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
