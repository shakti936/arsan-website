import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

/**
 * "How can ARSAN help?" — the three services, from
 * refs/dirA-for-clients-landing.png.
 *
 * Same three doors as the home page's `Chooser`, read from the other side.
 * The Chooser asks the visitor to name their problem ("I need a critical
 * leader") and is centred like a question; this one names the service and
 * left-aligns everything, because a reader who has clicked through to
 * /for-clients has already chosen the category and is now comparing.
 *
 * The chip sits in the card's left gutter with every line of text — heading,
 * lede, body and the link — in one column beside it. The comp indents the CTA
 * to that column rather than to the card edge, which is what keeps the card
 * reading as one block instead of a header with a footer.
 *
 * Chip, gap and padding are sized against the longest link on the page:
 * "Explore Enterprise Solutions" at the eyebrow's 0.16em tracking needs ~272px,
 * and the gutter is what it comes out of. Shrinking the eyebrow instead would
 * put an off-scale type size on one page (D-063's uniform scale).
 */
const CARDS = [
  { href: "/for-clients/executive-search", icon: "person" },
  { href: "/for-clients/mexico-advisory", icon: "factory" },
  { href: "/for-clients/leadership-solutions", icon: "users" },
] as const;

export function ServiceCards() {
  const t = useTranslations("subpage.forClients");

  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <h2 className="text-center font-display text-heading font-semibold text-navy-900 text-balance">
          {t("helpHeading")}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map(({ href, icon }, i) => {
            const Icon = Icons[icon];
            return (
              <Reveal key={href} delay={i * 0.08} className="h-full">
                <article className="flex h-full gap-4 border border-cream-100 bg-white-warm p-5 shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-teal-900 text-cream-50"
                  >
                    <Icon className="h-6 w-6" />
                  </span>

                  <div className="flex flex-1 flex-col">
                    <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900 text-balance">
                      {t(`cards.${i}.title`)}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-navy-900">
                      {t(`cards.${i}.lede`)}
                    </p>
                    <p className="mt-4 flex-1 text-sm text-navy-800">
                      {t(`cards.${i}.body`)}
                    </p>
                    <div className="mt-4">
                      <ArrowLink href={href} className="text-balance">
                        {t(`cards.${i}.cta`)}
                      </ArrowLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
