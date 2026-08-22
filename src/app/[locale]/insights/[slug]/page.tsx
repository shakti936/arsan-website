import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleBody } from "@/components/sections/article-body";
import { ArticleHero } from "@/components/sections/article-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { RelatedInsights } from "@/components/sections/related-insights";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import type { CategoryKey } from "@/lib/article-categories";
import { articleSlugs, getArticleView } from "@/lib/articles";
import { localeUrl, pageMetadata, SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

/**
 * Every article in every locale is known at build time, so all of them are
 * prerendered. Without this each one is a serverless invocation the first time
 * a crawler or a reader asks for it.
 */
export async function generateStaticParams() {
  const slugs = await articleSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleView(slug, locale);
  if (!article) return {};

  // the SEO tab is optional and falls back to the article's own words rather
  // than to an empty tag
  return pageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.deck,
    publishedTime: article.published,
  });
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const category = await getTranslations({
    locale,
    namespace: "articleCategories",
  });

  const article = await getArticleView(slug, locale);
  if (!article) notFound();
  const url = localeUrl(locale, `/insights/${slug}`);

  /**
   * Article and BreadcrumbList, emitted together in one graph.
   *
   * `headline` is the editorial title, not the `<title>` — Google shows this
   * one, and it should read the way the page reads. `author` and `publisher`
   * are the organization: these are written by ARSAN's editorial team rather
   * than by a named person, and inventing a byline to satisfy a schema field
   * would be a claim about a human being who doesn't exist.
   *
   * `dateModified` mirrors `datePublished` because nothing has been revised
   * yet. It has to move when an article does.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.seo?.description ?? article.deck,
        inLanguage: locale === "es" ? "es-MX" : "en-US",
        datePublished: article.published,
        dateModified: article.published,
        articleSection: category(article.categoryKey as CategoryKey),
        image: [article.image.url],
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "ARSAN", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "ARSAN",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo/arsan-lockup-navy.png`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ARSAN",
            item: localeUrl(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category(article.categoryKey as CategoryKey),
            item: localeUrl(locale, "/insights"),
          },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <JsonLd data={jsonLd} />
      <ArticleHero article={article} />
      <ArticleBody article={article} />
      <RelatedInsights currentSlug={slug} locale={locale} />
      <CtaBand />
      <NewsletterBand />
    </main>
  );
}
