import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

/** The four reasons, in the order refs/dirA-job-board.png sets them. */
const REASONS = ["users", "handshake", "chart", "shield"] as const;

/**
 * "Why work with ARSAN?" — the centered four-up under the job board. Filled
 * teal discs rather than the outlined brass ones used on the dark bands: this
 * sits on cream, where an outline reads as a placeholder.
 */
export function WhyWorkBand() {
  const t = useTranslations("subpage.opportunities");

  return (
    <section className="border-t border-cream-100 bg-white-warm section-y">
      <Container>
        <div className="text-center">
          <h2 className="font-display text-heading font-semibold text-navy-900 text-balance">
            {t("whyHeading")}
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-0.5 w-10 bg-teal-900"
          />
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((icon, i) => {
            const Icon = Icons[icon];
            return (
              <Reveal key={icon} delay={i * 0.06}>
                <div className="flex h-full flex-col items-center px-2 text-center sm:border-l sm:border-cream-100 sm:[&:nth-child(odd)]:border-l-0 lg:[&:nth-child(odd)]:border-l lg:[&:first-child]:border-l-0">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-900 text-cream-50"
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                    {t(`why.${i}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[30ch] text-sm text-navy-800">
                    {t(`why.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
