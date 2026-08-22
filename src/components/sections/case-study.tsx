import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CaseStudyCopy, CaseStudyVariant } from "@/content/case-studies";
import { cn } from "@/lib/cn";

/**
 * A cell in one of the comps' 4-up divided strips ("At a glance", the
 * outcomes). The rules sit *between* columns, so whichever cell starts a row
 * has none — and which cell that is changes as the grid reflows from one
 * column to two to four. `leadingRule` keeps the rule on the very first cell,
 * which is right when the strip sits beside a heading column and wrong when it
 * runs the full width.
 */
function stripCell(leadingRule: boolean) {
  return cn(
    "flex h-full flex-col gap-3 border-t border-brass-500/40 pt-5",
    "sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0",
    "sm:[&:nth-child(odd)]:border-l-0 sm:[&:nth-child(odd)]:pl-0",
    "lg:[&:nth-child(odd)]:border-l lg:[&:nth-child(odd)]:pl-6",
    !leadingRule && "lg:first:border-l-0 lg:first:pl-0",
  );
}

/**
 * The case-study page, from refs/dirA-casestudy-mexico-plant.png and
 * refs/dirA-casestudy-merger-confidential.png. One file: these bands only ever
 * appear together, in this order, and splitting them into eight modules would
 * mean eight imports and eight places to look for one layout.
 *
 * The hero is the only one on the site where the photograph runs the full band
 * *behind* the type rather than beside it — a case study leads with the site,
 * not with a headline — so it reuses `HeroBackdrop` and lets the scrim do the
 * work, unlike `ArticleHero`, which splits the band in two.
 *
 * `variant` selects the treatment; see content/case-studies/types.ts for why
 * it is one name rather than six switches. `quote`, `note` and `roles` render
 * when present regardless of variant.
 */
