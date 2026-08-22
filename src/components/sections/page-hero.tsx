import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";
import { HeroTitle } from "@/components/ui/hero-title";

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
 * `title` stays at `display-lg` where the home headline is `display-xl` — same
 * template, one step down, so a page title doesn't compete with the one
 * headline the site leads with.
 *
 * `photo` is the same frame the page's OG card uses, so a page looks the same
 * whether you arrive on it or see it shared.
 */
export function PageHero({
  title,
  emphasis,
  intro,
  photo,
  primary,
  secondary,
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
            className="text-display-lg"
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
          <p className="eyebrow mt-10 text-cream-100/70">{t("regions")}</p>
        </div>
      </Container>
    </section>
  );
}
