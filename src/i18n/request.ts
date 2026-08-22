import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
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
