import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { mergeCopy, pageCopyOverrides } from "@/sanity/lib/page-copy";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const catalogue = (await import(`../../messages/${locale}.json`)).default;

  /**
   * Page copy edited in the Studio is merged OVER the catalogue.
   *
   * This is the seam that makes every string on every page editable without
   * touching one of the ~30 components that render them: they all still call
   * `useTranslations(namespace)` and neither knows nor cares that a value came
   * from Sanity. The catalogue remains the structural source of truth and the
   * fallback for every key nobody has overridden, so an empty CMS renders the
   * site exactly as it is today.
   */
  const overrides = await pageCopyOverrides(locale);

  return {
    locale,
    messages: mergeCopy(catalogue, overrides),
    /**
     * Publication dates are calendar dates ("2026-08-04"), which `Date` parses
     * as UTC midnight. Formatted in any zone west of UTC — including the
     * build machine's — that renders as the day before, so an article
     * published on the 4th showed August 3. Pinning the zone makes the printed
     * date the one that was written, everywhere the site is built or served.
     */
    timeZone: "UTC",
  };
});
