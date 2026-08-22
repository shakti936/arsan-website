import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Link } from "@/i18n/navigation";
import { relatedArticles } from "@/lib/articles";
import { cn } from "@/lib/cn";

/**
 * "Related Insights" from refs/dirA-article-*.png: a photograph on the left of
 * each card, category, headline and the date/read-time line on the right.
 *
 * Related is currently "the other articles, newest first", up to four. With
 * five pieces, relevance scoring would be a ranking function over a set small
 * enough to read in full — it becomes worth building at somewhere around
 * twenty. The row is three-up or four-up depending on how many there are,
 * which is the only reason the case-study comp shows four cards and the
 * article comps show three.
 *
 * The whole card is the target, with the headline carrying the link so the
 * accessible name is the headline rather than "read more". The stretched
 * pseudo-element does the rest.
 */
export async function RelatedInsights({
  currentSlug,
  locale,
}: {
  currentSlug: string;
  locale: string;
}) {
  const t = await getTranslations("article");
  const tc = await getTranslations("articleCategories");
  const format = await getFormatter();
  const related = await relatedArticles(currentSlug, locale);

  if (!related.length) return null;

  return (
    <section className="bg-cream-50 section-y">
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-heading font-semibold text-navy-900">
            {t("related")}
          </h2>
          <ArrowLink href="/insights">{t("viewAll")}</ArrowLink>
        </div>

        <div
          className={cn(
            "mt-8 grid gap-6",
            related.length > 3
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "md:grid-cols-3",
          )}
        >
          {related.map((article) => {
            return (
              <article
                key={article.slug}
                className="group relative flex border border-cream-100 bg-white-warm transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none"
              >
                {/* narrow on purpose: three cards share a 72rem container, so
                    every pixel the photograph takes comes out of a headline
                    that has to hold four lines */}
                <div className="relative w-24 shrink-0 self-stretch overflow-hidden bg-cream-100 sm:w-28">
                  <Image
                    src={article.image.url}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col p-5">
                  <p className="eyebrow text-brass-600">
                    {tc(article.categoryKey)}
                  </p>
                  <h3 className="mt-2 font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                    <Link
                      href={`/insights/${article.slug}`}
                      className="transition-colors after:absolute after:inset-0 group-hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-navy-700">
                    {format.dateTime(new Date(article.published), {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <span aria-hidden="true" className="mx-2">
                      ·
                    </span>
                    {t("readingTime", { minutes: article.readingMinutes })}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
