import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CASE_STUDIES, caseStudyCopy } from "@/content/case-studies";
import { Link } from "@/i18n/navigation";

/**
 * "Case studies that speak for themselves." — the 2-up grid from
 * refs/dirA-results-page.png: a photograph with a navy CASE STUDY badge
 * straddling its lower edge, the study's own title, its meta line, the deck
 * and a link in.
 *
 * Cards read from `content/case-studies`, so this grid and the pages it opens
 * are the same source. The comp shows two and there are two on this template —
 * the third study is drawn on the article template and lives under /insights
 * (D-072), which is why it is not in this row.
 */
export function CaseStudyGrid({ locale }: { locale: string }) {
  const t = useTranslations("resultsPage.caseStudies");

  return (
    <section className="bg-cream-50 section-y">
      <Container>
        <div className="text-center">
          <h2 className="font-display text-display-md font-semibold text-navy-900 text-balance">
            {t("heading")}
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-0.5 w-10 bg-teal-700"
          />
          <p className="mx-auto mt-6 max-w-[62ch] text-base text-navy-800">
            {t("intro")}
          </p>
        </div>

        <ul className="mt-10 grid gap-8 lg:grid-cols-2">
          {CASE_STUDIES.map((study, i) => {
            const copy = caseStudyCopy(study, locale);
            return (
              <Reveal key={study.slug} delay={i * 0.08} className="h-full">
                <li className="group relative flex h-full flex-col border border-cream-100 bg-white-warm shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgba(6,30,57,.3)] motion-reduce:transition-none">
                  <div className="relative h-56 overflow-hidden bg-cream-100">
                    <Image
                      src={`/images/${study.photo}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  {/* `relative` so the badge paints above the photograph: the
                      image container is positioned and this one was not, which
                      put every unpositioned sibling underneath it */}
                  <div className="relative flex flex-1 flex-col p-7">
                    {/* the badge straddles the photograph's lower edge */}
                    <p className="-mt-11 mb-5 self-start bg-navy-900 px-3 py-1.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-cream-50">
                      {t("badge")}
                    </p>
                    <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900 text-balance">
                      <Link
                        href={`/results/${study.slug}`}
                        className="transition-colors after:absolute after:inset-0 group-hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
                      >
                        {copy.title}
                      </Link>
                    </h3>
                    {/* industry and focus — the comp sets two, and the study's
                        own hero already carries all three in full */}
                    <p className="mt-3 font-display text-base text-teal-900">
                      {[copy.meta.at(0), copy.meta.at(-1)]
                        .map((item) => item?.label.split(": ").pop())
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-4 flex-1 text-base text-navy-800">
                      {copy.deck}
                    </p>
                    <p className="mt-6 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900">
                      {t("cta")}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      >
                        &rarr;
                      </span>
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
