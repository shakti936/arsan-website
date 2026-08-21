import { useTranslations } from "next-intl";
import { Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";

/** Featured case study card with stat row — content is MOCK (Q-06). */
export function FeaturedCase({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <section className="bg-white-warm section-y">
      <Reveal className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="grid overflow-hidden border border-cream-100 shadow-sm shadow-navy-950/5 lg:grid-cols-[2fr_3fr]">
          <Plate variant="c" className="min-h-56" />
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <p className="eyebrow text-brass-600">{t("eyebrow")}</p>
            <h2 className="mt-3 font-display text-display-md font-semibold text-navy-900 text-balance">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-[58ch] text-base text-navy-800">
              {t("body")}
            </p>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream-100 pt-6">
              {[0, 1, 2].map((i) => (
                <div key={t(`stats.${i}.label`)}>
                  <dt className="eyebrow text-navy-700/70">
                    {t(`stats.${i}.label`)}
                  </dt>
                  <dd className="mt-1 font-display text-display-sm font-semibold text-teal-900">
                    {t(`stats.${i}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
