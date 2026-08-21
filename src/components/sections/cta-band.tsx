import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";

export function CtaBand() {
  const t = useTranslations("ctaBand");

  return (
    <section className="relative overflow-hidden bg-teal-900">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 select-none font-display text-[12rem] font-medium leading-none text-white-warm/5 sm:block lg:text-[16rem]"
      >
        A
      </span>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-x-10 gap-y-6 px-6 section-y sm:px-10 lg:grid-cols-[1.3fr_1fr_auto]">
        <h2 className="font-display text-display-lg font-semibold text-white-warm text-balance">
          {t("heading")}
        </h2>
        <p className="max-w-[46ch] text-base text-cream-100">{t("body")}</p>
        <ButtonLink href="/contact">{t("cta")}</ButtonLink>
      </div>
    </section>
  );
}
