import { defineField, defineType } from "sanity";

/**
 * A call to action: what it says, and where it goes.
 *
 * The two are one object because they are one decision. Splitting "CTA text"
 * and "CTA destination" into sibling fields is how a button ends up reading
 * "Read the Case Study" and landing on an index — which is exactly what three
 * of this site's own nav cards did until the link audit (D-088).
 *
 * There is no `variant`, `colour` or `size`. The component that renders a CTA
 * decides how it looks from where it sits; the primary/outline pairing is a
 * layout decision, not a content one.
 */
export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button text",
      description:
        "Lead with the verb — “Discuss a Search” rather than “Learn More”. Keep it under ~28 characters or it wraps.",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destination",
      type: "destination",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label.en", page: "destination.page" },
    prepare: ({ title, page }) => ({ title, subtitle: page }),
  },
});
