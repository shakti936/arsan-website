import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <main
      id="main"
      className="flex min-h-[60dvh] flex-col items-start justify-center bg-white-warm px-6 section-y sm:px-10"
    >
      <div className="mx-auto w-full max-w-page">
        <p className="eyebrow text-brass-600">404</p>
        <h1 className="mt-4 max-w-[22ch] font-display text-display-lg font-semibold text-navy-900 text-balance">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-5 max-w-[52ch] text-base text-navy-800">
          {t("notFoundBody")}
        </p>
        <div className="mt-8">
          <ButtonLink href="/">{t("backHome")}</ButtonLink>
        </div>
      </div>
    </main>
  );
}
