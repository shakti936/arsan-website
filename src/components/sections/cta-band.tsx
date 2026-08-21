import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";

export function CtaBand() {
  const t = useTranslations("ctaBand");

  return (
    <section className="relative overflow-hidden bg-teal-900">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 select-none font-display text-[16rem] font-medium leading-none text-white-warm/5"
      >
        A
      </span>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[1.4fr_1fr_auto]">
        <h2 className="font-display text-display-lg font-semibold text-white-warm text-balance">
          {t("heading")}
        </h2>
        <p className="text-sm text-cream-100">{t("body")}</p>
        <ButtonLink href="/contact">{t("cta")}</ButtonLink>
      </div>
    </section>
  );
}
