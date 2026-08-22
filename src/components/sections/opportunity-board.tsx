"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import {
  COUNTRY_ORDER,
  DEFAULT_FILTERS,
  EMPLOYMENT_ORDER,
  type Facet,
  type Filters,
  FUNCTION_ORDER,
  facetCounts,
  filterOpenings,
  isNew,
  LEVEL_ORDER,
  NO_FILTERS,
  type Opening,
  openingCopy,
} from "@/lib/jobs";

/** refs/dirA-job-board.png shows five listings and five pages. */
const PAGE_SIZE = 5;
/** The Function facet has seven options; the comp collapses after five. */
const FACET_PEEK = 5;

type Sort = "recent" | "oldest" | "title";

/**
 * The opportunities board — filter bar, results, and the refine rail.
 *
 * **Client-side over a server-fetched list, deliberately.** The whole set is
 * one small array today, so filtering in the browser is instant and the page
 * stays a single request. When the ATS lands and there are hundreds of
 * openings this moves behind the query — which is why the page passes
 * `openings` in rather than this component fetching them.
 *
 * **The selects and the rail are one filter state, not two.** The comp draws a
 * Location select in the bar *and* Location checkboxes in the rail. Two
 * independent controls over one dimension would fight each other, so the
 * select is a shortcut into the same set: picking "Mexico" checks Mexico, and
 * "All Locations" clears it.
 *
 * Filter state is local, not in the URL. A shared link to a filtered board is
 * worth having, but this layer gets rewritten against the ATS query; see
 * SOP Q-24 before adding it here.
 */
