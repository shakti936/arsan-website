"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { type IconName, Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import type { CategoryKey } from "@/content/insights";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type IndexCard = {
  slug: string;
  categoryKey: CategoryKey;
  photo: string;
  published: string;
  readingMinutes: number;
  title: string;
  deck: string;
};

type Tab = "all" | CategoryKey;

/** The bar's order and icons, from refs/dirA-insights-index.png. */
const TABS: { key: Tab; icon: IconName }[] = [
  { key: "all", icon: "document" },
  { key: "market", icon: "chart" },
  { key: "hiring", icon: "users" },
  { key: "leadership", icon: "shield" },
  { key: "trends", icon: "factory" },
  { key: "caseStudy", icon: "clipboard" },
];

/**
 * The /insights index: the category bar and the grid it filters.
 *
 * One component rather than two, because the bar has no meaning apart from the
 * grid — a filter and the thing it filters that talk through a parent are two
 * places to get the same state wrong.
 *
 * Filtering is client-side over the whole list, as on the job board and for the
 * same reason: five articles is a few KB and the alternative is a navigation
 * per click. It moves behind a query when the archive is large enough to
 * paginate.
 *
 * **The featured layout only appears unfiltered.** One large card beside four
 * small ones says "start here"; the same shape applied to a category with two
 * articles in it says nothing, so a filtered view is a plain grid.
 */
export function InsightsIndex({ cards }: { cards: IndexCard[] }) {
  const t = useTranslations("insightsIndex");
  const tc = useTranslations("articleCategories");
  const [tab, setTab] = useState<Tab>("all");

  // a tab with nothing behind it is a dead control
  const available = TABS.filter(
    ({ key }) => key === "all" || cards.some((c) => c.categoryKey === key),
  );
  const shown =
    tab === "all" ? cards : cards.filter((c) => c.categoryKey === tab);
  const featured = tab === "all" && shown.length > 2;
  const [lead, ...rest] = shown;

  return (
    <>
      <nav
        aria-label={t("filterLabel")}
        className="border-b border-cream-100 bg-cream-50"
      >
        <Container>
          <ul className="flex overflow-x-auto">
            {available.map(({ key, icon }) => {
              const Icon = Icons[icon];
              const active = key === tab;
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab(key)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex min-w-32 flex-col items-center gap-2 border-b-2 px-6 py-6 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brass-500 motion-reduce:transition-none",
                      active
                        ? "border-brass-500 text-navy-900"
                        : "border-transparent text-navy-800 hover:text-brass-600",
                    )}
                  >
                    <Icon className="h-7 w-7" />
                    {key === "all" ? t("all") : tc(key)}
                  </button>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      <section className="bg-white-warm section-y">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-display-md font-semibold text-navy-900">
                {tab === "all" ? t("heading") : tc(tab)}
              </h2>
              <div
                aria-hidden="true"
                className="mt-3 h-0.5 w-10 bg-brass-500"
              />
            </div>
            {/* only when filtered: on the unfiltered view this would offer a
                reader what they are already looking at */}
            {tab !== "all" && (
              <button
                type="button"
                onClick={() => setTab("all")}
                className="eyebrow flex items-center gap-2 py-3 text-brass-600 transition-colors hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-500 motion-reduce:transition-none"
              >
                {t("viewAll")}
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>

          <div
            className={cn(
              "mt-8 grid gap-6",
              featured
                ? "lg:grid-cols-[1.15fr_1fr_1fr]"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {featured && lead && (
              <Card card={lead} tone="featured" badge={t("featured")} />
            )}
            {(featured ? rest : shown).map((card, i) => (
              <Card key={card.slug} card={card} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function Card({
  card,
  tone = "small",
  badge,
  delay = 0,
}: {
  card: IndexCard;
  tone?: "small" | "featured";
  badge?: string;
  delay?: number;
}) {
  const t = useTranslations("insightsRow");
  const tc = useTranslations("articleCategories");
  const format = useFormatter();
  const featured = tone === "featured";

  return (
    <Reveal delay={delay} className={cn("h-full", featured && "lg:row-span-2")}>
      <article className="group relative flex h-full flex-col border border-cream-100 bg-white-warm shadow-[0_1px_2px_rgba(6,30,57,.06)] transition-shadow duration-300 hover:shadow-[0_10px_28px_-12px_rgba(6,30,57,.28)] motion-reduce:transition-none">
        <div
          className={cn(
            "relative overflow-hidden bg-cream-100",
            // the featured card spans two rows, so its photograph takes the
            // slack rather than leaving a void above the dateline
            featured ? "min-h-64 flex-1" : "h-40 shrink-0",
          )}
        >
          <Image
            src={`/images/${card.photo}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {badge && (
            <p className="absolute left-4 top-4 bg-navy-900 px-3 py-1.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-cream-50">
              {badge}
            </p>
          )}
        </div>
        <div className={cn("flex flex-col p-6", !featured && "flex-1")}>
          <p className="eyebrow text-brass-600">{tc(card.categoryKey)}</p>
          <h3
            className={cn(
              "mt-3 font-display font-semibold leading-snug text-navy-900 text-balance",
              featured ? "text-display-md" : "text-display-sm",
            )}
          >
            <Link
              href={`/insights/${card.slug}`}
              className="transition-colors after:absolute after:inset-0 group-hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
            >
              {card.title}
            </Link>
          </h3>
          <p className="mt-3 flex-1 text-sm text-navy-800">{card.deck}</p>
          <p className="mt-5 text-sm text-navy-700">
            {format.dateTime(new Date(card.published), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            {t("readingTime", { minutes: card.readingMinutes })}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
