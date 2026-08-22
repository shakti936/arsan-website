import { highStakesCriticalSearch } from "./high-stakes-critical-search";
import { mexicoPlantLeadership } from "./mexico-plant-leadership";
import { postMergerExecutiveTeam } from "./post-merger-executive-team";
import type { CaseStudy, CaseStudyCopy } from "./types";

export type { CaseStudy, CaseStudyCopy, GlanceItem, IconPoint } from "./types";

/**
 * The three case studies, in the order `home.stories` already lists them so
 * the teaser and the page it opens never disagree.
 *
 * No study carries `figure` on a glance item and none carries a `quote`. Those
 * are the two things only ARSAN can supply and the two the comps invent — see
 * the note in `types.ts` and SOP Q-22.
 */
export const CASE_STUDIES: readonly CaseStudy[] = [
  mexicoPlantLeadership,
  postMergerExecutiveTeam,
  highStakesCriticalSearch,
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}

/** The locale's copy, falling back to English for an unknown locale. */
export function caseStudyCopy(study: CaseStudy, locale: string): CaseStudyCopy {
  return locale === "es" ? study.es : study.en;
}
