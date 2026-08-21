import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * Direction A split hero: navy field, serif headline with brass italic
 * emphasis word, region line, two CTAs. Right side holds the photo once
 * real imagery exists (/gen-images); until then the navy field carries it.
 */
export function Hero({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <section className="bg-navy-900">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[7fr_5fr] lg:py-28">
        <div className="flex flex-col items-start justify-center">
          <h1 className="font-display text-display-xl font-semibold leading-[1.05] text-white-warm text-balance">
            {t("headlineLead")}{" "}
            <em className="font-medium text-brass-400">
              {t("headlineEmphasis")}
            </em>{" "}
            {t("headlineTail")}
          </h1>
          <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-cream-100">
            {t("subhead")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contact">{t("ctaPrimary")}</ButtonLink>
            <ButtonLink href="/why-arsan" variant="outline">
              {t("ctaSecondary")}
            </ButtonLink>
          </div>
          <p className="eyebrow mt-10 text-cream-100/70">{t("regions")}</p>
        </div>
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </section>
  );
}
