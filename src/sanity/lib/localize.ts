/** A field authored in both languages. */
export type Localized<T> = { en?: T | null; es?: T | null };

/**
 * Read one language out of a localised field.
 *
 * Falls back to English rather than rendering nothing. A Spanish page with one
 * untranslated paragraph is a page with one untranslated paragraph; a Spanish
 * page with a hole in it is a bug, and the hole is invisible in a diff. The
 * project rule is that Spanish ships — this makes a missing translation
 * *visible in production* rather than silently blank, and
 * `scripts/validate-messages.mjs` remains the build-time guarantee for the
 * strings that live in code.
 */
export function pick<T>(
  field: Localized<T> | null | undefined,
  locale: string,
): T | undefined {
  if (!field) return undefined;
  const exact = locale === "es" ? field.es : field.en;
  return exact ?? field.en ?? undefined;
}
