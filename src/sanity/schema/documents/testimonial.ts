import { defineField, defineType } from "sanity";

/**
 * A client testimonial, stored once and referenced wherever it appears.
 *
 * One document rather than a quote typed into each section, so the same words
 * cannot drift into three slightly different versions across the site — and so
 * that withdrawing a quote is one delete, not a search.
 *
 * `approved` is the field that matters. Every testimonial currently on this
 * site was reproduced from a Direction A comp and no client has approved any of
 * them; they are held behind `@unverified` markers that fail
 * `bun run check:launch` (D-071, Q-23). This flag is that gate moved into the
 * CMS, where the person who can actually get approval is the one who ticks it.
 * Unapproved testimonials never reach the published site.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      description:
        "The client's words. No quotation marks — the design adds them.",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientName",
      title: "Name",
      description:
        "Leave empty for an anonymous attribution on a confidential search.",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role",
      description:
        "e.g. “VP of Operations”. Localised — titles differ between markets.",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "org",
      title: "Company",
      description:
        "Or a description of it, if the engagement was confidential.",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approved",
      title: "Approved for publication",
      description:
        "Tick only when this client has approved these exact words. Unticked testimonials never appear on the live site, in either language.",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "org.en", subtitle: "role.en", approved: "approved" },
    prepare: ({ title, subtitle, approved }) => ({
      title: title ?? "Testimonial",
      subtitle: approved ? subtitle : `${subtitle ?? ""} — NOT APPROVED`,
    }),
  },
});