export function CaseStudy({
  copy,
  photo,
  variant,
}: {
  copy: CaseStudyCopy;
  /** basename in public/images */
  photo: string;
  variant: CaseStudyVariant;
}) {
  const t = useTranslations("caseStudy");
  const confidential = variant === "confidential";

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
          <h1 className="mt-4 max-w-[22ch] font-display text-title font-semibold text-white-warm text-balance">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-[54ch] text-lead text-cream-100">
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

      {/* ---------- at a glance ----------
            figures on the outcomes treatment, icon-and-title cards on the
            confidential one; both sit in a divided strip beside the heading */}
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
              const Icon = item.icon ? Icons[item.icon] : null;
              return (
                <Reveal key={item.label} delay={i * 0.06}>
                  <div
                    className={cn(
                      stripCell(true),
                      confidential && "items-center text-center",
                    )}
                  >
                    {Icon && <Icon className="h-8 w-8 text-teal-900" />}
                    {item.figure && (
                      <p className="font-display text-figure font-semibold text-teal-900">
                        {item.figure}
                        {item.unit && (
                          <span className="ml-2 text-[0.55em] font-normal">
                            {item.unit}
                          </span>
                        )}
                      </p>
                    )}
                    {item.title && (
                      <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                        {item.title}
                      </h3>
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
            {copy.challengeListHeading && (
              <p className="mt-6 text-sm font-semibold text-navy-900">
                {copy.challengeListHeading}
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-4">
              {copy.challenges.map((item) => (
                <li key={item.text} className="flex gap-3">
                  {item.lead ? (
                    <Icons.check
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-teal-900"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-900"
                    />
                  )}
                  <p className="text-base text-navy-800">
                    {item.lead && (
                      <>
                        <strong className="font-semibold text-navy-900">
                          {item.lead}
                        </strong>{" "}
                      </>
                    )}
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-cream-100 lg:pl-16">
            <SectionHeading>{copy.approachHeading}</SectionHeading>
            <p className="mt-5 max-w-[52ch] text-base text-navy-800">
              {copy.approachIntro}
            </p>
            {/* the numbered treatment draws a rule down the discs, so its list
                is tighter and the marker column is narrower than the chips' */}
            <ol
              className={cn(
                "mt-8 flex flex-col",
                confidential ? "gap-6" : "gap-7",
              )}
            >
              {copy.approach.map((item, i) => {
                const Icon = item.icon ? Icons[item.icon] : null;
                const last = i === copy.approach.length - 1;
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <li className={cn("flex", Icon ? "gap-5" : "gap-4")}>
                      {Icon ? (
                        <span
                          aria-hidden="true"
                          className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-teal-900 text-cream-50"
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex shrink-0 flex-col items-center self-stretch"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-900 font-display text-base font-semibold text-cream-50">
                            {i + 1}
                          </span>
                          {!last && (
                            <span className="mt-1 w-px flex-1 bg-teal-900/25" />
                          )}
                        </span>
                      )}
                      <div className={cn(!Icon && "pb-1")}>
                        <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900">
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

      {/* ---------- results ----------
            split beside the heading when each outcome carries a paragraph;
            centered under it when they are single labels */}
      <section className="relative isolate overflow-hidden bg-navy-950 section-y">
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
        <div
          className={cn(
            "mx-auto w-full max-w-page px-6 sm:px-10",
            !confidential && "grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14",
          )}
        >
          <div className={cn(confidential && "text-center")}>
            {/* centered, and without the brass rule the other headings carry —
                the comp lets the subtitle sit directly under the word */}
            {confidential ? (
              <h2 className="font-display text-heading font-semibold text-white-warm text-balance">
                {copy.resultsHeading}
              </h2>
            ) : (
              <SectionHeading tone="light">
                {copy.resultsHeading}
              </SectionHeading>
            )}
            <p
              className={cn(
                "mt-5 text-sm text-cream-100/85",
                confidential ? "mx-auto max-w-[52ch]" : "max-w-[42ch]",
              )}
            >
              {copy.resultsBody}
            </p>
          </div>
          <div
            className={cn(
              "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
              confidential && "mt-10",
            )}
          >
            {copy.results.map((item, i) => {
              const Icon = Icons[item.icon];
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div
                    className={cn(
                      stripCell(!confidential),
                      "border-brass-400/40",
                      confidential && "items-center text-center",
                    )}
                  >
                    <Icon className="h-8 w-8 text-brass-400" />
                    <h3
                      className={cn(
                        "font-display font-semibold leading-snug text-white-warm text-balance",
                        confidential ? "text-lg" : "text-subheading",
                      )}
                    >
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className="text-sm text-cream-100/80">{item.body}</p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- client quote ---------- */}
      {copy.quote &&
        (confidential ? (
          <section className="relative overflow-hidden border-b border-cream-100 bg-white-warm py-14">
            <GhostRoundel className="right-6 text-navy-900/[0.055]" />
            <div className="relative mx-auto flex w-full max-w-page gap-5 px-6 sm:px-10">
              <span
                aria-hidden="true"
                className="font-display text-quote text-brass-500"
              >
                &ldquo;
              </span>
              <figure className="border-l border-brass-500/60 pl-6">
                <blockquote className="max-w-[62ch] font-display text-subheading leading-relaxed text-navy-900">
                  {copy.quote.text}
                </blockquote>
                <figcaption className="eyebrow mt-5 text-brass-600">
                  {copy.quote.role}, {copy.quote.org}
                </figcaption>
              </figure>
            </div>
          </section>
        ) : (
          <section className="border-b border-cream-100 bg-white-warm py-14">
            <div className="mx-auto grid w-full max-w-page items-center gap-8 px-6 sm:px-10 lg:grid-cols-[2fr_1fr] lg:gap-14">
              <figure className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="font-display text-quote text-brass-500"
                >
                  &ldquo;
                </span>
                <blockquote className="font-display text-subheading leading-relaxed text-navy-900">
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
        ))}

      {/* ---------- confidentiality note ---------- */}
      {copy.note && (
        <section className="bg-cream-100 py-12">
          <div className="mx-auto flex w-full max-w-page items-start gap-6 px-6 sm:px-10 sm:gap-8">
            <Icons.shieldPlain className="h-12 w-12 shrink-0 text-teal-900 sm:h-14 sm:w-14" />
            <div>
              <h2 className="font-display text-heading font-semibold text-navy-900 text-balance">
                {copy.note.title}
              </h2>
              <p className="mt-3 max-w-[68ch] text-sm text-navy-800">
                {copy.note.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---------- key roles ---------- */}
      {copy.roles && copy.rolesHeading && (
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
      )}

      {/* ---------- close ----------
            the confidential comp stacks its subtitle under the headline and
            drops the secondary link; the outcomes comp runs three columns */}
      <section className="relative overflow-hidden bg-teal-900">
        <GhostRoundel className="-left-4 text-white-warm/5" />
        <div
          className={cn(
            "relative mx-auto grid w-full max-w-page items-center gap-x-10 gap-y-6 px-6 section-y sm:px-10",
            confidential
              ? "lg:grid-cols-[1fr_auto]"
              : "lg:grid-cols-[1.3fr_1fr_auto]",
          )}
        >
          <div>
            <h2 className="font-display text-headline font-semibold text-white-warm text-balance">
              {copy.ctaHeading}
            </h2>
            {confidential && (
              <p className="mt-2 font-display text-lg text-cream-100">
                {copy.ctaBody}
              </p>
            )}
          </div>
          {!confidential && (
            <p className="max-w-[46ch] text-base text-cream-100">
              {copy.ctaBody}
            </p>
          )}
          <div className="flex flex-col items-start gap-1">
            <ButtonLink href="/contact">{copy.ctaLabel}</ButtonLink>
            {!confidential && (
              <ArrowLink href="/results" tone="light">
                {t("allStudies")}
              </ArrowLink>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/** The oversized outlined "A" the comps set behind the quote and the close. */
function GhostRoundel({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none font-display text-watermark font-medium sm:block lg:text-watermark-lg",
        className,
      )}
    >
      A
    </span>
  );
}
