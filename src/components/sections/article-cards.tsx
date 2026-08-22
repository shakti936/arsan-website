import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ARTICLES, articleCopy } from "@/content/insights";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * The insight card grid, on the home page and at the top of /insights.
 *
 * Cards read from `content/insights` rather than from a message namespace.
 * They used to be six teasers in `messages/*.json` for articles that did not
 * exist, each ending in "Article coming soon" — a promise the site kept
 * repeating and never met. Now the list and the pages are the same source, so
 * publishing a piece adds it here, at /insights and in every other article's
 * related rail at once, and a card can never point at nothing.
 *
 * The whole card is clickable, with the headline carrying the link so its
 * accessible name is the headline rather than "read more"; the stretched
 * pseudo-element covers the rest of the card.
 */
export function ArticleCards({
  locale,
  count = 3,
  withViewAll,
  headingOverride,
  viewAllOverride,
  layout = "stacked",
  className,
}: {
  locale: string;
  count?: number;
  withViewAll?: boolean;
  /** /for-candidates frames the same three pieces as "Insights for your career". */
  headingOverride?: string;
  viewAllOverride?: string;
  /**
   * `stacked` puts the photograph above the copy — how the comps set the row
   * on /for-candidates and /insights. `beside` runs it down the left of each
   * card, which is what refs/dirA-home-v2.png does: the home row sits between
   * two dense bands and the shorter card keeps the page moving.
   */
  layout?: "stacked" | "beside";
  className?: string;
}) {
  const beside = layout === "beside";
  const t = useTranslations("insightsRow");
  const format = useFormatter();
  const articles = ARTICLES.slice(0, count);

  return (
    <section className={cn("bg-white-warm section-y", className)}>
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>{headingOverride ?? t("heading")}</SectionHeading>
          {withViewAll && (
            <ArrowLink href="/insights">
              {viewAllOverride ?? t("viewAll")}
            </ArrowLink>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => {
            const copy = articleCopy(article, locale);
            return (
              <Reveal
                key={article.slug}
                delay={(i % 3) * 0.08}
                className="h-full"
              >
                <article
                  className={cn(
                    "group relative flex h-full border border-cream-100 bg-white-warm shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none",
                    beside ? "flex-row" : "flex-col",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-cream-100",
                      beside ? "w-36 shrink-0 self-stretch" : "h-44",
                    )}
                  >
                    <Image
                      src={`/images/${article.photo}.jpg`}
                      alt=""
                      fill
                      sizes={
                        beside ? "128px" : "(min-width: 768px) 33vw, 100vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div
                    className={cn(
                      "flex flex-1 flex-col",
                      beside ? "p-5" : "p-6",
                    )}
                  >
                    <p className="eyebrow text-brass-600">{copy.category}</p>
                    <h3
                      className={cn(
                        "mt-3 font-display font-semibold leading-snug text-navy-900 text-balance",
                        beside
                          ? "text-lg [&>*]:line-clamp-2"
                          : "text-display-sm",
                      )}
                    >
                      <Link
                        href={`/insights/${article.slug}`}
                        className="transition-colors after:absolute after:inset-0 group-hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
                      >
                        {copy.title}
                      </Link>
                    </h3>
                    <p
                      className={cn(
                        "mt-3 flex-1 text-sm text-navy-800",
                        beside && "line-clamp-2",
                      )}
                    >
                      {copy.deck}
                    </p>
                    {beside ? (
                      <p className="mt-5 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900">
                        {t("readArticle")}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                        >
                          &rarr;
                        </span>
                      </p>
                    ) : (
                      <p className="mt-5 text-sm text-navy-700">
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
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
