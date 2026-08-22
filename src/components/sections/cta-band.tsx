import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * The teal closing band. `namespace` lets a page bring its own words —
 * refs/dirA-for-clients-landing.png closes with "Tell us what you're working
 * through" and a second, quieter way out ("Or explore client solutions"),
 * which is the right offer at the end of a page that has just described three
 * services. The default is the site-wide invitation.
 *
 * `secondary` is a link, not a second button. Two buttons of equal weight in a
 * closing band is two primary actions, which is none.
 */
export function CtaBand({
  namespace = "ctaBand",
  href = "/contact",
  secondary,
}: {
  namespace?: string;
  /** Where the solid button goes. Not every page's close is "talk to us". */
  href?: React.ComponentProps<typeof ButtonLink>["href"];
  secondary?: {
    label: string;
    href: React.ComponentProps<typeof ArrowLink>["href"];
  };
} = {}) {
  const t = useTranslations(namespace);

  return (
    <section className="relative overflow-hidden bg-teal-900">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 select-none font-display text-watermark font-medium text-white-warm/5 sm:block lg:text-watermark-lg"
      >
        A
      </span>
      <div className="relative mx-auto grid w-full max-w-page items-center gap-x-10 gap-y-6 px-6 section-y sm:px-10 lg:grid-cols-[1.3fr_1fr_auto]">
        <h2 className="font-display text-headline font-semibold text-white-warm text-balance">
          {t("heading")}
        </h2>
        <p className="max-w-[46ch] text-base text-cream-100">{t("body")}</p>
        <div className="flex flex-col items-start gap-1">
          <ButtonLink href={href}>{t("cta")}</ButtonLink>
          {secondary && (
            <ArrowLink href={secondary.href} tone="light">
              {secondary.label}
            </ArrowLink>
          )}
        </div>
      </div>
    </section>
  );
}
