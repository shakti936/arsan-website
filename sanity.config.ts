import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { translateAction } from "@/sanity/actions/translate";
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
  document: {
    /**
     * The Translate action belongs only on page-copy documents. Articles and
     * case studies are authored per language by a person; offering a machine
     * translation there would imply an automation that does not exist.
     */
    actions: (prev, context) =>
      context.schemaType.startsWith("copy") ? [...prev, translateAction] : prev,
  },
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      /**
       * Only `previewMode`. `initial` already defaults to `location.origin`
       * and the preview path to `/`, which IS "preview whatever origin the
       * Studio is served from" — localhost in development, the deployment in
       * production, nothing to keep in sync.
       *
       * This previously passed `origin: "same-origin"`, a literal invented for
       * that behaviour rather than read from the type. `origin` is deprecated
       * and wants a real origin (`https://example.com`), so Presentation
       * evaluated `new URL("/", "same-origin")` and crashed the whole tool with
       * "Invalid base URL". `origin?: string` accepts any string, so tsc had
       * nothing to say (D-094).
       */
      previewUrl: {
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
