/**
 * The /insights taxonomy, as codes.
 *
 * A code rather than the display string, because the string is per-locale and
 * a filter keyed on it would match nothing the moment a translator rewords a
 * label (D-084). Labels live in `articleCategories` in the message catalogues;
 * the order and icons live in the component that draws the bar.
 *
 * One list, three consumers that must agree: the Sanity dropdown an editor
 * picks from, the tabs on /insights, and the `?category=` deep links in the
 * mega nav. Splitting it would let a category exist in the CMS with nowhere to
 * appear, or a tab with nothing behind it.
 */
export const CATEGORY_KEYS = [
  "market",
  "hiring",
  "leadership",
  "trends",
  "caseStudy",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

/** For the Studio dropdown. Titles here are English editorial labels; the
 *  site renders `articleCategories.<key>` from the message catalogue. */
export const CATEGORY_OPTIONS: { value: CategoryKey; title: string }[] = [
  { value: "market", title: "Market Insights" },
  { value: "hiring", title: "Hiring & Talent" },
  { value: "leadership", title: "Leadership" },
  { value: "trends", title: "Manufacturing Trends" },
  { value: "caseStudy", title: "Case Study" },
];
