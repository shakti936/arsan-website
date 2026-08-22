/**
 * Job openings, shaped the way the internal ATS will hand them over.
 *
 * **This site does not own jobs.** Per CLAUDE.md and SOP D-023 the public site
 * is a *client* of a separate internal system that will own jobs, candidates,
 * clients and locations. Nothing here is a schema — it is the contract the
 * board renders against, so that when the ATS lands the only file that changes
 * is the provider behind `listOpenings()`.
 *
 * Two consequences of that, both deliberate:
 *
 * - Enumerations travel as codes, not display strings. `level: "manager"`
 *   becomes "Manager Level" or "Nivel Gerencial" through `messages`, because a
 *   backend that has no opinion about locale is the only kind that can serve
 *   both. The same applies to `employment`, `fn` and `workMode`.
 * - Anything genuinely per-listing prose — the title, the client descriptor,
 *   the summary, the city line — carries both locales, because that is text a
 *   recruiter writes and a translator edits, not a code the site can map.
 */
export type Employment = "full-time" | "contract" | "temporary";

export type Level = "entry" | "mid" | "manager" | "senior" | "executive";

export type JobFunction =
  | "sales"
  | "operations"
  | "engineering"
  | "supply-chain"
  | "finance"
  | "human-resources"
  | "quality";

export type WorkMode = "onsite" | "hybrid" | "remote";

export type Country = "us" | "mx";

/** Prose the ATS stores per locale. */
export type Localized = { en: string; es: string };

export type Opening = {
  /** The ATS's own identifier. Not derived from anything on this site. */
  id: string;
  slug: string;
  /** ISO 8601. Rendered as "Posted 3 days ago" against the request time. */
  postedAt: string;
  title: Localized;
  /**
   * The client, or a descriptor when the search is confidential — most ARSAN
   * searches are. Both locales because "Automotive Supplier" is prose.
   */
  company: Localized;
  /** City line without the work mode: "Saltillo, Coahuila, Mexico". */
  location: Localized;
  country: Country;
  workMode: WorkMode;
  employment: Employment;
  level: Level;
  fn: JobFunction;
  summary: Localized;
};

export function openingCopy(opening: Opening, locale: string) {
  const pick = (value: Localized) => (locale === "es" ? value.es : value.en);
  return {
    title: pick(opening.title),
    company: pick(opening.company),
    location: pick(opening.location),
    summary: pick(opening.summary),
  };
}
