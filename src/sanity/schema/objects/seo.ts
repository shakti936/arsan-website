import { defineField, defineType } from "sanity";

/**
 * Search and social metadata.
 *
 * Every field is optional and every one falls back to the page's own content —
 * an empty SEO tab produces correct metadata, it does not produce blank tags.
 * A required SEO title would mean an editor writing the headline twice, and
 * the second copy is the one that goes stale.
 *
 * The lengths are where Google truncates (~60 title, ~155 description) and are
 * warnings rather than errors: a 62-character title is a judgement call, not a
 * mistake, and a schema that blocks saving over it just teaches people to pad.
 */
export const seo = defineType({
  name: "seo",
  title: "Search & social",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      description:
        "Defaults to the page title. ~60 characters before Google truncates.",
      type: "localizedString",
      validation: (rule) =>
        rule
          .custom((value?: { en?: string; es?: string }) => {
            const long = Object.values(value ?? {}).find(
              (v) => typeof v === "string" && v.length > 60,
            );
            return long
              ? "Longer than ~60 characters — Google will truncate it."
              : true;
          })
          .warning(),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      description: "Defaults to the page intro. ~155 characters.",
      type: "localizedText",
      validation: (rule) =>
        rule
          .custom((value?: { en?: string; es?: string }) => {
            const long = Object.values(value ?? {}).find(
              (v) => typeof v === "string" && v.length > 155,
            );
            return long
              ? "Longer than ~155 characters — search results will cut it off."
              : true;
          })
          .warning(),
    }),
    defineField({
      name: "ogImage",
      title: "Social sharing image",
      description:
        "Shown when the page is shared. Leave empty to use the generated ARSAN card, which is usually the better choice.",
      type: "media",
    }),
  ],
});
