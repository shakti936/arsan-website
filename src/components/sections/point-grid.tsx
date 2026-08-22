import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type Point = { title: string; body: string };

/**
 * Three-up brass-rule points used on service pages.
 *
 * A list, not headings. Each point used to be an `<h2>` set at subheading
 * size, which made "h2" mean two different sizes across the site — the exact
 * inconsistency the role scale exists to remove — and put three feature blurbs
 * into the document outline as if they were sections. They are items in a
 * strip: `<ul>` says that, and a screen reader gets a count instead of three
 * misleading landmarks. The visual result is identical.
 */
export function PointGrid({ points }: { points: Point[] }) {
  return (
    <section className="bg-white-warm section-y">
      <Container>
        <ul className="grid gap-10 md:grid-cols-3">
          {points.map((point, i) => (
            <li key={point.title}>
              <Reveal delay={i * 0.08}>
                <div className="border-t border-brass-500/40 pt-5">
                  <p className="font-display text-subheading font-semibold text-navy-900 text-balance">
                    {point.title}
                  </p>
                  <p className="mt-3 text-base text-navy-800">{point.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
