import { defineField, defineType } from "sanity";

/**
 * An insight article.
 *
 * Publishing one is THE routine content change on this site, and it is the
 * clearest case for the CMS: today it means a new file in
 * `src/content/insights/`, a category code, a photo key and a deploy. It
 * should mean writing.
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
      options: {
        list: [
          { title: "Market Insights", value: "market" },
          { title: "Hiring & Talent", value: "hiring" },
          { title: "Leadership", value: "leadership" },
          { title: "Manufacturing Trends", value: "trends" },
          { title: "Case Study", value: "caseStudy" },
        ],
      },
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
      type: "date",
      group: "content",
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
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "categoryKey", media: "image" },
  },
});
