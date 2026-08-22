import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { ArticleCopy } from "@/content/insights";

/**
 * Article hero from refs/dirA-article-*.png: a navy band split down the
 * middle, copy on the left, the photograph filling the right half edge to
 * edge.
 *
 * This is the one hero on the site that does *not* use `HeroBackdrop`. Every
 * other hero rakes navy across a single full-bleed photograph so type can sit
 * over it; here the photograph and the type occupy separate halves, so a scrim
 * would only dull the image. Below `lg` the split collapses and the photograph
 * runs full width above the copy — a portrait-width column can't carry a
 * three-line headline over an image and stay readable.
 */
export function ArticleHero({
  copy,
  photo,
  published,
  readingMinutes,
}: {
  copy: ArticleCopy;
  photo: string;
  published: string;
  readingMinutes: number;
}) {
  const t = useTranslations("article");
  const format = useFormatter();

  return (
    <section className="relative isolate bg-navy-900">
      <div className="lg:grid lg:grid-cols-2">
        {/* photograph first in the DOM only below lg, where it sits on top;
            at lg it is the right column either way, so order stays natural */}
        <div className="relative aspect-16/10 w-full lg:order-2 lg:aspect-auto lg:min-h-[34rem]">
          <Image
            src={`/images/${photo}.jpg`}
            alt={copy.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="px-6 py-12 sm:px-10 lg:order-1 lg:py-16 lg:pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] lg:pr-14">
          <Breadcrumb
            label={t("breadcrumbLabel")}
            items={[
              { label: t("home"), href: "/" },
              { label: t("insights"), href: "/insights" },
              { label: copy.category },
            ]}
          />

          <p className="eyebrow mt-8 text-brass-400">{copy.category}</p>
          <div aria-hidden="true" className="mt-3 h-0.5 w-10 bg-brass-500" />

          <h1 className="mt-6 max-w-[20ch] font-display text-display-xl font-semibold text-white-warm text-balance">
            {copy.title}
          </h1>

          <div aria-hidden="true" className="mt-7 h-0.5 w-10 bg-brass-500" />
          <p className="mt-6 max-w-[46ch] text-lg text-cream-100">
            {copy.deck}
          </p>

          <div className="mt-9 text-sm text-cream-100/75">
            <p>{t("byline", { author: copy.pullQuoteBy })}</p>
            <p className="mt-1">
              {format.dateTime(new Date(published), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              {t("readingTime", { minutes: readingMinutes })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
