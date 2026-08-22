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

/**
 * Every page's metadata, made in one place.
 *
 * Pages used to set only `title`, `description` and `alternates`. `openGraph`
 * was defined once in the root layout, and because a child's `openGraph`
 * replaces the parent's wholesale rather than merging field by field, every
 * shared link carried the *site* title and description — a link to
 * "Your Mexico operation starts long before production does." previewed as
 * "ARSAN — Executive Search & Manufacturing Talent Advisory".
 *
 * `images` is set explicitly rather than left to Next's file-convention
 * detection, which builds the URL from the route segments and so emits the
 * `/en/...` form. Under `localePrefix: "as-needed"` that 307s to the
 * unprefixed URL *and* mangles the cache-busting query on the way
 * (`?14c6…` becomes `?14c6…=`). Scrapers that don't follow redirects on images
 * get nothing. This points straight at the canonical URL.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  /** Route path starting with "/", or "/" for the home page */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = localeUrl(locale, path);
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: "ARSAN",
      locale: locale === "es" ? "es_MX" : "en_US",
      url,
      title,
      description,
      images: [
        {
          url: `${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}
