import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // EN unprefixed (/services), ES prefixed (/es/servicios-style paths later)
  localePrefix: "as-needed",
});
