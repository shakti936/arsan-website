import { useLocale, useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { type Opening, openingCopy } from "@/lib/jobs";

/**
 * "Featured opportunities" from refs/dirA-for-candidates-landing.png — three
 * cards above the fold on /for-candidates, with the way through to the board.
 *
 * Reads the same `Opening` records the board does rather than carrying its own
 * teaser copy in `messages`. A featured card that outlives the listing it
 * describes is the failure mode this avoids: when the ATS closes a role, the
 * card goes with it.
 *
 * The eyebrow is the opening's function, not a separate marketing category.
 * The comp writes "PLANT LEADERSHIP" and "COMMERCIAL" where the board's facets
 * say Operations and Sales; one vocabulary that the filters also speak is
 * worth more than two that drift.
 */
export function FeaturedOpenings({ openings }: { openings: Opening[] }) {
  const t = useTranslations("subpage.forCandidates");
  const tb = useTranslations("subpage.opportunities");
  const locale = useLocale();

  if (!openings.length) return null;

  return (
    <section className="bg-cream-50 section-y">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-heading font-semibold text-navy-900 text-balance">
            {t("featuredHeading")}
          </h2>
          <ArrowLink href="/for-candidates/opportunities">
            {t("featuredViewAll")}
          </ArrowLink>
        </div>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {openings.map((opening, i) => {
            const copy = openingCopy(opening, locale);
            return (
              <Reveal key={opening.id} delay={i * 0.08} className="h-full">
                <li className="group relative flex h-full flex-col border border-cream-100 bg-white-warm p-6 transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
                  <p className="eyebrow text-brass-600">
                    {tb(`fn.${opening.fn}`)}
                  </p>
                  <h3 className="mt-3 font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                    <Link
                      href={`/for-candidates/opportunities/${opening.slug}`}
                      className="transition-colors after:absolute after:inset-0 group-hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
                    >
                      {copy.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-navy-700">{copy.location}</p>
                  <p className="mt-4 flex-1 text-sm text-navy-800">
                    {copy.summary}
                  </p>
                  <p className="mt-6 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900">
                    {tb("viewDetails")}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      &rarr;
                    </span>
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
