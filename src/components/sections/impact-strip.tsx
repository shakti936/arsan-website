import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { type IconName, Icons } from "@/components/ui/icons";

/** "Results by area of impact", in the comp's order. */
const AREAS: IconName[] = ["person", "cog", "trend", "truck", "gear", "users"];

/**
 * The thin divided strip under the results hero
 * (refs/dirA-results-page.png). Six practice areas, icon beside label, on one
 * line at desktop.
 *
 * It is a label rather than a link. Each of these would want a filtered view
 * of the results, and there is nothing to filter yet — a row of six links that
 * all land on the same page is worse than a row that admits it is a summary.
 * Q-28 covers turning it into navigation once /results has an index.
 */
export function ImpactStrip() {
  const t = useTranslations("resultsPage.impact");

  return (
    <section
      id="impact"
      className="scroll-mt-24 border-b border-cream-100 bg-cream-50 py-8"
    >
      <Container>
        <p className="eyebrow text-navy-900">{t("heading")}</p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {AREAS.map((name, i) => {
            const Icon = Icons[name];
            return (
              <li
                key={name}
                className="flex items-center gap-3 text-sm text-navy-900 lg:border-l lg:border-cream-100 lg:pl-5 lg:[&:first-child]:border-l-0 lg:[&:first-child]:pl-0"
              >
                <Icon className="h-7 w-7 shrink-0 text-teal-900" />
                {t(`items.${i}`)}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
