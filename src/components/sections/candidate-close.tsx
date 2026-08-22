import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";

/**
 * The candidate close from refs/dirA-job-board.png — a navy block inset on the
 * cream page rather than the site's usual full-bleed teal band.
 *
 * It is a different band from `CtaBand` on purpose. That one closes a page
 * that has been arguing; this one closes a list, and the offer is narrower:
 * *the thing you were looking for isn't here, so let's talk*. The second line
 * carries the brass, which is what makes the offer read as an invitation
 * rather than a consolation.
 */
export function CandidateClose() {
  const t = useTranslations("subpage.opportunities");

  return (
    <section className="bg-white-warm pb-16 lg:pb-24">
      <Container>
        <div className="flex flex-col items-start gap-8 overflow-hidden bg-navy-900 px-8 py-10 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-14">
          <span
            aria-hidden="true"
            className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full border border-cream-100/25 text-cream-100 lg:flex"
          >
            <Icons.document className="h-11 w-11" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-heading font-semibold text-white-warm text-balance">
              {t("closeHeading")}
              <span className="mt-1 block font-medium text-brass-400">
                {t("closeEmphasis")}
              </span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-base text-cream-100">
              {t("closeBody")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <ButtonLink href="/for-candidates/submit-profile">
              {t("closeCta")}
            </ButtonLink>
            <ArrowLink href="/contact" tone="light">
              {t("closeSecondary")}
            </ArrowLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
