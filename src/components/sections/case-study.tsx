import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CaseStudyCopy } from "@/content/case-studies";

/**
 * The case-study page, from refs/dirA-casestudy-*.png. One file: these six
 * bands only ever appear together, in this order, and splitting them into six
 * modules would mean six imports and six places to look for one layout.
 *
 * The hero is the only one on the site where the photograph runs the full band
 * *behind* the type rather than beside it — a case study leads with the site,
 * not with a headline — so it reuses `HeroBackdrop` and lets the scrim do the
 * work, unlike `ArticleHero`, which splits the band in two.
 *
 * `glance` figures and `quote` render only when present. They are unset on all
 * three studies on purpose; see content/case-studies/types.ts.
 */
export function CaseStudy({
  copy,
  photo,
}: {
  copy: CaseStudyCopy;
  /** basename in public/images */
  photo: string;
}) {
  const t = useTranslations("caseStudy");

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-900">
        {/* the photograph is the whole band here, not a right-hand column:
              a case study leads with the site, so the scrim carries the type */}
        <HeroBackdrop src={`/images/${photo}.jpg`} priority />
        <div className="relative mx-auto w-full max-w-page px-6 py-14 sm:px-10 lg:py-20">
          <Breadcrumb
            label={t("breadcrumbLabel")}
            items={[
              { label: t("home"), href: "/" },
              { label: t("results"), href: "/results" },
              { label: copy.title },
            ]}
          />
          <p className="eyebrow mt-9 text-brass-400">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-[22ch] font-display text-display-xl font-semibold text-white-warm text-balance">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-[54ch] text-lg text-cream-100">
            {copy.deck}
          </p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {copy.meta.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-cream-100/85"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brass-400" />
                  {item.label}
                </li>
              );
            })}
          </ul>

          {copy.heroCta && (
            <div className="mt-8">
              <ButtonLink href="/contact">{copy.heroCta}</ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* ---------- at a glance ---------- */}
      <section className="bg-white-warm section-y">
        <div className="mx-auto grid w-full max-w-page gap-10 px-6 sm:px-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div>
            <SectionHeading>{copy.glanceHeading}</SectionHeading>
            <p className="mt-5 max-w-[46ch] text-sm text-navy-800">
              {copy.glanceBody}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {copy.glance.map((item, i) => {
              const Icon = Icons[item.icon];
              return (
                <Reveal key={item.label} delay={i * 0.06}>
                  <div className="flex h-full flex-col gap-3 border-t border-brass-500/40 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <Icon className="h-8 w-8 text-teal-900" />
                    {item.figure && (
                      <p className="font-display text-display-lg font-semibold leading-none text-teal-900">
                        {item.figure}
                      </p>
                    )}
                    <p className="text-sm text-navy-800">{item.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- challenge | approach ---------- */}
      <section className="border-t border-cream-100 bg-cream-50 section-y">
        <div className="mx-auto grid w-full max-w-page gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading>{copy.challengeHeading}</SectionHeading>
            <p className="mt-5 max-w-[52ch] text-base text-navy-800">
              {copy.challengeIntro}
            </p>
            <p className="mt-6 text-sm font-semibold text-navy-900">
              {copy.challengeListHeading}
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {copy.challenges.map((item) => (
                <li key={item} className="flex gap-3 text-base text-navy-800">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-900"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-cream-100 lg:pl-16">
            <SectionHeading>{copy.approachHeading}</SectionHeading>
            <p className="mt-5 max-w-[52ch] text-base text-navy-800">
              {copy.approachIntro}
            </p>
            <ol className="mt-8 flex flex-col gap-7">
              {copy.approach.map((item, i) => {
                const Icon = Icons[item.icon];
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <li className="flex gap-5">
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-teal-900 text-cream-50"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-navy-800">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- results ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 section-y">
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-page gap-10 px-6 sm:px-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div>
            <SectionHeading tone="light">{copy.resultsHeading}</SectionHeading>
            <p className="mt-5 max-w-[42ch] text-sm text-cream-100/85">
              {copy.resultsBody}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {copy.results.map((item, i) => {
              const Icon = Icons[item.icon];
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="flex h-full flex-col gap-3 border-t border-brass-400/40 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <Icon className="h-8 w-8 text-brass-400" />
                    <h3 className="font-display text-display-sm font-semibold leading-snug text-white-warm">
                      {item.title}
                    </h3>
                    <p className="text-sm text-cream-100/80">{item.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- client quote ---------- */}
      {copy.quote && (
        <section className="border-b border-cream-100 bg-white-warm py-14">
          <div className="mx-auto grid w-full max-w-page items-center gap-8 px-6 sm:px-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
            <figure className="flex gap-5">
              <span
                aria-hidden="true"
                className="font-display text-[3.5rem] leading-[0.7] text-brass-500"
              >
                &ldquo;
              </span>
              <blockquote className="font-display text-display-sm leading-relaxed text-navy-900">
                {copy.quote.text}
              </blockquote>
            </figure>
            <div className="flex items-center gap-4 lg:border-l lg:border-cream-100 lg:pl-14">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-navy-900/25 text-navy-900"
              >
                <Icons.person className="h-7 w-7" />
              </span>
              <p className="text-sm text-navy-800">
                {copy.quote.role}
                <br />
                {copy.quote.org}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---------- key roles ---------- */}
      <section className="bg-cream-50 section-y">
        <div className="mx-auto w-full max-w-page px-6 sm:px-10">
          <SectionHeading>{copy.rolesHeading}</SectionHeading>
          <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.roles.map((role) => (
              <li
                key={role}
                className="flex items-start gap-3 text-base text-navy-800"
              >
                <Icons.check className="mt-0.5 h-5 w-5 shrink-0 text-teal-900" />
                {role}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- close ---------- */}
      <section className="relative overflow-hidden bg-teal-900">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 select-none font-display text-[12rem] font-medium leading-none text-white-warm/5 sm:block lg:text-[16rem]"
        >
          A
        </span>
        <div className="relative mx-auto grid w-full max-w-page items-center gap-x-10 gap-y-6 px-6 section-y sm:px-10 lg:grid-cols-[1.3fr_1fr_auto]">
          <h2 className="font-display text-display-lg font-semibold text-white-warm text-balance">
            {copy.ctaHeading}
          </h2>
          <p className="max-w-[46ch] text-base text-cream-100">
            {copy.ctaBody}
          </p>
          <div className="flex flex-col items-start gap-1">
            <ButtonLink href="/contact">{copy.ctaLabel}</ButtonLink>
            <ArrowLink href="/results" tone="light">
              {t("allStudies")}
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
