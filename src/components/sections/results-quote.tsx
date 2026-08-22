import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Icons } from "@/components/ui/icons";

/**
 * The dark testimonial band from refs/dirA-results-page.png: quote mark, the
 * quote in serif, a vertical rule, then the person.
 *
 * It carries `id="testimonials"`, which the mega nav and the strip below both
 * point at. It replaced a vertical marquee of six mock quotes — the comp has
 * one testimonial here, and six invented ones scrolling past is more fiction,
 * not more proof.
 *
 * The attribution is a named individual at a named company, taken from the
 * comp. Nobody has said these words; it is marked `@unverified` in the message
 * catalog and `bun run check:launch` fails while it is here.
 */
export function ResultsQuote() {
  // @unverified: a named individual at a named company, reproduced from the results comp — nobody has said these words and no one has consented to being quoted
  const t = useTranslations("resultsPage.quote");

  return (
    <section
      id="testimonials"
      className="relative isolate scroll-mt-24 overflow-hidden bg-navy-950 section-y"
    >
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <figure className="flex gap-5">
            <span
              aria-hidden="true"
              className="font-display text-[3.5rem] leading-[0.7] text-teal-400"
            >
              &ldquo;
            </span>
            <blockquote className="font-display text-display-sm leading-relaxed text-white-warm">
              {t("text")}
            </blockquote>
          </figure>
          <div className="flex items-center gap-5 lg:border-l lg:border-cream-100/20 lg:pl-14">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-teal-400/60 text-cream-100"
            >
              <Icons.person className="h-8 w-8" />
            </span>
            <div>
              <p className="font-display text-lg text-teal-400">{t("name")}</p>
              <p className="mt-1 text-sm text-cream-100">{t("role")}</p>
              <p className="text-sm text-cream-100/75">{t("org")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
