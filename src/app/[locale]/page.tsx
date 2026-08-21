import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

// Placeholder hero proving out tokens, fonts, and i18n.
// Replaced by the real Direction A hero component in the P1 build.
export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");

  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-6 bg-navy-900 px-6 py-16 sm:px-12 lg:px-24">
      <p className="eyebrow text-brass-400">{t("eyebrow")}</p>
      <h1 className="max-w-[18ch] font-display text-display-xl leading-[1.05] font-semibold text-white-warm">
        {t("headlineLead")}{" "}
        <em className="font-medium text-brass-400">{t("headlineEmphasis")}</em>{" "}
        {t("headlineTail")}
      </h1>
      <p className="max-w-[52ch] text-base leading-relaxed text-cream-100">
        {t("subhead")}
      </p>
      <div className="mt-2 flex flex-wrap gap-4">
        <a
          href="#contact"
          className="eyebrow bg-brass-500 px-6 py-3.5 text-navy-950 transition-colors hover:bg-brass-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
        >
          {t("ctaPrimary")}
        </a>
        <a
          href="#why"
          className="eyebrow border border-brass-500 px-6 py-3.5 text-cream-50 transition-colors hover:border-brass-300 hover:text-white-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
        >
          {t("ctaSecondary")}
        </a>
      </div>
    </main>
  );
}
