import type { MetadataRoute } from "next";
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

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localeUrl(l, path)]),
        ),
      },
    })),
  );
}
