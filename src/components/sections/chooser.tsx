import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

/**
 * "What talent challenge are you facing?" — the three-door router into the
 * client services, built to refs/dirA-home-v2.png.
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
const CARDS = [
  { href: "/for-clients/executive-search", icon: "person" },
  { href: "/for-clients/mexico-advisory", icon: "factory" },
  { href: "/for-clients/leadership-solutions", icon: "users" },
] as const;

export function Chooser() {
  const t = useTranslations("home.chooser");

  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <h2 className="text-center font-display text-display-md font-semibold text-navy-900 text-balance">
          {t("heading")}
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map(({ href, icon }, i) => {
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
                  {/* tighter than the 0.16em eyebrow default: "Explore
                      Leadership Solutions" set at 0.16em is wider than a third
                      of a 72rem container, and broke with the arrow stranded
                      on its own line */}
                  <div className="mt-6 flex justify-center">
                    <ArrowLink
                      href={href}
                      className="tracking-[0.1em] text-balance"
                    >
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
