import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Plate } from "@/components/ui/plate";

/**
 * Direction A split hero. The right column was an empty div holding space for
 * photography that doesn't exist yet; it now carries a Plate with the practice
 * index — real content from ARSAN's business rather than a placeholder, and the
 * frame a photograph drops into later.
 */
export function Hero({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const practices = [0, 1, 2, 3] as const;

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 section-y px-6 sm:px-10 lg:grid-cols-[7fr_5fr]">
        <div className="flex flex-col items-start justify-center">
          <h1 className="font-display text-display-xl font-semibold text-white-warm text-balance">
            {t("headlineLead")}{" "}
            <em className="font-medium text-brass-400">
              {t("headlineEmphasis")}
            </em>{" "}
            {t("headlineTail")}
          </h1>
          <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
          <p className="mt-6 max-w-[52ch] text-lg text-cream-100">
            {t("subhead")}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <ButtonLink href="/contact">{t("ctaPrimary")}</ButtonLink>
            <ButtonLink href="/why-arsan" variant="outline">
              {t("ctaSecondary")}
            </ButtonLink>
          </div>
          <p className="eyebrow mt-10 text-cream-100/70">{t("regions")}</p>
        </div>

        <Plate
          variant="a"
          src="/images/hero-plate.jpg"
          alt={t("plateAlt")}
          overlay="heavy"
          priority
          sizes="(min-width: 1024px) 34vw, 0px"
          className="hidden aspect-4/5 max-h-[30rem] lg:block"
        >
          <div className="relative flex h-full flex-col justify-between p-8">
            <p className="eyebrow text-brass-300">{t("plateEyebrow")}</p>
            <ul className="mt-6 flex flex-col">
              {practices.map((i) => (
                <li
                  key={i}
                  className="border-t border-cream-50/15 py-3 first:border-t-0 first:pt-0"
                >
                  <span className="block font-display text-display-sm font-medium text-white-warm">
                    {t(`practices.${i}.name`)}
                  </span>
                  <span className="mt-0.5 block text-sm text-cream-100/70">
                    {t(`practices.${i}.detail`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Plate>
      </div>
    </section>
  );
}
