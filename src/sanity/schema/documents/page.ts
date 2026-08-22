import { defineField, defineType } from "sanity";
import { ROUTE_OPTIONS } from "@/lib/routes";
import { SECTION_TYPES } from "../objects/sections";

/**
 * A page: its hero, an ordered list of sections, and its metadata.
 *
 * The route is CHOSEN from the app router's real paths rather than typed as a
 * slug, because this site's pages are files — Sanity supplies their content,
 * it does not create them. An editor cannot invent `/servcies` and wonder why
 * nothing renders, and cannot orphan a page by renaming its slug.
 *
 * Note what is not here: no layout, no theme, no spacing, no section widths.
 * The three heading fields below are the roles from `08-design-system.md`, and
 * choosing between them is a choice about MEANING — is this the page's title
 * or its marketing headline — which then determines the size. That is the
 * inversion the whole batch is built on: editors pick roles, the design system
 * picks sizes, and neither can reach into the other.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "route",
      title: "Which page is this?",
      type: "string",
      options: { list: ROUTE_OPTIONS },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "title",
      title: "Page title",
      description: "The H1. One per page — this is it. Says what the page IS.",
      type: "localizedHeading",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emphasis",
      title: "Accent phrase",
      description:
        "A phrase copied out of the title above, set in gold italic. It must appear in the title word for word or it is ignored — write the sentence first, then copy the part to accent.",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "intro",
      title: "Supporting copy",
      description: "The sentence under the title. Two lines at most.",
      type: "localizedText",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Featured image",
      type: "media",
      group: "hero",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary button",
      type: "cta",
      group: "hero",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary button",
      type: "cta",
      group: "hero",
    }),

    defineField({
      name: "sections",
      title: "Sections",
      description:
        "Drag to reorder. Toggle “Hidden” on a section to take it off the live page without losing its copy.",
      type: "array",
      of: SECTION_TYPES,
      group: "sections",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "route" },
  },
});
