import { Icons } from "@/components/ui/icons";
import { ProseText } from "@/components/ui/prose-text";
import { Reveal } from "@/components/ui/reveal";
import type { ArticleCopy } from "@/content/insights";

/**
 * Article body from refs/dirA-article-*.png: prose in a left column, a rail on
 * the right carrying the pull quote and one card, then Key Takeaways across
 * the full width.
 *
 * The rail is `sticky` from `lg` up. The quote is the article's argument in one
 * line, and on a seven-minute read it is worth keeping in view rather than
 * leaving at the top of a column the reader scrolled past in fifteen seconds.
 *
 * The prose column renders `copy.sections` in order. A section is an optional
 * H2 over prose, a numbered spine, or a check list — the two body shapes the
 * comps show, in one loop rather than two page types.
 *
 * The rail carries a sourced statistic when the article has one and the
 * article's own questions when it does not.
 */
export function ArticleBody({ copy }: { copy: ArticleCopy }) {
  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---- prose ----
              capped at 72ch: the container is 1200px wide now, and the 1.7fr
              column would otherwise set body copy at ~85 characters a line */}
          <div className="max-w-[72ch]">
            {copy.lede.map((paragraph) => (
              <ProseText
                key={paragraph.slice(0, 40)}
                text={paragraph}
                className="mt-5 text-base text-navy-800 first:mt-0"
              />
            ))}

            {copy.sections.map((section) => (
              <section key={section.heading ?? section.body?.[0] ?? ""}>
                {section.heading && (
                  <h2 className="mt-11 font-display text-display-md font-semibold text-navy-900 text-balance">
                    {section.heading}
                  </h2>
                )}

                {section.body?.map((paragraph) => (
                  <ProseText
                    key={paragraph.slice(0, 40)}
                    text={paragraph}
                    className="mt-6 text-base text-navy-800"
                  />
                ))}

                {section.steps && (
                  <ol className="mt-7 flex flex-col gap-7">
                    {section.steps.map((step, i) => (
                      <li key={step.title} className="flex gap-5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-base font-semibold text-cream-50"
                        >
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900">
                            {step.title}
                          </h3>
                          <ProseText
                            text={step.body}
                            className="mt-2 text-base text-navy-800"
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {section.checks && (
                  <ul className="mt-6 flex flex-col gap-4">
                    {section.checks.map((check) => (
                      <li key={check.lead} className="flex gap-3">
                        <Icons.check
                          aria-hidden="true"
                          className="mt-0.5 h-5 w-5 shrink-0 text-navy-900"
                        />
                        <p className="text-base text-navy-800">
                          <strong className="font-semibold text-navy-900">
                            {check.lead}
                          </strong>{" "}
                          {check.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* ---- rail ---- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <figure>
              <span
                aria-hidden="true"
                className="block font-display text-[3rem] leading-[0.6] text-brass-500"
              >
                &ldquo;
              </span>
              <blockquote className="mt-5 font-display text-display-sm italic leading-relaxed text-navy-900">
                {copy.pullQuote}
              </blockquote>
              <div
                aria-hidden="true"
                className="mt-6 h-0.5 w-10 bg-brass-500"
              />
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-navy-900">
                  {copy.pullQuoteBy}
                </span>
                {copy.pullQuoteOrg && (
                  <span className="mt-1 block text-navy-700">
                    {copy.pullQuoteOrg}
                  </span>
                )}
              </figcaption>
            </figure>

            {copy.stat ? (
              <div className="mt-10 border border-cream-100 bg-cream-50 p-7">
                <div className="flex items-center gap-4">
                  <Icons.chart className="h-9 w-9 shrink-0 text-brass-500" />
                  <p className="font-display text-display-lg font-semibold text-navy-900">
                    {copy.stat.figure}
                  </p>
                </div>
                <p className="mt-4 text-base text-navy-800">{copy.stat.body}</p>
                <p className="mt-4 text-sm text-navy-700/80">
                  {copy.stat.source}
                </p>
              </div>
            ) : (
              <div className="mt-10 border border-cream-100 bg-cream-50 p-7">
                <div className="flex items-center gap-3">
                  <Icons.compass className="h-7 w-7 shrink-0 text-brass-500" />
                  <p className="font-display text-display-sm font-semibold leading-snug text-navy-900">
                    {copy.asideHeading}
                  </p>
                </div>
                <ul className="mt-5 flex flex-col gap-4">
                  {copy.asideItems.map((item) => (
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
            )}
          </aside>
        </div>

        {/* ---- key takeaways ---- */}
        <div className="mt-16">
          <h2 className="font-display text-display-md font-semibold text-navy-900">
            {copy.takeawaysHeading}
          </h2>
          <div aria-hidden="true" className="mt-3 h-0.5 w-10 bg-brass-500" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {copy.takeaways.map((takeaway, i) => {
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
                      <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900 text-balance">
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
      </div>
    </section>
  );
}
