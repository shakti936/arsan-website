import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { type Opening, openingCopy } from "@/lib/jobs";

const NEXT_STEPS = 3;

/**
 * A single opening.
 *
 * **There is no comp for this page.** The board comp links to it and nothing
 * drew it, so it is assembled from patterns that were drawn: the case study's
 * photograph-behind-the-type hero, the article's prose-plus-rail body, the
 * candidate close. When a comp arrives, that is the layer to change.
 *
 * The body is deliberately short. ARSAN's searches do not publish a full brief
 * — compensation, reporting line and the reason the seat is open come from a
 * consultant — so the page says that rather than padding twenty-nine listings
 * with the same invented responsibilities.
 */
export function OpportunityDetail({
  opening,
  similar,
}: {
  opening: Opening;
  similar: Opening[];
}) {
  const t = useTranslations("subpage.opportunity");
  const tb = useTranslations("subpage.opportunities");
  const format = useFormatter();
  const locale = useLocale();
  const copy = openingCopy(opening, locale);

  const facts = [
    {
      label: t("labelLocation"),
      value:
        opening.workMode === "onsite"
          ? copy.location
          : `${copy.location} (${tb(`workMode.${opening.workMode}`)})`,
    },
    {
      label: t("labelEmployment"),
      value: tb(`employment.${opening.employment}`),
    },
    { label: t("labelLevel"), value: tb(`level.${opening.level}`) },
    { label: t("labelFunction"), value: tb(`fn.${opening.fn}`) },
    {
      label: t("labelPosted"),
      value: format.dateTime(new Date(opening.postedAt), {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-900">
        <HeroBackdrop src="/images/story-mexico-expansion.jpg" priority />
        <Container className="relative py-14 lg:py-20">
          <Breadcrumb
            label={t("breadcrumb")}
            items={[
              { label: t("crumbHome"), href: "/" },
              {
                label: t("crumbBoard"),
                href: "/for-candidates/opportunities",
              },
              { label: copy.title },
            ]}
          />
          <p className="eyebrow mt-9 text-brass-400">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-[24ch] font-display text-title font-semibold text-white-warm text-balance">
            {copy.title}
          </h1>
          <p className="mt-5 text-lead text-cream-100">
            <span className="font-semibold">{copy.company}</span>
            <span aria-hidden="true" className="mx-2 text-cream-100/50">
              &middot;
            </span>
            {copy.location}
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              tb(`employment.${opening.employment}`),
              tb(`level.${opening.level}`),
              tb(`fn.${opening.fn}`),
            ].map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-cream-100/85"
              >
                <Icons.briefcase className="h-4 w-4 shrink-0 text-brass-400" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/for-candidates/submit-profile">
              {t("apply")}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-white-warm section-y">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
            <div className="max-w-[72ch]">
              <h2 className="font-display text-heading font-semibold text-navy-900">
                {t("aboutHeading")}
              </h2>
              <div
                aria-hidden="true"
                className="mt-3 h-0.5 w-10 bg-brass-500"
              />
              <p className="mt-6 text-base text-navy-800">{copy.summary}</p>

              <h2 className="mt-11 font-display text-heading font-semibold text-navy-900">
                {t("nextHeading")}
              </h2>
              <ol className="mt-7 flex flex-col gap-7">
                {Array.from({ length: NEXT_STEPS }, (_, i) => (
                  <li key={t(`next.${i}.title`)} className="flex gap-5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-base font-semibold text-cream-50"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900">
                        {t(`next.${i}.title`)}
                      </h3>
                      <p className="mt-2 text-base text-navy-800">
                        {t(`next.${i}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-cream-100 bg-cream-50 p-7">
                <h2 className="font-display text-subheading font-semibold text-navy-900">
                  {t("detailsHeading")}
                </h2>
                <dl className="mt-5 flex flex-col gap-4">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-xs uppercase tracking-[0.1em] text-navy-700">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-base text-navy-900">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7">
                  <ButtonLink href="/for-candidates/submit-profile">
                    {t("apply")}
                  </ButtonLink>
                </div>
                <p className="mt-5 flex gap-3 text-sm text-navy-800">
                  <Icons.shieldPlain className="h-5 w-5 shrink-0 text-teal-900" />
                  {t("confidentialNote")}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-cream-100 bg-cream-50 section-y">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-heading font-semibold text-navy-900">
                {t("similarHeading")}
              </h2>
              <ArrowLink href="/for-candidates/opportunities">
                {t("backToBoard")}
              </ArrowLink>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {similar.map((other, i) => {
                const otherCopy = openingCopy(other, locale);
                return (
                  <Reveal key={other.id} delay={i * 0.08} className="h-full">
                    <li className="group relative flex h-full flex-col border border-cream-100 bg-white-warm p-6 transition-shadow duration-300 hover:shadow-[0_10px_28px_-14px_rgba(6,30,57,.3)] motion-reduce:transition-none">
                      <h3 className="font-display text-subheading font-semibold leading-snug text-teal-900 text-balance">
                        <Link
                          href={`/for-candidates/opportunities/${other.slug}`}
                          className="transition-colors after:absolute after:inset-0 group-hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
                        >
                          {otherCopy.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-navy-800">
                        {otherCopy.company}
                      </p>
                      <p className="mt-1 flex-1 text-sm text-navy-700">
                        {otherCopy.location}
                      </p>
                      <p className="mt-4 text-sm text-navy-700">
                        {tb(`level.${other.level}`)}
                        <span aria-hidden="true" className="mx-2">
                          &middot;
                        </span>
                        {tb(`fn.${other.fn}`)}
                      </p>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
