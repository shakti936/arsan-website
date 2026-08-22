import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * One photograph and one destination per story, in the order the copy lists
 * them. The teaser copy stays in messages because the comps write it in a
 * different register from the study's own headline (sentence case with a
 * summary, against the study's title case and deck).
 *
 * The third goes to /insights rather than /results: its comp lays the study
 * out as an article, so that is where the page lives. Written out here rather
 * than indexed off `CASE_STUDIES`, which is what used to hold the link and
 * broke silently the moment the two lists stopped matching one-to-one.
 */
const STORIES = [
  { image: "story-mexico-expansion", href: "/results/mexico-plant-leadership" },
  {
    image: "story-transformation",
    href: "/results/post-merger-executive-team",
  },
  {
    image: "story-critical-search",
    href: "/insights/from-vacant-to-victorious",
  },
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
          {STORIES.map((story, i) => (
            <Reveal
              key={t(`items.${i}.title`)}
              delay={i * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col border border-cream-100 bg-white-warm shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
                <Plate
                  variant={(["a", "b", "c"] as const)[i % 3]}
                  src={`/images/${story.image}.jpg`}
                  alt={t(`items.${i}.imageAlt`)}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-44"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow eyebrow-block text-brass-600">
                    {t(`items.${i}.category`)}
                  </p>
                  <h3 className="mt-3 font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-base text-navy-800">
                    {t(`items.${i}.body`)}
                  </p>
                  <div className="mt-5">
                    <ArrowLink href={story.href}>{t("readStory")}</ArrowLink>
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