export function OpportunityBoard({
  openings,
  now,
}: {
  openings: Opening[];
  /** Request time, from the server, so relative dates don't rehydrate differently. */
  now: number;
}) {
  const t = useTranslations("subpage.opportunities");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<Sort>("recent");
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const matched = filterOpenings(openings, filters);
    if (sort === "title") {
      return [...matched].sort((a, b) => a.title.en.localeCompare(b.title.en));
    }
    if (sort === "oldest") return [...matched].reverse();
    return matched;
  }, [openings, filters, sort]);

  const counts = useMemo(
    () => facetCounts(openings, filters),
    [openings, filters],
  );

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /** Every filter change resets to page one — page 4 of a new result set is nowhere. */
  function update(next: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  }

  function toggle<T extends string>(facet: Facet, value: T) {
    const selected = filters[facet] as T[];
    update({
      [facet]: selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    } as Partial<Filters>);
  }

  /** A select is a one-of shortcut into the same set the checkboxes drive. */
  function choose(facet: Facet, value: string) {
    update({ [facet]: value ? [value] : [] } as Partial<Filters>);
  }

  const single = (facet: Facet) => {
    const selected = filters[facet];
    return selected.length === 1 ? (selected[0] as string) : "";
  };

  return (
    <>
      {/* ---------- filter bar ---------- */}
      {/* pulled up over the hero's lower edge, as the comp sets it. The lift
          lives on this wrapper rather than the form: a negative top margin on
          a first child collapses out to its parent, which moved the whole
          cream block up instead and left the bar sitting flush. */}
      <div className="relative z-10 -mt-16 mx-auto w-full max-w-page px-6 sm:px-10">
        <div>
          <form
            className="grid gap-4 border border-cream-100 bg-white-warm p-6 shadow-[0_10px_30px_-18px_rgba(6,30,57,.4)] lg:grid-cols-[minmax(0,1.9fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end lg:gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <Field label={t("searchLabel")}>
              {(id) => (
                <div className="relative">
                  <input
                    id={id}
                    type="search"
                    value={filters.q}
                    onChange={(event) => update({ q: event.target.value })}
                    placeholder={t("searchPlaceholder")}
                    className="h-12 w-full border border-cream-200 bg-white-warm pl-4 pr-11 text-base text-navy-900 placeholder:text-navy-700/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
                  />
                  <Icons.search className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-700/60" />
                </div>
              )}
            </Field>

            <Field label={t("locationLabel")}>
              {(id) => (
                <Select
                  id={id}
                  value={single("country")}
                  onChange={(value) => choose("country", value)}
                  placeholder={t("allLocations")}
                  options={COUNTRY_ORDER.map((value) => ({
                    value,
                    label: t(`country.${value}`),
                  }))}
                />
              )}
            </Field>

            <Field label={t("functionLabel")}>
              {(id) => (
                <Select
                  id={id}
                  value={single("fn")}
                  onChange={(value) => choose("fn", value)}
                  placeholder={t("allFunctions")}
                  options={FUNCTION_ORDER.map((value) => ({
                    value,
                    label: t(`fn.${value}`),
                  }))}
                />
              )}
            </Field>

            <Field label={t("levelLabel")}>
              {(id) => (
                <Select
                  id={id}
                  value={single("level")}
                  onChange={(value) => choose("level", value)}
                  placeholder={t("allLevels")}
                  options={LEVEL_ORDER.map((value) => ({
                    value,
                    label: t(`level.${value}`),
                  }))}
                />
              )}
            </Field>

            {/* results are already live as you type; the button is here because
                the comp has it and because a form without one reads unfinished */}
            <div className="flex flex-col items-stretch gap-2">
              <button
                type="submit"
                className="h-12 bg-teal-900 px-6 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-cream-50 transition-colors duration-200 hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
              >
                {t("searchButton")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters(NO_FILTERS);
                  setPage(1);
                }}
                className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
              >
                {t("clearFilters")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ---------- results + rail ---------- */}
      <section className="bg-cream-50 pb-16 pt-12 lg:pb-24">
        <div className="mx-auto grid w-full max-w-page gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-navy-800">
                {t("showing", { count: results.length })}
              </p>
              <div className="flex items-center gap-3 text-sm text-navy-800">
                <span className="hidden sm:inline">{t("sortBy")}</span>
                <Select
                  label={t("sortBy")}
                  value={sort}
                  onChange={(value) => setSort(value as Sort)}
                  options={[
                    { value: "recent", label: t("sortRecent") },
                    { value: "oldest", label: t("sortOldest") },
                    { value: "title", label: t("sortTitle") },
                  ]}
                />
              </div>
            </div>

            {shown.length === 0 ? (
              <div className="mt-6 border border-cream-100 bg-white-warm p-10 text-center">
                <Icons.compass className="mx-auto h-9 w-9 text-brass-500" />
                <h2 className="mt-4 font-display text-display-sm font-semibold text-navy-900">
                  {t("noMatchHeading")}
                </h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-sm text-navy-800">
                  {t("noMatchBody")}
                </p>
              </div>
            ) : (
              <ul className="mt-6 flex flex-col gap-5">
                {shown.map((opening) => (
                  <OpeningCard key={opening.id} opening={opening} now={now} />
                ))}
              </ul>
            )}

            {pages > 1 && (
              <Pagination
                current={current}
                pages={pages}
                onChange={setPage}
                labels={{
                  nav: t("pagination"),
                  previous: t("previousPage"),
                  next: t("nextPage"),
                  page: (n) => t("goToPage", { page: n }),
                }}
              />
            )}
          </div>

          {/* ---- rail ---- */}
          <aside className="flex flex-col gap-6">
            <div className="border border-cream-100 bg-white-warm p-7">
              <h2 className="font-display text-display-sm font-semibold text-navy-900">
                {t("alertsHeading")}
              </h2>
              <span
                aria-hidden="true"
                className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal-900/10 text-teal-900"
              >
                <Icons.mail className="h-6 w-6" />
              </span>
              <p className="mt-5 text-sm text-navy-800">{t("alertsBody")}</p>
              <a
                href="/for-candidates/talent-network"
                className="mt-6 block border border-teal-900 py-3 text-center font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900 transition-colors duration-200 hover:bg-teal-900 hover:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
              >
                {t("alertsCta")}
              </a>
            </div>

            <div className="border border-cream-100 bg-white-warm p-7">
              <h2 className="font-display text-display-sm font-semibold text-navy-900">
                {t("refineHeading")}
              </h2>
              <div aria-hidden="true" className="mt-4 h-px bg-cream-100" />

              <FacetGroup
                legend={t("facetEmployment")}
                options={EMPLOYMENT_ORDER.map((value) => ({
                  value,
                  label: t(`employment.${value}`),
                  count: counts.employment[value] ?? 0,
                }))}
                selected={filters.employment}
                onToggle={(value) => toggle("employment", value)}
              />
              <FacetGroup
                legend={t("facetCountry")}
                options={COUNTRY_ORDER.map((value) => ({
                  value,
                  label: t(`country.${value}`),
                  count: counts.country[value] ?? 0,
                }))}
                selected={filters.country}
                onToggle={(value) => toggle("country", value)}
              />
              <FacetGroup
                legend={t("facetFn")}
                options={FUNCTION_ORDER.map((value) => ({
                  value,
                  label: t(`fn.${value}`),
                  count: counts.fn[value] ?? 0,
                }))}
                selected={filters.fn}
                onToggle={(value) => toggle("fn", value)}
                more={{
                  peek: FACET_PEEK,
                  more: t("showMore"),
                  less: t("showLess"),
                }}
              />
              <FacetGroup
                legend={t("facetLevel")}
                options={LEVEL_ORDER.map((value) => ({
                  value,
                  label: t(`level.${value}`),
                  count: counts.level[value] ?? 0,
                }))}
                selected={filters.level}
                onToggle={(value) => toggle("level", value)}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * A labelled control. `children` is a render prop taking the generated id so
 * the association is an explicit `htmlFor`/`id` pair rather than relying on
 * the control being nested — which is also what a screen reader reports most
 * predictably when the control is a `select` inside other markup.
 */
function Field({
  label,
  children,
}: {
  label: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-navy-800">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  /** The "All …" row. Omitted when every option is a real choice. */
  placeholder?: string;
  /** Accessible name when the select has no visible `<label>` — the sort control. */
  label?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none border border-cream-200 bg-white-warm pl-4 pr-10 text-base text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icons.chevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-700" />
    </div>
  );
}

