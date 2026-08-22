import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { HeroTitle } from "@/components/ui/hero-title";

/**
 * Direction A hero (refs/dirA-home-v2.png): one full-bleed photograph across
 * the whole band, with navy laid over the left where the type sits and cleared
 * off the right so the plant reads. The reference carries no panel beside the
 * headline — the photograph is the right-hand column.
 *
 * The photographic ground lives in HeroBackdrop, shared with the twelve page
 * heroes so the two treatments can't drift apart.
 */
export function Hero({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <HeroBackdrop src="/images/hero-executives.jpg" priority />

      <div className="relative mx-auto w-full max-w-6xl section-y px-6 sm:px-10">
        <div className="flex max-w-[32rem] flex-col items-start justify-center">
          <HeroTitle
            text={`${t("headlineLead")} ${t("headlineEmphasis")} ${t("headlineTail")}`}
            emphasis={t("headlineEmphasis")}
            className="text-display-xl"
          />
          <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
          <p className="mt-6 max-w-[40ch] text-lg text-cream-100">
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
      </div>
    </section>
  );
}
