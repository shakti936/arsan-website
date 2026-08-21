import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";

const CARD_HREFS = [
  "/for-clients/executive-search",
  "/for-clients/mexico-advisory",
  "/for-clients/leadership-solutions",
] as const;

export function Chooser() {
  const t = useTranslations("home.chooser");

  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <h2 className="text-center font-display text-display-md font-semibold text-navy-900 text-balance">
          {t("heading")}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARD_HREFS.map((href, i) => (
            <Reveal key={href} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col border border-cream-100 bg-white-warm p-8 text-center shadow-sm shadow-navy-950/5">
                <h3 className="font-display text-display-sm font-semibold text-navy-900 text-balance">
                  {t(`cards.${i}.need`)}
                </h3>
                <p className="eyebrow mt-3 text-brass-600">
                  {t(`cards.${i}.service`)}
                </p>
                <p className="mt-4 flex-1 text-base text-navy-800">
                  {t(`cards.${i}.body`)}
                </p>
                <div className="mt-6 flex justify-center">
                  <ArrowLink href={href}>{t(`cards.${i}.cta`)}</ArrowLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
