import { defineArrayMember, defineField, defineType } from "sanity";
import { CATEGORY_OPTIONS } from "@/lib/article-categories";
import { ICON_OPTIONS } from "@/lib/icon-names";

/**
 * An insight article.
 *
 * Publishing one is THE routine content change on this site, and it was the
 * clearest case for the CMS: it used to mean a new file in
 * `src/content/insights/`, a category code, a photo key and a deploy. It means
 * writing now — this document is the source of truth (D-092).
 *
 * `categoryKey` stays an enum of stable codes rather than a free-text label —
 * the same decision as `Article.categoryKey` in the current model (D-084).
 * Filtering, the category tabs and the mega-nav deep links all key off these
 * values; a typed display string would break the filter in one language and
 * not the other.
 */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Article", default: true },
    { name: "rail", title: "Sidebar" },
    { name: "takeaways", title: "Takeaways" },
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
      description:
        "The address of the article. Changing it after publication breaks every existing link to it.",
      type: "slug",
      options: { source: "title.en", maxLength: 72 },
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryKey",
      title: "Category",
      type: "string",
      options: { list: CATEGORY_OPTIONS },
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deck",
      title: "Standfirst",
      description:
        "The sentence under the title, and the card summary on /insights.",
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
      name: "published",
      title: "Publication date",
      description: "Orders /insights and feeds the Article JSON-LD.",
      type: "date",
      group: "content",
      // today, so the common case is already filled in
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Feature on the insights index",
      description: "Gives the article the large card at the top of /insights.",
      type: "boolean",
      initialValue: false,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "localizedArticleBody",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    // ── sidebar ────────────────────────────────────────────────────────────
    // The rail beside the prose. `stat` wins the slot when it is filled and
    // the question list takes it otherwise, which is why neither is required:
    // an article with an unsourced number should lose the number, not gain a
    // hole. Deleting the stat is always safe.
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      description:
        "A sentence lifted out of the article and set large in the sidebar.",
      type: "localizedText",
      group: "rail",
    }),
    defineField({
      name: "pullQuoteBy",
      title: "Attributed to",
      type: "localizedString",
      group: "rail",
    }),
    defineField({
      name: "pullQuoteOrg",
      title: "Second attribution line",
      description: "A company or descriptor under the name. Optional.",
      type: "localizedString",
      group: "rail",
    }),
    defineField({
      name: "stat",
      title: "Figure card",
      description:
        "A number worth pulling out. Needs a source — a figure without one does not render.",
      type: "object",
      group: "rail",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "figure",
          title: "The number",
          description: 'As it should read — "68%", "3.4×".',
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "body",
          title: "What it means",
          type: "localizedText",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "source",
          title: "Source",
          description:
            "Publication and year. Required: an unsourced figure is a claim nobody can check.",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "asideHeading",
      title: "Question list heading",
      description: "Shown in the sidebar when there is no figure card.",
      type: "localizedHeading",
      group: "rail",
    }),
    defineField({
      name: "asideItems",
      title: "Questions",
      description: "What this piece should send a reader back to work with.",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
      group: "rail",
    }),

    // ── takeaways ──────────────────────────────────────────────────────────
    defineField({
      name: "takeawaysHeading",
      title: "Heading",
      type: "localizedHeading",
      group: "takeaways",
    }),
    defineField({
      name: "takeaways",
      title: "Takeaways",
      type: "array",
      group: "takeaways",
      of: [
        defineArrayMember({
          type: "object",
          name: "takeaway",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: { list: ICON_OPTIONS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              type: "localizedHeading",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title.en", subtitle: "icon" } },
        }),
      ],
      // the grid is drawn two-up; one takeaway is not a set and five leaves a
      // widow in the second row
      validation: (rule) => rule.min(2).max(4),
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "categoryKey", media: "image" },
  },
});
