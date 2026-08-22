import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { SanityLive } from "@/sanity/lib/live";
import "../globals.css";

// Display only — never below ~24px, weights 500+ (docs/sop/08-design-system.md)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body, UI, and letterspaced eyebrows
const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

type LocaleParams = { locale: string };

export function generateStaticParams(): LocaleParams[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    ...pageMetadata({
      locale,
      path: "/",
      title: t("title"),
      description: t("description"),
    }),
    // the template applies to child pages, which set a bare title string
    title: {
      default: t("title"),
      template: "%s — ARSAN",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#061e39",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${franklin.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
        {/*
          Live content. `SanityLive` opens a channel that re-renders the page
          when a document changes, so the Presentation preview updates as an
          editor types rather than on refresh. `includeDrafts` is gated on
          draft mode: without it, a published visitor's page would subscribe to
          unpublished changes.

          `VisualEditing` draws the click-to-edit overlays and only exists
          inside preview — it is a Studio affordance, not something to ship to
          a reader.
        */}
        <SanityLive includeDrafts={isDraft} />
        {isDraft && <VisualEditing />}
      </body>
    </html>
  );
}
