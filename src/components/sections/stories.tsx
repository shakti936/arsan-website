import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CASE_STUDIES } from "@/content/case-studies";

const STORY_COUNT = 3;

/**
 * One photograph and one case study per story, in the order the copy lists
 * them. `CASE_STUDIES` is declared in the same order, so the teaser and the
 * page it opens can't drift — the teaser copy stays in messages because the
 * comps write it in a different register from the study's own headline
 * (sentence case with a summary, against the study's title case and deck).
 */
const STORY_IMAGES = [
  "story-mexico-expansion",
  "story-transformation",
  "story-critical-search",
] as const;

export function Stories({
  headingOverride,
}: {
  headingOverride?: string;
} = {}) {
  const t = useTranslations("home.stories");

  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>{headingOverride ?? t("heading")}</SectionHeading>
          <ArrowLink href="/results">{t("viewAll")}</ArrowLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {Array.from({ length: STORY_COUNT }, (_, i) => (
            <Reveal
              key={t(`items.${i}.title`)}
              delay={i * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col border border-cream-100 bg-white-warm shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
                <Plate
                  variant={(["a", "b", "c"] as const)[i % 3]}
                  src={`/images/${STORY_IMAGES[i]}.jpg`}
                  alt={t(`items.${i}.imageAlt`)}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-44"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow eyebrow-block text-brass-600">
                    {t(`items.${i}.category`)}
                  </p>
                  <h3 className="mt-3 font-display text-display-sm font-semibold leading-snug text-navy-900 text-balance">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-base text-navy-800">
                    {t(`items.${i}.body`)}
                  </p>
                  <div className="mt-5">
                    <ArrowLink href={`/results/${CASE_STUDIES[i]?.slug ?? ""}`}>
                      {t("readStory")}
                    </ArrowLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
