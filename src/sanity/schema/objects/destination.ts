import { defineField, defineType } from "sanity";
import { ROUTE_OPTIONS } from "@/lib/routes";

/**
 * Where a link goes — chosen, never typed.
 *
 * A free-text URL field is how a CMS ships 404s: someone pastes a path with a
 * typo, or links to a page that is later renamed, and nothing complains until
 * a visitor hits it. Every option here is either a route that exists
 * (`SITE_ROUTES`) or a reference to a document, which Sanity itself keeps
 * honest — rename an article and every link to it follows.
 *
 * External URLs are still allowed, because sometimes the destination really is
 * somewhere else, but they are a deliberate choice rather than the default and
 * they are the only branch where an editor types a URL at all.
 */
export const destination = defineType({
  name: "destination",
  title: "Destination",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Link to",
      type: "string",
      initialValue: "page",
      options: {
        list: [
          { title: "A page on this site", value: "page" },
          { title: "An article", value: "article" },
          { title: "A case study", value: "caseStudy" },
          { title: "Somewhere else", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      options: { list: ROUTE_OPTIONS },
      hidden: ({ parent }) => parent?.kind !== "page",
      validation: (rule) =>
        rule.custom((value, ctx) =>
          (ctx.parent as { kind?: string })?.kind === "page" && !value
            ? "Choose a page"
            : true,
        ),
    }),
    defineField({
      name: "article",
      title: "Article",
      type: "reference",
      to: [{ type: "article" }],
      hidden: ({ parent }) => parent?.kind !== "article",
    }),
    defineField({
      name: "caseStudy",
      title: "Case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
      hidden: ({ parent }) => parent?.kind !== "caseStudy",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.kind !== "external",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https", "mailto", "tel"] })
          .custom((value, ctx) =>
            (ctx.parent as { kind?: string })?.kind === "external" && !value
              ? "Enter a URL"
              : true,
          ),
    }),
    defineField({
      name: "anchor",
      title: "Jump to a section (optional)",
      description:
        "The id of a section on the destination page, without the #. Leave empty to land at the top.",
      type: "string",
      hidden: ({ parent }) => parent?.kind === "external",
    }),
  ],
  preview: {
    select: { kind: "kind", page: "page", url: "url" },
    prepare: ({ kind, page, url }) => ({
      title: page ?? url ?? kind ?? "Not set",
    }),
  },
});
