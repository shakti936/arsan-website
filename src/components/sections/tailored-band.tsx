import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

/**
 * "Want insights tailored to your business and hiring goals?" — the navy band
 * between the grid and the newsletter in refs/dirA-insights-index.png.
 *
 * Navy rather than the site's usual teal close, because the newsletter band
 * follows it: two saturated bands in a row would fight, and this one is the
 * quieter of the two offers.
 */
export function TailoredBand() {
  const t = useTranslations("insightsIndex.tailored");

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 hidden h-56 w-56 -translate-y-1/2 items-center justify-center rounded-full border border-white-warm/10 lg:flex xl:left-10"
      >
        <span className="select-none font-display text-[9rem] font-medium leading-none text-white-warm/[0.07]">
          A
        </span>
      </span>
      <Container>
        <div className="relative grid items-center gap-x-10 gap-y-6 section-y lg:grid-cols-[1.3fr_1fr_auto] lg:pl-56">
          <h2 className="font-display text-display-lg font-semibold text-white-warm text-balance">
            {t("heading")}
          </h2>
          <p className="max-w-[42ch] text-base text-cream-100">{t("body")}</p>
          <ButtonLink href="/contact">{t("cta")}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
