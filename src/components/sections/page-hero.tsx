import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { HeroTitle } from "@/components/ui/hero-title";
import { type IconName, Icons } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type HeroCta = {
  label: string;
  href: React.ComponentProps<typeof ButtonLink>["href"];
};

/**
 * Subpage hero — the home hero's layout applied to every other page:
 * photograph across the band, copy column on the left over the navy, brass
 * rule, intro, a solid brass CTA beside an outlined one, region line beneath.
 *
 * The pair defaults to "Discuss a Search → /contact" and "See our work →
 * /results" from the shared `hero` namespace, so twelve pages get the same
 * hero without twelve copies of the same decision. Pages whose own route is
 * one of those two pass an override; `secondary={null}` drops the outline
 * button entirely.
 *
 * `title` is `display-xl`, the same as the home headline. It was a step down
 * at first, on the theory that a page title shouldn't compete with the one
 * line the site leads with; Drew saw the two side by side and asked why they
 * differed, which is the answer — "template" means the same type, not a
 * smaller echo of it.
 *
 * `photo` is the same frame the page's OG card uses, so a page looks the same
 * whether you arrive on it or see it shared.
 *
 * `stats` is the results comp's 2×2 grid of outlined cards. It is the one
 * thing that changes the band's shape — the copy column narrows and the cards
 * take the right half, over the photograph rather than instead of it.
 * refs/dirA-results-page.png draws that hero on flat navy with a wave graphic;
 * the photograph stays because "every page hero carries a photograph" is a
 * rule with a test behind it (D-057), and the substance of the comp's hero is
 * the eyebrow, the headline and the four figures. See Q-27.
 *
 * `badge` is the one addition to the shared layout: the job board comp sets a
 * circled briefcase and "New opportunities added weekly" beside its headline.
 * It sits in the copy column, above the region line, rather than floating over
 * the photograph — a badge on the image would be a second hero layout, and the
 * point of this component is that there is one.
 */
export type HeroStat = {
  icon: IconName;
  figure: string;
  label: string;
  note: string;
};

export function PageHero({
  title,
  eyebrow,
  emphasis,
  intro,
  photo,
  primary,
  secondary,
  badge,
  stats,
}: {
  title: string;
  /** Small caps line over the headline — "Results that matter". */
  eyebrow?: string;
  /** A phrase inside `title` to set in brass italic, as the comps do. */
  emphasis?: string;
  intro?: string;
  /** basename in public/images */
  photo: string;
  primary?: HeroCta;
  /** `null` renders no outline button */
  secondary?: HeroCta | null;
  /** A single reassurance under the buttons — see the note above. */
  badge?: { icon: IconName; text: string };
  /** Four outlined figures beside the copy. See the note above. */
  stats?: HeroStat[];
}) {
  const t = useTranslations("hero");
  const first = primary ?? { label: t("ctaPrimary"), href: "/contact" };
  const second =
    secondary === null
      ? null
      : (secondary ?? { label: t("ctaSecondary"), href: "/results" });

  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <HeroBackdrop src={`/images/${photo}.jpg`} priority />
      <Container className="relative section-y">
        <div
          className={cn(
            stats &&
              "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14",
          )}
        >
          {/* the copy column has to stop before the scrim starts clearing at 55%
            of the container, or the intro lands on lit parts of the photograph */}
          <div className="flex max-w-[32rem] flex-col items-start">
            {eyebrow && (
              <>
                <p className="eyebrow text-cream-100">{eyebrow}</p>
                <div
                  aria-hidden="true"
                  className="mt-3 h-0.5 w-10 bg-teal-400"
                />
              </>
            )}
            <HeroTitle
              text={title}
              emphasis={emphasis}
              className="text-display-xl"
            />
            <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
            {intro && (
              <p className="mt-6 max-w-[40ch] text-lg text-cream-100">
                {intro}
              </p>
            )}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <ButtonLink href={first.href}>{first.label}</ButtonLink>
              {second && (
                <ButtonLink href={second.href} variant="outline">
                  {second.label}
                </ButtonLink>
              )}
            </div>
            {badge && <HeroBadge {...badge} />}
            <p className="eyebrow mt-10 text-cream-100/70">{t("regions")}</p>
          </div>
          {stats && <HeroStats stats={stats} />}
        </div>
      </Container>
    </section>
  );
}

/**
 * The four figures. Two columns even on a phone: they are short, and a single
 * stacked column pushes the whole band past a screen height before the reader
 * reaches the buttons.
 */
function HeroStats({ stats }: { stats: HeroStat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-5">
      {stats.map((stat) => {
        const Icon = Icons[stat.icon];
        return (
          <li
            key={stat.label}
            className="border border-cream-100/25 bg-navy-950/80 p-5 backdrop-blur-sm sm:p-6"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brass-400/60 text-brass-400"
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-display-lg font-semibold leading-none text-white-warm">
              {stat.figure}
            </p>
            <p className="mt-3 text-sm text-white-warm">{stat.label}</p>
            <p className="mt-1 text-sm text-cream-100/80">{stat.note}</p>
          </li>
        );
      })}
    </ul>
  );
}

function HeroBadge({ icon, text }: { icon: IconName; text: string }) {
  const Icon = Icons[icon];
  return (
    <p className="mt-8 flex items-center gap-3 text-sm text-cream-100">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass-400/60 text-brass-400"
      >
        <Icon className="h-5 w-5" />
      </span>
      {text}
    </p>
  );
}
