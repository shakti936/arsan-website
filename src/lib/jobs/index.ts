import { PLACEHOLDER_OPENINGS } from "./placeholder-openings";
import type { Country, Employment, JobFunction, Level, Opening } from "./types";

export type {
  Country,
  Employment,
  JobFunction,
  Level,
  Localized,
  Opening,
  WorkMode,
} from "./types";
export { openingCopy } from "./types";

/**
 * The seam between this site and the system that will own jobs.
 *
 * CLAUDE.md is explicit that the public site does not own jobs, candidates or
 * auth — a separate internal repo will, and this site is a client of it. So
 * every consumer goes through `listOpenings()`, it is `async` from the first
 * day even though today it resolves from a local array, and nothing outside
 * this directory imports the fixture. When the ATS lands, this function grows
 * a `fetch` and `placeholder-openings.ts` is deleted; no page changes.
 *
 * The fixture is fabricated. See SOP Q-24 — `bun run check:launch` fails while
 * it is still wired up.
 */
export async function listOpenings(now = Date.now()): Promise<Opening[]> {
  const day = 24 * 60 * 60 * 1000;

  return PLACEHOLDER_OPENINGS.map(({ daysAgo, ...rest }) => ({
    ...rest,
    // the ATS will supply a real id; a stable synthetic one keeps React keys
    // and any future analytics honest in the meantime
    id: `placeholder-${rest.slug}`,
    postedAt: new Date(now - daysAgo * day).toISOString(),
  })).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export async function getOpening(slug: string, now = Date.now()) {
  return (await listOpenings(now)).find((opening) => opening.slug === slug);
}

/**
 * Same function first, then anything else, newest first. Relevance scoring
 * over twenty-nine rows would be a ranking function applied to a set you can
 * read in full; the ATS can do better once the set is large enough to need it.
 */
export function similarOpenings(openings: Opening[], to: Opening, count = 3) {
  const others = openings.filter((opening) => opening.slug !== to.slug);
  return [
    ...others.filter((opening) => opening.fn === to.fn),
    ...others.filter((opening) => opening.fn !== to.fn),
  ].slice(0, count);
}

/* ------------------------------------------------------------------ */
/* filtering                                                           */
/* ------------------------------------------------------------------ */

export type Facet = "employment" | "country" | "fn" | "level";

export type Filters = {
  q: string;
  employment: Employment[];
  country: Country[];
  fn: JobFunction[];
  level: Level[];
};

/**
 * The comp opens with Full-time checked, which is why the board shows 24 of
 * the 29 openings on load and the count in the header agrees with the facet.
 */
export const DEFAULT_FILTERS: Filters = {
  q: "",
  employment: ["full-time"],
  country: [],
  fn: [],
  level: [],
};

export const NO_FILTERS: Filters = {
  q: "",
  employment: [],
  country: [],
  fn: [],
  level: [],
};

/** How recent a posting has to be to earn the NEW chip. */
const NEW_WITHIN_DAYS = 4;

export function isNew(opening: Opening, now: number) {
  return now - Date.parse(opening.postedAt) < NEW_WITHIN_DAYS * 86_400_000;
}

function matchesText(opening: Opening, q: string) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [
    opening.title.en,
    opening.title.es,
    opening.company.en,
    opening.company.es,
    opening.location.en,
    opening.location.es,
  ].some((value) => value.toLowerCase().includes(needle));
}

/**
 * `except` drops one facet from the predicate. Facet counts are computed with
 * that facet's own selections ignored, so "Mexico (12)" answers "how many if I
 * checked this" rather than "how many are already showing" — which is what a
 * count next to an unchecked box has to mean to be worth printing.
 */
function matches(opening: Opening, filters: Filters, except?: Facet) {
  const active = <T extends string>(facet: Facet, selected: T[], value: T) =>
    facet === except || selected.length === 0 || selected.includes(value);

  return (
    matchesText(opening, filters.q) &&
    active("employment", filters.employment, opening.employment) &&
    active("country", filters.country, opening.country) &&
    active("fn", filters.fn, opening.fn) &&
    active("level", filters.level, opening.level)
  );
}

export function filterOpenings(openings: Opening[], filters: Filters) {
  return openings.filter((opening) => matches(opening, filters));
}

/** `{ [facet]: { [value]: count } }`, each facet counted without its own filter. */
export function facetCounts(openings: Opening[], filters: Filters) {
  const tally = (facet: Facet, key: (o: Opening) => string) => {
    const counts: Record<string, number> = {};
    for (const opening of openings) {
      if (!matches(opening, filters, facet)) continue;
      const value = key(opening);
      counts[value] = (counts[value] ?? 0) + 1;
    }
    return counts;
  };

  return {
    employment: tally("employment", (o) => o.employment),
    country: tally("country", (o) => o.country),
    fn: tally("fn", (o) => o.fn),
    level: tally("level", (o) => o.level),
  };
}

export const EMPLOYMENT_ORDER: Employment[] = [
  "full-time",
  "contract",
  "temporary",
];
export const COUNTRY_ORDER: Country[] = ["us", "mx"];
export const LEVEL_ORDER: Level[] = [
  "entry",
  "mid",
  "manager",
  "senior",
  "executive",
];
export const FUNCTION_ORDER: JobFunction[] = [
  "sales",
  "operations",
  "engineering",
  "supply-chain",
  "finance",
  "human-resources",
  "quality",
];
