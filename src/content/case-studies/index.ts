import { mexicoPlantLeadership } from "./mexico-plant-leadership";
import { postMergerExecutiveTeam } from "./post-merger-executive-team";
import type { CaseStudy, CaseStudyCopy } from "./types";

export type {
  ApproachStep,
  CaseStudy,
  CaseStudyCopy,
  CaseStudyVariant,
  ChallengeItem,
  GlanceItem,
  IconPoint,
  ResultItem,
} from "./types";

/**
 * The case studies that use this template.
 *
 * There are two, not three. The third comp — "From Vacant to Victorious" —
 * lays its case study out as an article, breadcrumbs and all, so it lives in
 * `content/insights/` under the template it actually uses rather than being
 * forced through this one.
 */
export const CASE_STUDIES: readonly CaseStudy[] = [
  mexicoPlantLeadership,
  postMergerExecutiveTeam,
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((s) => s.slug === slug);
}

/** The locale's copy, falling back to English for an unknown locale. */
export function caseStudyCopy(study: CaseStudy, locale: string): CaseStudyCopy {
  return locale === "es" ? study.es : study.en;
}
