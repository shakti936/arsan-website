import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Chooser } from "@/components/sections/chooser";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { QuoteBand } from "@/components/sections/quote-band";
import { Stories } from "@/components/sections/stories";
import { ValueProps } from "@/components/sections/value-props";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main>
      <Hero namespace="home.hero" />
      <Chooser />
      <ValueProps />
      <QuoteBand namespace="home.quote" />
      <Stories />
      <CtaBand />
    </main>
  );
}
