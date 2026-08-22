/**
 * A JSON-LD `<script>`.
 *
 * React has no API for structured data other than `dangerouslySetInnerHTML`,
 * so the suppression lives here once instead of at every page that emits a
 * graph. Two things make it safe rather than merely suppressed: the payload is
 * always built in-process from typed content, and `JSON.stringify` escapes
 * every quote but not `<` — which is what would let a translated string
 * containing `</script>` close the tag early. That one character is escaped
 * below, which is legal JSON and inert to a parser.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: the only way to emit JSON-LD; payload is typed content and `<` is escaped above
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
