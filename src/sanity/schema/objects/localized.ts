import { defineArrayMember, defineField, defineType } from "sanity";

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
/**
 * A numbered spine — the treatment the article comps use for "five traits
 * that separate high-performing leaders".
 *
 * A first-class block rather than a numbered list with the title run in bold,
 * which is what the first migration produced. Rendered side by side against
 * the original, the run-in was plainly worse: each step lost the serif
 * subheading that made it a titled point and became a dense paragraph. A
 * generic list cannot express "heading plus prose, numbered" — so this is the
 * shape, and an editor gets a form with two fields per step instead of a
 * convention to remember.
 */
const steps = defineArrayMember({
  type: "object",
  name: "steps",
  title: "Numbered steps",
  fields: [
    defineField({
      name: "items",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "body",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }: { items?: unknown[] }) => ({
      title: `Numbered steps (${items?.length ?? 0})`,
    }),
  },
});

type ArrayMember = ReturnType<typeof defineArrayMember>;

function richTextFields(
  styles: { title: string; value: string }[],
  extra: ArrayMember[] = [],
) {
  return LOCALES.map(({ name, title }) =>
    defineField({
      name,
      title,
      type: "array",
      of: [
        ...extra,
        defineArrayMember({
          type: "block",
          styles,
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
        }),
      ],
      validation: (rule) => (name === "en" ? rule.required() : rule),
    }),
  );
}

/**
 * Body copy INSIDE a page section. Subheadings only.
 *
 * The section already owns the H2 above this field, so an H2 typed in here
 * would render at section-heading size mid-paragraph and put a second sibling
 * in the outline.
 */
export const localizedRichText = defineType({
  name: "localizedRichText",
  title: "Body copy (EN / ES)",
  type: "object",
  fields: richTextFields([
    { title: "Body", value: "normal" },
    { title: "Subheading", value: "h3" },
  ]),
});

/**
 * The body of an ARTICLE, which is a document rather than a band on a page.
 *
 * Its section headings genuinely are H2s — the H1 is the article title and
 * nothing else competes for that level — so this is the one body field where
 * H2 belongs. Sharing `localizedRichText` here looked tidy right up until the
 * first real article was migrated and its four section headings had nowhere
 * above H3 to go, which would have flattened every article's outline to
 * H1 → H3. Two types, because they are two different documents.
 */
export const localizedArticleBody = defineType({
  name: "localizedArticleBody",
  title: "Article body (EN / ES)",
  type: "object",
  fields: richTextFields(
    [
      { title: "Body", value: "normal" },
      { title: "Section heading", value: "h2" },
      { title: "Subheading", value: "h3" },
    ],
    [steps],
  ),
});

/** Every locale a document must carry before it is allowed to publish. */
export const REQUIRED_LOCALES = LOCALES.map((l) => l.name);
