import { defineField, defineType } from "sanity";

/**
 * The section catalogue.
 *
 * A page is an ORDERED LIST OF KNOWN SECTIONS, not a free canvas. That is the
 * whole safety model: an editor can reorder sections, hide one, and rewrite
 * every word inside it, and there is no reachable state where the page stops
 * looking like this site. There is no column control, no spacing control, no
 * background picker and no "custom HTML" escape hatch — each type renders
 * through the component that already draws that band, so the design system is
 * not something the CMS can express, let alone break.
 *
 * Adding a section type is a code change on purpose. That is the boundary
 * Drew asked for: content is editable without Claude Code, structure is not.
 */

/** On every section: reorder by dragging, hide without deleting. */
const common = [
  defineField({
    name: "hidden",
    title: "Hidden",
    description:
      "Keeps the section and its copy but removes it from the live page. Use this instead of deleting — a deleted section takes its translations with it.",
    type: "boolean",
    initialValue: false,
  }),
];

const heading = defineField({
  name: "heading",
  title: "Section heading",
  type: "localizedHeading",
  validation: (rule) => rule.required(),
});

const badge = (title: string) => ({
  select: { en: "heading.en", hidden: "hidden" },
  prepare: ({ en, hidden }: { en?: string; hidden?: boolean }) => ({
    title: en ?? title,
    subtitle: hidden ? `${title} · hidden` : title,
  }),
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Text section",
  type: "object",
  fields: [
    heading,
    defineField({
      name: "body",
      title: "Body copy",
      type: "localizedRichText",
    }),
    ...common,
  ],
  preview: badge("Text section"),
});

export const mediaSection = defineType({
  name: "mediaSection",
  title: "Text with image",
  type: "object",
  fields: [
    heading,
    defineField({
      name: "body",
      title: "Body copy",
      type: "localizedRichText",
    }),
    defineField({
      name: "image",
      title: "Featured image",
      type: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Call to action (optional)",
      type: "cta",
    }),
    ...common,
  ],
  preview: badge("Text with image"),
});

export const cardsSection = defineType({
  name: "cardsSection",
  title: "Card row",
  type: "object",
  fields: [
    heading,
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "title",
              type: "localizedHeading",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "body", type: "localizedText" }),
            defineField({ name: "cta", type: "cta" }),
          ],
          preview: { select: { title: "title.en" } },
        },
      ],
      // three across is the row this site draws; two and four both have a
      // layout, five does not
      validation: (rule) => rule.required().min(2).max(4),
    }),
    ...common,
  ],
  preview: badge("Card row"),
});

export const quoteSection = defineType({
  name: "quoteSection",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "testimonial",
      title: "Testimonial",
      description:
        "Pick one. Edit the words on the testimonial itself so the same quote stays consistent everywhere it appears.",
      type: "reference",
      to: [{ type: "testimonial" }],
      validation: (rule) => rule.required(),
    }),
    ...common,
  ],
  preview: {
    select: { title: "testimonial.org", hidden: "hidden" },
    prepare: ({ title, hidden }) => ({
      title: title ?? "Testimonial",
      subtitle: hidden ? "Testimonial · hidden" : "Testimonial",
    }),
  },
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call-to-action band",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Marketing headline",
      description:
        "The persuasion moment — a question or a promise, not a label.",
      type: "localizedHeading",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Supporting copy",
      type: "localizedText",
    }),
    defineField({
      name: "cta",
      type: "cta",
      validation: (rule) => rule.required(),
    }),
    ...common,
  ],
  preview: {
    select: { en: "headline.en", hidden: "hidden" },
    prepare: ({ en, hidden }) => ({
      title: en ?? "Call-to-action band",
      subtitle: hidden ? "CTA band · hidden" : "CTA band",
    }),
  },
});

export const SECTION_TYPES = [
  { type: "richTextSection" },
  { type: "mediaSection" },
  { type: "cardsSection" },
  { type: "quoteSection" },
  { type: "ctaSection" },
];
