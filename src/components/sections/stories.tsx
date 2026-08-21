import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const STORY_COUNT = 3;

export function Stories() {
  const t = useTranslations("home.stories");

  return (
    <section className="bg-white-warm py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>{t("heading")}</SectionHeading>
          <ArrowLink href="/results">{t("viewAll")}</ArrowLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {Array.from({ length: STORY_COUNT }, (_, i) => (
            <Reveal
              key={t(`items.${i}.title`)}
              delay={i * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col border border-cream-100 bg-white-warm shadow-sm shadow-navy-950/5">
                {/* Image slot — replaced by real photography via /gen-images */}
                <div
                  aria-hidden="true"
                  className="h-40 bg-gradient-to-br from-navy-800 to-navy-950"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-brass-600">
                    {t(`items.${i}.category`)}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-900 text-balance">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-800">
                    {t(`items.${i}.body`)}
                  </p>
                  <div className="mt-5">
                    <ArrowLink href="/results">{t("readStory")}</ArrowLink>
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