function FacetGroup({
  legend,
  options,
  selected,
  onToggle,
  more,
}: {
  legend: string;
  options: { value: string; label: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
  more?: { peek: number; more: string; less: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = more && !expanded ? options.slice(0, more.peek) : options;

  return (
    <fieldset className="mt-6 border-b border-cream-100 pb-6 last:border-b-0 last:pb-0">
      <legend className="text-sm font-semibold text-navy-900">{legend}</legend>
      <ul className="mt-3 flex flex-col gap-2.5">
        {visible.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-navy-800">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option.value)}
                  className="checkbox focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
                />
                {option.label} ({option.count})
              </label>
            </li>
          );
        })}
      </ul>
      {more && options.length > more.peek && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 pl-7 text-sm text-teal-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
        >
          {expanded ? more.less : more.more}
        </button>
      )}
    </fieldset>
  );
}

function OpeningCard({ opening, now }: { opening: Opening; now: number }) {
  const t = useTranslations("subpage.opportunities");
  const copy = openingCopy(opening, useLocale());

  // the comp says "Posted 2 days ago", then "Posted 1 week ago" — the unit is
  // chosen here rather than by the formatter, which renders 7 days as "last
  // week". Two plural messages rather than one formatted string, because
  // Spanish puts the whole phrase in a different order.
  const days = Math.max(
    1,
    Math.round((now - Date.parse(opening.postedAt)) / 86_400_000),
  );
  const posted =
    days < 7
      ? t("postedDays", { count: days })
      : t("postedWeeks", { count: Math.round(days / 7) });

  return (
    <li className="group relative border border-cream-100 bg-white-warm p-6 transition-shadow duration-300 hover:shadow-[0_10px_28px_-14px_rgba(6,30,57,.3)] motion-reduce:transition-none">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <h3 className="flex flex-wrap items-center gap-3 font-display text-display-sm font-semibold text-teal-900">
          <a
            href={`/for-candidates/opportunities/${opening.slug}`}
            className="transition-colors after:absolute after:inset-0 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none"
          >
            {copy.title}
          </a>
          {isNew(opening, now) && (
            <span className="rounded-sm bg-teal-900/10 px-2 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-teal-900">
              {t("isNew")}
            </span>
          )}
        </h3>
        <p className="text-sm text-navy-700">{posted}</p>
      </div>

      <p className="mt-2 text-base text-navy-900">
        <span className="font-semibold">{copy.company}</span>
        <Dot />
        {copy.location}
        {opening.workMode !== "onsite" &&
          ` (${t(`workMode.${opening.workMode}`)})`}
      </p>

      <p className="mt-2 flex flex-wrap items-center text-sm text-navy-700">
        <Icons.briefcase className="mr-2 h-4 w-4 shrink-0" />
        {t(`employment.${opening.employment}`)}
        <Dot />
        {t(`level.${opening.level}`)}
        <Dot />
        {t(`fn.${opening.fn}`)}
      </p>

      <div className="mt-4 flex flex-col items-start justify-between gap-x-8 gap-y-3 sm:flex-row sm:items-end">
        <p className="min-w-0 flex-1 text-base text-navy-800">{copy.summary}</p>
        <span className="flex items-center gap-2 whitespace-nowrap font-sans text-xs font-semibold uppercase tracking-[0.12em] text-teal-900">
          {t("viewDetails")}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            &rarr;
          </span>
        </span>
      </div>
    </li>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="mx-2 text-navy-700/50">
      &middot;
    </span>
  );
}

function Pagination({
  current,
  pages,
  onChange,
  labels,
}: {
  current: number;
  pages: number;
  onChange: (page: number) => void;
  labels: {
    nav: string;
    previous: string;
    next: string;
    page: (page: number) => string;
  };
}) {
  // first, last, and the pages either side of the current one; a gap elsewhere
  const window = new Set([1, pages, current, current - 1, current + 1]);
  const items: (number | "gap")[] = [];
  for (let page = 1; page <= pages; page++) {
    if (window.has(page)) items.push(page);
    else if (items.at(-1) !== "gap") items.push("gap");
  }

  const step =
    "flex h-10 min-w-10 items-center justify-center border border-cream-200 bg-white-warm px-3 text-sm text-navy-900 transition-colors duration-150 hover:border-teal-900 disabled:opacity-40 disabled:hover:border-cream-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500 motion-reduce:transition-none";

  return (
    <nav aria-label={labels.nav} className="mt-8 flex justify-center gap-2">
      <button
        type="button"
        className={step}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label={labels.previous}
      >
        &lsaquo;
      </button>
      {items.map((item, i) =>
        item === "gap" ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no identity beyond position
            key={`gap-${i}`}
            aria-hidden="true"
            className="flex h-10 min-w-10 items-center justify-center text-sm text-navy-700"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn(
              step,
              item === current && "border-navy-900 bg-navy-900 text-cream-50",
            )}
            onClick={() => onChange(item)}
            aria-label={labels.page(item)}
            aria-current={item === current ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className={step}
        onClick={() => onChange(current + 1)}
        disabled={current === pages}
        aria-label={labels.next}
      >
        &rsaquo;
      </button>
    </nav>
  );
}
