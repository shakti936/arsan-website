import { defineField, defineType } from "sanity";

/**
 * An image, with the alt text required rather than requested.
 *
 * WCAG 2.2 AA is a project floor, not an aspiration, and alt text is the one
 * accessibility obligation a CMS hands to a non-technical editor. Making it a
 * validation error is the only version of "please add alt text" that works.
 * It is localised because a screen-reader user on the Spanish site should not
 * hear English.
 *
 * `hotspot` lets an editor say what matters in the frame. That is the ONLY
 * presentation control in this schema, and it exists because the renderer
 * crops to several aspect ratios and cannot guess where the subject is.
 * Cropping is not styling.
 */
export const media = defineType({
  name: "media",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      description:
        "What the image shows, for screen readers and when it fails to load. Describe the content, not the file.",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
  ],
});
