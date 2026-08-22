import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * A numbered process — the same treatment the confidential case study uses for
 * its approach (teal discs with a rule running between them), lifted out so a
 * page that is *about* the process can carry it too.
 *
 * Two columns rather than the case study's one: this list is the argument
 * itself rather than one panel of a story, so it gets the width.
 */
export function ProcessSteps({
  namespace,
  id,
  count,
}: {
  namespace: string;
  id?: string;
  count: number;
}) {
  const t = useTranslations(namespace);

  return (
    <section
      id={id}
      className="border-t border-cream-100 bg-cream-50 scroll-mt-24 section-y"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div>
            <SectionHeading>{t("heading")}</SectionHeading>
            <p className="mt-5 max-w-[46ch] text-base text-navy-800">
              {t("body")}
            </p>
          </div>
          <ol className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {Array.from({ length: count }, (_, i) => {
              const last = i === count - 1;
              return (
                <Reveal key={t(`steps.${i}.title`)} delay={i * 0.06}>
                  <li className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex shrink-0 flex-col items-center self-stretch"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-900 font-display text-base font-semibold text-cream-50">
                        {i + 1}
                      </span>
                      {/* the rule runs between discs within a column, so the
                          last item in each column does not draw one */}
                      {!last && (
                        <span className="mt-1 w-px flex-1 bg-teal-900/25 sm:hidden" />
                      )}
                    </span>
                    <div className="pb-1">
                      <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                        {t(`steps.${i}.title`)}
                      </h3>
                      <p className="mt-2 text-base text-navy-800">
                        {t(`steps.${i}.body`)}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
