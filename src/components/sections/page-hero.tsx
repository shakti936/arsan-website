import { Container } from "@/components/ui/container";

/** Compact navy hero for subpages */
export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="bg-navy-900">
      <Container className="py-16 lg:py-20">
        <h1 className="max-w-[22ch] font-display text-display-lg font-semibold text-white-warm text-balance">
          {title}
        </h1>
        <div aria-hidden="true" className="mt-5 h-0.5 w-10 bg-brass-500" />
        {intro && (
          <p className="mt-6 max-w-[58ch] text-lg text-cream-100">{intro}</p>
        )}
      </Container>
    </section>
  );
}
