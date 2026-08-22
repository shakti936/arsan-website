import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { type IconName, Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

/**
 * The card router: "What talent challenge are you facing?" on the home page
 * (refs/dirA-home-v2.png) and "How can ARSAN help?" on /for-candidates
 * (refs/dirA-for-candidates-landing.png).
 *
 * One component with a namespace and a card list, because the two comps draw
 * the same card — teal disc straddling the top border, need, service line,
 * body, arrow — and differ only in how many there are and where they point.
 *
 * The teal chip straddling each card's top border is the mockup's, measured
 * off it: a 40px circle in a 941px-wide comp whose top border crosses at 37%
 * of its height, hence `-mt-5` on a `h-14` circle. Teal, not brass — D-063
 * kept `teal-800/900` for exactly these icon chips when it ruled the mockups'
 * sage green out as an accent.
 *
 * The service line is set in title case, not as an `eyebrow`. Uppercase plus
 * 0.16em tracking runs "Enterprise Talent & Leadership Solutions" to two lines
 * in a column this narrow and pushes every card taller than the comp.
 */
export type ChooserCard = {
  /** A route on this site — every card in both comps is an internal link. */
  href: string;
  icon: IconName;
};

const CLIENT_CARDS: ChooserCard[] = [
  { href: "/for-clients/executive-search", icon: "person" },
  { href: "/for-clients/mexico-advisory", icon: "factory" },
  { href: "/for-clients/leadership-solutions", icon: "users" },
];

export function Chooser({
  namespace = "home.chooser",
  cards = CLIENT_CARDS,
  className,
}: {
  namespace?: string;
  cards?: ChooserCard[];
  className?: string;
} = {}) {
  const t = useTranslations(namespace);

  return (
    <section className={cn("bg-white-warm section-y", className)}>
      <div className="mx-auto w-full max-w-page px-6 sm:px-10">
        <h2 className="text-center font-display text-display-md font-semibold text-navy-900 text-balance">
          {t("heading")}
        </h2>
        <div
          className={cn(
            "mt-14 grid gap-6 md:grid-cols-2",
            cards.length === 4 ? "lg:grid-cols-4" : "md:grid-cols-3",
          )}
        >
          {cards.map(({ href, icon }, i) => {
            const Icon = Icons[icon];
            return (
              <Reveal key={href} delay={i * 0.08} className="h-full">
                <article className="flex h-full flex-col border border-cream-100 bg-white-warm px-6 pb-7 text-center shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
                  <span
                    aria-hidden="true"
                    className="-mt-5 mb-6 flex h-14 w-14 shrink-0 items-center justify-center self-center rounded-full bg-teal-900 text-cream-50"
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900 text-balance">
                    {t(`cards.${i}.need`)}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-navy-900 text-balance">
                    {t(`cards.${i}.service`)}
                  </p>
                  <p className="mt-4 flex-1 text-sm text-navy-800 text-pretty">
                    {t(`cards.${i}.body`)}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <ArrowLink href={href} className="text-balance">
                      {t(`cards.${i}.cta`)}
                    </ArrowLink>
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
