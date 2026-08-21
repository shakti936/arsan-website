import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * Direction A hero (refs/dirA-home-v2.png): one full-bleed photograph across
 * the whole band, with navy laid over the left where the type sits and cleared
 * off the right so the plant reads. The reference carries no panel beside the
 * headline — the photograph is the right-hand column.
 *
 * Two scrims rather than one: below `lg` the copy sits over the middle of the
 * frame, so the navy has to cover everything; from `lg` up it can rake off to
 * the right. Both are tuned against the darkest text in the block.
 */
export function Hero({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <Image
        src="/images/hero-wide.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[70%_center]"
      />
      {/* narrow viewports: the copy crosses the frame, so navy covers it all */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--color-navy-950) 88%, transparent) 0%, color-mix(in oklab, var(--color-navy-900) 84%, transparent) 100%)",
        }}
      />
      {/* lg and up: navy holds the left column and clears the photograph */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--color-navy-950) 96%, transparent) 0%, color-mix(in oklab, var(--color-navy-900) 92%, transparent) 34%, color-mix(in oklab, var(--color-navy-900) 62%, transparent) 54%, transparent 86%)",
        }}
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className="relative mx-auto w-full max-w-6xl section-y px-6 sm:px-10">
        <div className="flex max-w-[36rem] flex-col items-start justify-center">
          <h1 className="font-display text-display-xl font-semibold text-white-warm text-balance">
            {t("headlineLead")}{" "}
            <em className="font-medium text-brass-400">
              {t("headlineEmphasis")}
            </em>{" "}
            {t("headlineTail")}
          </h1>
          <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
          <p className="mt-6 max-w-[46ch] text-lg text-cream-100">
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
