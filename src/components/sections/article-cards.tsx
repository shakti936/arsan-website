import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type ArticleCardsProps = {
  /** Namespace with heading, viewAll?, items.N.{category,title,excerpt} */
  namespace: string;
  count?: number;
  withViewAll?: boolean;
  /** Article detail pages don't exist yet — cards render unlinked. */
  className?: string;
};

export function ArticleCards({
  namespace,
  count = 3,
  withViewAll,
  className,
}: ArticleCardsProps) {
  const t = useTranslations(namespace);

  return (
    <section className={cn("bg-white-warm py-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>{t("heading")}</SectionHeading>
          {withViewAll && (
            <ArrowLink href="/insights">{t("viewAll")}</ArrowLink>
          )}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <Reveal
              key={t(`items.${i}.title`)}
              delay={(i % 3) * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col border border-cream-100 bg-white-warm shadow-sm shadow-navy-950/5">
                {/* Image slot — real article imagery later */}
                <div
                  aria-hidden="true"
                  className="h-36 bg-gradient-to-br from-teal-900 to-navy-950"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-brass-600">
                    {t(`items.${i}.category`)}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-navy-900 text-balance">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-800">
                    {t(`items.${i}.excerpt`)}
                  </p>
                  <p className="eyebrow mt-5 text-navy-700/60">
                    {t("comingSoon")}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
