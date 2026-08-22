/**
 * Message keys ↔ Sanity field names.
 *
 * Sanity field names cannot contain a hyphen, and six message keys do —
 * `employment["full-time"]`, `forms.services["executive-search"]` and friends.
 * They are enum codes used as lookup keys, but their VALUES are display text
 * an editor should own: they are the job-board filter labels and the service
 * options in the contact form's dropdown.
 *
 * Skipping them left words on the page that could not be edited, with nothing
 * to explain why. Encoding the hyphen instead keeps the catalogue key
 * authoritative and makes the field legal in Sanity.
 *
 * `__` is the marker. No message key contains a double underscore, so the
 * round trip is lossless — `scripts/generate-copy-schema.mjs` checks this at
 * generation time and refuses to emit a colliding key.
 */
export const toFieldName = (key: string): string => key.replace(/-/g, "__");
export const toMessageKey = (field: string): string =>
  field.replace(/__/g, "-");
