import type { IconName } from "@/components/ui/icons";

/**
 * Case studies, in typed modules for the same reasons as the articles — see
 * `content/insights/types.ts`.
 *
 * **Two treatments, not two page types.** The comps show the same bands in the
 * same order with two different registers, and they hang together: the Mexico
 * study leads with measured outcomes (figures, bulleted challenges, an icon
 * process, a named roles list), and the merger study leads with discretion
 * (qualitative glance cards, a checked challenge list, a numbered process, a
 * centered outcome strip, a confidentiality note, no roles). That is one
 * `variant` rather than six independent flags, because five of the six
 * combinations those flags would allow are not designs anyone drew.
 *
 * Sections that a study simply may or may not have — `quote`, `note`, `roles`
 * — are driven by presence instead, so adding one is adding content.
 *
 * **Unverified content.** `figure` on a glance item and `quote` are the two
 * most persuasive things on the page and the two only ARSAN can supply. The
 * comps invent both. Drew asked for the comps reproduced as drawn (D-071), so
 * they are here with `@unverified` markers and `bun run check:launch` fails
 * while they remain. See SOP Q-23.
 */
export type CaseStudyVariant = "outcomes" | "confidential";

export type GlanceItem = {
  /** Rendered above the label on the confidential treatment. */
  icon?: IconName;
  /** A measured outcome — the outcomes treatment sets this instead of an icon. */
  figure?: string;
  /** Unit beside the figure, set smaller on the same line: "6" + "Months". */
  unit?: string;
  /** Serif heading on the confidential treatment; absent on the outcomes one. */
  title?: string;
  label: string;
};

export type IconPoint = { icon: IconName; title: string; body: string };

/** A challenge line. `lead` turns the bullet into a check with a bold run-in. */
export type ChallengeItem = { lead?: string; text: string };

/** An approach step. With an `icon` it renders as a chip; without, as a numbered disc. */
export type ApproachStep = { icon?: IconName; title: string; body: string };

/** An outcome. `body` is absent on the confidential treatment's centered strip. */
export type ResultItem = { icon: IconName; title: string; body?: string };

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
  /** Bold line over a bulleted challenge list. Omitted by the checked variant. */
  challengeListHeading?: string;
  challenges: ChallengeItem[];

  approachHeading: string;
  approachIntro: string;
  approach: ApproachStep[];

  resultsHeading: string;
  resultsBody: string;
  results: ResultItem[];

  /** Key roles placed. Both fields or neither — the merger study has no list. */
  rolesHeading?: string;
  roles?: string[];

  /** Client testimonial. */
  quote?: { text: string; role: string; org: string };

  /** The confidentiality band under the quote. */
  note?: { title: string; body: string };

  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
};

export type CaseStudy = {
  slug: string;
  variant: CaseStudyVariant;
  /** basename in public/images, shared with the study's OG card */
  photo: string;
  en: CaseStudyCopy;
  es: CaseStudyCopy;
};
