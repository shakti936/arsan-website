import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.arsancg.com";

/** Path per locale ("" for the unprefixed default). `path` starts with "/" or is "". */
export function localeUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path === "/" ? "" : path}` || SITE_URL;
}

/** hreflang alternates for a route — canonical per locale + x-default. */
export function alternatesFor(
  locale: string,
  path: string,
): Metadata["alternates"] {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      en: localeUrl("en", path),
      es: localeUrl("es", path),
      "x-default": localeUrl(routing.defaultLocale, path),
    },
  };
}
