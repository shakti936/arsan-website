import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type Point = { title: string; body: string };

/** Three-up brass-rule points used on service pages */
export function PointGrid({ points }: { points: Point[] }) {
  return (
    <section className="bg-white-warm py-16 lg:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.08}>
              <div className="border-t border-brass-500/40 pt-5">
                <h2 className="font-display text-2xl font-semibold text-navy-900 text-balance">
                  {point.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-800">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
