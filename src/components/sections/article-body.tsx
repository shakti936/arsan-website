import { ArticleProse } from "@/components/ui/article-prose";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import type { ArticleView } from "@/lib/articles";

/**
 * Article body from refs/dirA-article-*.png: prose in a left column, a rail on
 * the right carrying the pull quote and one card, then Key Takeaways across
 * the full width.
 *
 * The rail is `sticky` from `lg` up. The quote is the article's argument in one
 * line, and on a seven-minute read it is worth keeping in view rather than
 * leaving at the top of a column the reader scrolled past in fifteen seconds.
 *
 * The prose column renders Portable Text written in the Studio — see
 * `ArticleProse` for the block-to-role mapping. It used to walk a bespoke
 * `sections` model of headings, numbered spines and check lists; those are
 * ordinary Portable Text lists now, so an editor can write one without anyone
 * adding a field for it.
 *
 * The rail carries a sourced statistic when the article has one and the
 * article's own questions when it does not. Every field below the body is
 * optional in the schema, so each is guarded: a half-filled article renders
 * without its rail rather than rendering a hole.
 */
export function ArticleBody({ article }: { article: ArticleView }) {
  const { stat, takeaways, asideItems } = article;
  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---- prose ----
              capped at 72ch: the container is 1200px wide now, and the 1.7fr
              column would otherwise set body copy at ~85 characters a line */}
          <div className="max-w-[72ch]">
            <ArticleProse blocks={article.body} />
          </div>

          {/* ---- rail ---- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {article.pullQuote && (
              <figure>
                <span
                  aria-hidden="true"
                  className="block font-display text-quote-sm text-brass-500"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-5 font-display text-subheading italic leading-relaxed text-navy-900">
                  {article.pullQuote}
                </blockquote>
                <div
                  aria-hidden="true"
                  className="mt-6 h-0.5 w-10 bg-brass-500"
                />
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-navy-900">
                    {article.pullQuoteBy}
                  </span>
                  {article.pullQuoteOrg && (
                    <span className="mt-1 block text-navy-700">
                      {article.pullQuoteOrg}
                    </span>
                  )}
                </figcaption>
              </figure>
            )}

            {stat ? (
              <div className="mt-10 border border-cream-100 bg-cream-50 p-7">
                <div className="flex items-center gap-4">
                  <Icons.chart className="h-9 w-9 shrink-0 text-brass-500" />
                  <p className="font-display text-figure font-semibold text-navy-900">
                    {stat.figure}
                  </p>
                </div>
                <p className="mt-4 text-base text-navy-800">{stat.body}</p>
                <p className="mt-4 text-sm text-navy-700/80">{stat.source}</p>
              </div>
            ) : asideItems?.length ? (
              <div className="mt-10 border border-cream-100 bg-cream-50 p-7">
                <div className="flex items-center gap-3">
                  <Icons.compass className="h-7 w-7 shrink-0 text-brass-500" />
                  <p className="font-display text-subheading font-semibold leading-snug text-navy-900">
                    {article.asideHeading}
                  </p>
                </div>
                <ul className="mt-5 flex flex-col gap-4">
                  {asideItems.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-navy-800">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        {/* ---- key takeaways ---- */}
        {takeaways?.length ? (
          <div className="mt-16">
            <h2 className="font-display text-heading font-semibold text-navy-900">
              {article.takeawaysHeading}
            </h2>
            <div aria-hidden="true" className="mt-3 h-0.5 w-10 bg-brass-500" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {takeaways.map((takeaway, i) => {
                const Icon = Icons[takeaway.icon];
                return (
                  <Reveal
                    key={takeaway.title}
                    delay={i * 0.08}
                    className="h-full"
                  >
                    <article className="flex h-full gap-5 border border-cream-100 bg-cream-50 p-6">
                      <Icon className="h-9 w-9 shrink-0 self-start text-brass-500" />
                      <div>
                        <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                          {takeaway.title}
                        </h3>
                        <p className="mt-2 text-sm text-navy-800">
                          {takeaway.body}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
