import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const ITEM_COUNT = 3;

export function ValueProps() {
  const t = useTranslations("home.values");

  return (
    <section className="bg-cream-50 py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_2fr]">
        <Reveal>
          <SectionHeading>{t("heading")}</SectionHeading>
          <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-navy-800">
            {t("body")}
          </p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3">
          {Array.from({ length: ITEM_COUNT }, (_, i) => (
            <Reveal key={t(`items.${i}.title`)} delay={i * 0.08}>
              <div className="border-t border-brass-500/40 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <h3 className="text-sm font-semibold text-navy-900">
                  {t(`items.${i}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-800">
                  {t(`items.${i}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
