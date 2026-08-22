import type { IconName } from "@/components/ui/icons";

/**
 * Case studies, in typed modules for the same reasons as the articles — see
 * `content/insights/types.ts`.
 *
 * The shape follows refs/dirA-casestudy-*.png, which the three comps share:
 * hero with a meta strip, At a glance, Challenge beside Approach, a dark
 * results band, an optional client quote, key roles, and a close.
 *
 * **What is deliberately optional, and why.**
 *
 * A case study is not an opinion piece. Every line of it is a factual claim
 * about work performed for a client, and the two most persuasive parts are
 * the two nobody but ARSAN can supply:
 *
 * - `figure` on a glance item. The mexico-plant comp puts "18+", "6 Months"
 *   and "100%" here. Those numbers describe a real engagement and were not
 *   provided by anyone who ran it. The merger comp's own glance strip is
 *   qualitative — icon and label, no figures — which is the form all three
 *   ship in until Armida provides measured outcomes.
 * - `quote`. The comps attribute a testimonial to "VP of Human Resources,
 *   Global HVAC Manufacturer". Writing a client's words for them is the one
 *   thing on this site that cannot be walked back.
 *
 * Both render the moment they are filled in (SOP Q-22).
 */
export type GlanceItem = {
  icon: IconName;
  /** A measured outcome. Renders large above the label; omit unless sourced. */
  figure?: string;
  label: string;
};

export type IconPoint = { icon: IconName; title: string; body: string };

export type CaseStudyCopy = {
  title: string;
  /** Standfirst under the headline. */
  deck: string;
  metaTitle: string;
  metaDescription: string;
  imageAlt: string;
  /** The hero's Industry / Location / Focus strip. */
  meta: { icon: IconName; label: string }[];
  /** Optional hero button — the confidential search comp carries one. */
  heroCta?: string;

  glanceHeading: string;
  glanceBody: string;
  glance: GlanceItem[];

  challengeHeading: string;
  challengeIntro: string;
  challengeListHeading: string;
  challenges: string[];

  approachHeading: string;
  approachIntro: string;
  approach: IconPoint[];

  resultsHeading: string;
  resultsBody: string;
  results: IconPoint[];

  rolesHeading: string;
  roles: string[];

  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;

  /** Client testimonial. Unset on all three — see the note above. */
  quote?: { text: string; role: string; org: string };
};

export type CaseStudy = {
  slug: string;
  /** basename in public/images, shared with the study's OG card */
  photo: string;
  en: CaseStudyCopy;
  es: CaseStudyCopy;
};
