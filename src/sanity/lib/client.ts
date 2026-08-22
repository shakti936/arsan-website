import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Field names whose value is a key, a code or a date — never display text.
 * Matched on the LAST path segment, so `takeaways[2].icon` is covered too.
 */
const IDENTIFIER_FIELDS = new Set([
  "categoryKey",
  "icon",
  "published",
  "current", // slug.current
  "url",
  "href",
  "route",
  "kind",
  "_type",
  "_key",
  "_id",
]);

/**
 * Read-only client for published content.
 *
 * No token: the `production` dataset is public, so a build — anyone's build,
 * with no `.env.local` — can read it. Drafts are a different perspective and
 * do need a token; that lives with the Presentation tool, not here.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  /**
   * Click-to-edit. In draft mode the fetched strings carry invisible markers
   * pointing back at the field that produced them, which is what lets an
   * editor click a headline in the Presentation preview and land on it in the
   * form. The markers are stripped outside draft mode, so published HTML is
   * unaffected.
   */
  stega: {
    studioUrl: "/studio",
    /**
     * Never encode a string that is used as an identifier.
     *
     * Stega appends invisible characters to *every* string it is given, and
     * that is correct for prose and wrong for anything the code compares,
     * looks up or parses. `categoryKey` feeds `t(...)` and threw
     * MISSING_MESSAGE; `icon` indexes the icon map and would render nothing;
     * `published` goes through `new Date()` and would be Invalid Date. All
     * three are invisible until someone opens Presentation, because stega is
     * only on in draft mode (D-095).
     *
     * Filtering here rather than calling `stegaClean` at each use: the client
     * is what adds the encoding, so it is what should decide where. A call
     * site can be forgotten; this cannot.
     */
    filter: (props) => {
      const leaf = props.sourcePath.at(-1);
      return IDENTIFIER_FIELDS.has(String(leaf))
        ? false
        : props.filterDefault(props);
    },
  },
});
