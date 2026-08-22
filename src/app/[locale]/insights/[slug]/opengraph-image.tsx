import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { articleSlugs, getArticleView } from "@/lib/articles";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "ARSAN — Executive Search & Manufacturing Talent Advisory";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Every card is known at build time; without this each one is a serverless
// invocation every time a crawler looks at the link.
export async function generateStaticParams() {
  const slugs = await articleSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleView(slug, locale);
  if (!article) notFound();
  // the editorial headline, not the <title> — a shared card should read the
  // way the page reads
  return ogImage({ locale, photo: article.image.url, title: article.title });
}
