import { useTranslations } from "next-intl";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/** One per item, in the order refs/dirA-home-v2.png sets them. */
const ITEM_ICONS = ["users", "cog", "globe"] as const;

export function ValueProps() {
  const t = useTranslations("home.values");

  return (
    <section className="bg-cream-50 section-y">
      <div className="mx-auto grid w-full max-w-page gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_2fr]">
        <Reveal>
          <SectionHeading>{t("heading")}</SectionHeading>
          <p className="mt-5 max-w-[48ch] text-base text-navy-800">
            {t("body")}
          </p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3">
          {ITEM_ICONS.map((name, i) => {
            const Icon = Icons[name];
            return (
              <Reveal key={name} delay={i * 0.08}>
                <div className="border-t border-brass-500/40 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <Icon className="mb-4 h-8 w-8 text-teal-900" />
                  <h3 className="text-sm font-semibold text-navy-900">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-2 text-base text-navy-800">
                    {t(`items.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
