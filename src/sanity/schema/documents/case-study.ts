import { defineField, defineType } from "sanity";

/**
 * A case study.
 *
 * Deliberately thinner than `src/content/case-studies/*.ts`, which carries a
 * six-band narrative structure (at a glance, the challenge, our approach, the
 * outcome, the quote, the confidentiality note). Reproducing all of that as
 * schema before a single case study has been authored in Sanity would be
 * guessing at fields; the bands are a rendering concern and stay in code for
 * now. This document exists so a CTA can REFERENCE a case study — which is
 * what stops a link to one going stale — and so the parts an editor actually
 * revises are editable.
 *
 * Extending it is Batch 2 work, alongside migrating the two existing studies.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedHeading",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "title.en", maxLength: 72 },
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deck",
      title: "Standfirst",
      type: "localizedText",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Featured image",
      type: "media",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "confidential",
      title: "Confidential engagement",
      description:
        "Renders the anonymised treatment: no client name, no logo, and the note about work we cannot name.",
      type: "boolean",
      initialValue: false,
      group: "content",
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      to: [{ type: "testimonial" }],
      group: "content",
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.en", media: "image", confidential: "confidential" },
    prepare: ({ title, media, confidential }) => ({
      title,
      subtitle: confidential ? "Confidential" : undefined,
      media,
    }),
  },
});
