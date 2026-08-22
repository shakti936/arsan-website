import { Container } from "@/components/ui/container";
import { HeroBackdrop } from "@/components/ui/hero-backdrop";

/**
 * Subpage hero. Same photographic treatment as the home hero — Drew asked for
 * every hero to carry an image — with a shorter copy column and no CTAs.
 *
 * `photo` is the same frame the page's OG card uses, so a page looks the same
 * whether you arrive on it or see it shared.
 */
export function PageHero({
  title,
  intro,
  photo,
}: {
  title: string;
  intro?: string;
  /** basename in public/images */
  photo: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <HeroBackdrop src={`/images/${photo}.jpg`} priority />
      <Container className="relative section-y">
        {/* the copy column has to stop before the scrim starts clearing at 55%
            of the container, or the intro lands on lit parts of the photograph */}
        <div className="max-w-[32rem]">
          <h1 className="font-display text-display-lg font-semibold text-white-warm text-balance">
            {title}
          </h1>
          <div aria-hidden="true" className="mt-5 h-0.5 w-10 bg-brass-500" />
          {intro && <p className="mt-6 text-lg text-cream-100">{intro}</p>}
        </div>
      </Container>
    </section>
  );
}
