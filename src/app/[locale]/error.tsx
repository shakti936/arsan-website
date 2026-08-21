"use client";

import { useTranslations } from "next-intl";

export default function LocaleError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <main
      id="main"
      className="flex min-h-[60dvh] flex-col items-start justify-center bg-white-warm px-6 py-20 sm:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow text-brass-600">{t("errorEyebrow")}</p>
        <h1 className="mt-4 max-w-[22ch] font-display text-display-lg font-semibold text-navy-900 text-balance">
          {t("errorTitle")}
        </h1>
        <p className="mt-5 max-w-[52ch] text-base text-navy-800">
          {t("errorBody")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="eyebrow mt-8 inline-flex bg-brass-500 px-6 py-3.5 text-navy-950 transition-colors hover:bg-brass-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
        >
          {t("tryAgain")}
        </button>
      </div>
    </main>
  );
}
