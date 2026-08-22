import { defineField, defineType } from "sanity";

/**
 * Field-level internationalisation.
 *
 * Both languages live on ONE document rather than in two linked documents.
 * That is deliberate and it matches how `src/content/**` already models
 * translated copy (`{ en: {...}, es: {...} }` on a single object): an article
 * cannot exist in English and quietly not exist in Spanish, because there is
 * no second document to forget to create. `validate-messages.mjs` guarantees
 * that parity for the next-intl catalogues; for Sanity, the schema shape is
 * the guarantee.
 *
 * `validation: required` is set on English only. Spanish is required to SHIP —
 * see `publishable()` — but blocking the field would stop an editor saving a
 * draft they are midway through translating.
 */
const LOCALES = [
  { name: "en", title: "English" },
  { name: "es", title: "Español" },
] as const;

/** Both languages, side by side, with English expanded first. */
function localeFields(type: "string" | "text", max?: number, rows?: number) {
  return LOCALES.map(({ name, title }) =>
    defineField({
      name,
      title,
      type,
      ...(rows ? { rows } : {}),
      validation: (rule) => {
        const r = name === "en" ? rule.required() : rule;
        return max ? r.max(max) : r;
      },
    }),
  );
}

/**
 * A short localised string.
 *
 * `maxLength` is not bureaucracy — every heading on this site is set in a
 * balanced measure at a fixed role size, and copy past the measure wraps into
 * layouts that were composed against the comps. The cap is where the design
 * stops working, so it belongs next to the field rather than in a style guide
 * nobody opens.
 */
export const localizedString = defineType({
  name: "localizedString",
  title: "Text (EN / ES)",
  type: "object",
  options: { columns: 2 },
  fields: localeFields("string"),
});

export const localizedHeading = defineType({
  name: "localizedHeading",
  title: "Heading (EN / ES)",
  type: "object",
  options: { columns: 2 },
  fields: localeFields("string", 70),
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Paragraph (EN / ES)",
  type: "object",
  options: { columns: 2 },
  fields: localeFields("text", 320, 4),
});

/**
 * Rich body copy — and the tightest guardrail in the schema.
 *
 * The block styles are a WHITELIST, not a subset chosen for tidiness:
 *
 *   - No H1. Every page has exactly one, it is the page title, and it is a
 *     field — not something a body editor can add a second of.
 *   - No H2. Sections own their headings; an H2 typed into body copy would
 *     render at section-heading size in the middle of a paragraph flow and
 *     break the document outline.
 *   - No colour, size, alignment or font marks. There is no decoration here
 *     at all — the renderer maps `h3` to the subheading role and `normal` to
 *     body, and those are the only two outcomes available.
 *
 * What is left is what prose actually needs: subheadings, emphasis, lists and
 * links. An editor cannot reach the design system through this field.
 */
export const localizedRichText = defineType({
  name: "localizedRichText",
  title: "Body copy (EN / ES)",
  type: "object",
  fields: LOCALES.map(({ name, title }) =>
    defineField({
      name,
      title,
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Body", value: "normal" },
            { title: "Subheading", value: "h3" },
          ],
          lists: [
            { title: "Bulleted", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "internalLink",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "destination",
                    type: "destination",
                    validation: (rule) => rule.required(),
                  }),
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => (name === "en" ? rule.required() : rule),
    }),
  ),
});

/** Every locale a document must carry before it is allowed to publish. */
export const REQUIRED_LOCALES = LOCALES.map((l) => l.name);
