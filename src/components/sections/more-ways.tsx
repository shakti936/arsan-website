import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { type IconName, Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

/** The four routes out, in the comp's order. */
const WAYS: { icon: IconName; href: string }[] = [
  { icon: "personStar", href: "/results#case-studies" },
  // the one piece on the site that documents a measured client outcome
  { icon: "chat", href: "/insights/from-vacant-to-victorious" },
  { icon: "document", href: "/results#testimonials" },
  { icon: "factory", href: "/results#impact" },
];

/**
 * "More ways we deliver results" — the closing strip from
 * refs/dirA-results-page.png, in place of the site's usual teal CTA band,
 * which this comp does not have.
 *
 * None of the four has a page of its own yet, so each points at the band or
 * article that actually holds what it promises rather than back at this page.
 * Q-28 covers splitting them out.
 */
export function MoreWays() {
  const t = useTranslations("resultsPage.more");

  return (
    <section className="border-t border-cream-100 bg-white-warm section-y">
      <Container>
        <div className="text-center">
          <h2 className="font-display text-heading font-semibold text-navy-900 text-balance">
            {t("heading")}
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-0.5 w-10 bg-teal-700"
          />
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map(({ icon, href }, i) => {
            const Icon = Icons[icon];
            return (
              <Reveal key={icon} delay={i * 0.06} className="h-full">
                <li className="flex h-full flex-col lg:border-l lg:border-cream-100 lg:pl-6 lg:[&:first-child]:border-l-0 lg:[&:first-child]:pl-0">
                  <Icon className="h-9 w-9 text-teal-900" />
                  <h3 className="mt-4 font-display text-subheading font-semibold leading-snug text-navy-900">
                    {t(`items.${i}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-navy-800">
                    {t(`items.${i}.body`)}
                  </p>
                  <div className="mt-5">
                    <ArrowLink href={href}>{t(`items.${i}.cta`)}</ArrowLink>
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
