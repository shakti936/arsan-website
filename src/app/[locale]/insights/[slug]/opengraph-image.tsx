import { notFound } from "next/navigation";
import { ARTICLES, articleCopy, getArticle } from "@/content/insights";
import { routing } from "@/i18n/routing";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "ARSAN — Executive Search & Manufacturing Talent Advisory";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Every card is known at build time; without this each one is a serverless
// invocation every time a crawler looks at the link.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, slug: article.slug })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  // the editorial headline, not the <title> — a shared card should read the
  // way the page reads
  return ogImage({
    locale,
    photo: article.photo,
    title: articleCopy(article, locale).title,
  });
}
