import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/insights";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/site";

const PATHS = [
  "/",
  "/for-clients",
  "/for-clients/executive-search",
  "/for-clients/mexico-advisory",
  "/for-clients/leadership-solutions",
  "/for-candidates",
  "/for-candidates/opportunities",
  "/for-candidates/submit-profile",
  "/for-candidates/talent-network",
  "/results",
  "/insights",
  "/why-arsan",
  "/contact",
];

/**
 * Articles carry their real publication date rather than the build date. A
 * sitemap that reports every URL as modified today teaches a crawler to stop
 * believing `lastmod`, which is the one signal it is there to provide.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PATHS.map((path) => ({ path, lastModified: new Date() }));
  const articles = ARTICLES.map((article) => ({
    path: `/insights/${article.slug}`,
    lastModified: new Date(article.published),
  }));

  return [...pages, ...articles].flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localeUrl(l, path)]),
        ),
      },
    })),
  );
}
