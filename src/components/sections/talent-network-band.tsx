import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";

/**
 * "The right opportunity may not be open today." — the quiet band between the
 * career insights and the close in refs/dirA-for-candidates-landing.png.
 *
 * It carries an outlined button rather than a solid one. The page already has
 * a primary action in the hero and another in the close; a third solid brass
 * button would be three primaries, which is none.
 */
export function TalentNetworkBand() {
  const t = useTranslations("subpage.forCandidates");

  return (
    <section className="bg-cream-100 py-12">
      <Container>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-8">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-teal-900/35 text-teal-900"
          >
            <Icons.users className="h-9 w-9" />
          </span>
          <h2 className="max-w-[22ch] font-display text-heading font-semibold text-navy-900 text-balance">
            {t("networkHeading")}
          </h2>
          <p className="max-w-[38ch] flex-1 text-sm text-navy-800">
            {t("networkBody")}
          </p>
          <ButtonLink
            href="/for-candidates/talent-network"
            variant="outline-dark"
          >
            {t("networkCta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
