import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { HeroTitle } from "@/components/ui/hero-title";
import { type IconName, Icons } from "@/components/ui/icons";

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
 * `badge` is the one addition to the shared layout: the job board comp sets a
 * circled briefcase and "New opportunities added weekly" beside its headline.
 * It sits in the copy column, above the region line, rather than floating over
 * the photograph — a badge on the image would be a second hero layout, and the
 * point of this component is that there is one.
 */
export function PageHero({
  title,
  emphasis,
  intro,
  photo,
  primary,
  secondary,
  badge,
}: {
  title: string;
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
        {/* the copy column has to stop before the scrim starts clearing at 55%
            of the container, or the intro lands on lit parts of the photograph */}
        <div className="flex max-w-[32rem] flex-col items-start">
          <HeroTitle
            text={title}
            emphasis={emphasis}
            className="text-display-xl"
          />
          <div aria-hidden="true" className="mt-6 h-0.5 w-10 bg-brass-500" />
          {intro && (
            <p className="mt-6 max-w-[40ch] text-lg text-cream-100">{intro}</p>
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
      </Container>
    </section>
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
