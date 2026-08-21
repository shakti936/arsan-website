"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("ariaLocale")} className="flex items-center gap-2">
      {routing.locales.map((target, i) => (
        <span key={target} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="h-3 w-px bg-cream-100/30" />
          )}
          <Link
            href={pathname}
            locale={target}
            aria-current={target === locale ? "true" : undefined}
            className={cn(
              "eyebrow py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300",
              target === locale
                ? "text-brass-400"
                : "text-cream-100/70 hover:text-cream-50",
            )}
          >
            {target.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
