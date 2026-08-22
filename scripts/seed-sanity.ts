#!/usr/bin/env bun
/**
 * One-off: push the content that currently lives in `src/content/**` into the
 * Sanity dataset, as NDJSON for `sanity datasets import`.
 *
 *   bun scripts/seed-sanity.ts > seed.ndjson
 *   bunx sanity datasets import seed.ndjson -d production -p shop59xi --replace
 *
 * Import rather than the JS client because the CLI is already authenticated —
 * no write token has to be minted, stored or leaked to seed a dataset once.
 *
 * **Document ids are derived from slugs**, so this is idempotent: run it twice
 * with `--replace` and you get the same eight documents, not sixteen. That
 * matters more than it sounds — the first run is never the last one, because
 * the point of seeding is to find what the schema got wrong.
 *
 * **This is lossy in one place, on purpose.** `ArticleSection.steps` is a
 * numbered spine of title+body pairs and `checks` is a lead+body list; both
 * become Portable Text lists with the lead set in bold. The words all survive;
 * the structure does not. A generic body field cannot hold a bespoke one, and
 * inventing schema for a shape only four articles use would be building the
 * old model again inside the new one.
 */
import { CASE_STUDIES } from "@/content/case-studies";
import { ARTICLES } from "@/content/insights";
import type { ArticleCopy, ArticleSection } from "@/content/insights/types";
import { SITE_ROUTES } from "@/lib/routes";

type Json = Record<string, unknown>;

let keySeq = 0;
const key = () => `k${(keySeq++).toString(36)}`;

const ROUTES = new Set<string>(SITE_ROUTES.map((r) => r.path));

/** `[label](/path)` — the one inline construct the article model allows. */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = Json & { _key: string; _type: string };

/** Split prose into spans, lifting `[label](/path)` into link annotations. */
function spans(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  let at = 0;

  for (const match of text.matchAll(LINK)) {
    const [whole, label = "", href = ""] = match;
    const start = match.index ?? 0;
    if (start > at) {
      children.push({
        _type: "span",
        _key: key(),
        text: text.slice(at, start),
        marks: [],
      });
    }
    const destination = resolveHref(href);
    if (destination) {
      const markKey = key();
      markDefs.push({ _key: markKey, _type: "internalLink", destination });
      children.push({
        _type: "span",
        _key: key(),
        text: label,
        marks: [markKey],
      });
    } else {
      // an href the schema cannot express becomes plain text rather than a
      // broken annotation — reported at the end, not swallowed
      unresolved.add(href);
      children.push({ _type: "span", _key: key(), text: label, marks: [] });
    }
    at = start + whole.length;
  }
  if (at < text.length) {
    children.push({
      _type: "span",
      _key: key(),
      text: text.slice(at),
      marks: [],
    });
  }
  return {
    children: children.length
      ? children
      : [{ _type: "span", _key: key(), text: "", marks: [] }],
    markDefs,
  };
}

const unresolved = new Set<string>();

/** A path in the article prose → the `destination` object the schema wants. */
function resolveHref(href: string): Json | null {
  const [path = "", hash] = href.split("#");
  if (ROUTES.has(path)) {
    return {
      _type: "destination",
      kind: "page",
      page: path,
      ...(hash ? { anchor: hash } : {}),
    };
  }
  const article = path.match(/^\/insights\/([a-z0-9-]+)$/);
  if (article?.[1] && ARTICLES.some((a) => a.slug === article[1])) {
    return {
      _type: "destination",
      kind: "article",
      article: { _type: "reference", _ref: `article-${article[1]}` },
    };
  }
  const study = path.match(/^\/results\/([a-z0-9-]+)$/);
  if (study?.[1] && CASE_STUDIES.some((c) => c.slug === study[1])) {
    return {
      _type: "destination",
      kind: "caseStudy",
      caseStudy: { _type: "reference", _ref: `caseStudy-${study[1]}` },
    };
  }
  return null;
}

function block(
  text: string,
  style = "normal",
  list?: { listItem: string },
): Json {
  const { children, markDefs } = spans(text);
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children,
    ...(list ? { ...list, level: 1 } : {}),
  };
}

/** A list item whose lead runs in bold, then the rest as normal prose. */
function leadItem(lead: string, body: string, listItem: string): Json {
  // some leads already end in a colon ("Cultural integration:"), others are a
  // bare phrase ("Strategic Vision with Commercial Acumen") that would run
  // straight into the sentence after it
  const joiner = /[.:;—-]$/.test(lead.trim()) ? " " : " — ";
  const rest = spans(`${joiner}${body}`);
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem,
    level: 1,
    markDefs: rest.markDefs,
    children: [
      { _type: "span", _key: key(), text: lead, marks: ["strong"] },
      ...rest.children,
    ],
  };
}

function articleBody(copy: ArticleCopy): Json[] {
  const out: Json[] = copy.lede.map((p) => block(p));
  for (const section of copy.sections as ArticleSection[]) {
    if (section.heading) out.push(block(section.heading, "h2"));
    for (const p of section.body ?? []) out.push(block(p));
    for (const step of section.steps ?? [])
      out.push(leadItem(step.title, step.body, "number"));
    for (const check of section.checks ?? [])
      out.push(leadItem(check.lead, check.body, "bullet"));
  }
  return out;
}

/**
 * An image the importer uploads from disk and swaps for a real asset ref.
 *
 * Absolute, because a relative `_sanityAsset` path resolves against the NDJSON
 * file rather than the project — and the NDJSON is a throwaway that belongs in
 * a temp directory, not next to `public/`.
 */
const image = (photo: string, altEn: string, altEs: string): Json => ({
  _type: "media",
  _sanityAsset: `image@file://${process.cwd()}/public/images/${photo}.jpg`,
  alt: { _type: "localizedString", en: altEn, es: altEs },
});

const str = (en: string, es: string) => ({ _type: "localizedString", en, es });
const heading = (en: string, es: string) => ({
  _type: "localizedHeading",
  en,
  es,
});
const text = (en: string, es: string) => ({ _type: "localizedText", en, es });

const docs: Json[] = [];

// ── testimonials ───────────────────────────────────────────────────────────
// All seeded `approved: false`. Every one was reproduced from a Direction A
// comp and no client has approved the words (D-071, Q-23); the GROQ filters
// unapproved quotes out, so they are visible in the Studio and nowhere else.
/** Studies that produced a testimonial, so the reference below cannot dangle. */
const quoted = new Set<string>();
for (const study of CASE_STUDIES) {
  // `quote` is optional on CaseStudyCopy — both studies happen to carry one
  // today, and a confidential engagement that cannot be quoted is exactly the
  // case the field was made optional for
  const en = study.en.quote;
  const es = study.es.quote;
  if (!en || !es) continue;
  quoted.add(study.slug);
  docs.push({
    _id: `testimonial-${study.slug}`,
    _type: "testimonial",
    quote: text(en.text, es.text),
    role: str(en.role, es.role),
    org: str(en.org, es.org),
    approved: false,
  });
}
docs.push({
  _id: "testimonial-results-page",
  _type: "testimonial",
  quote: text(
    "ARSAN delivered the leaders we needed to succeed. Their process is thorough, their people are exceptional, and their results speak for themselves.",
    "ARSAN entregó a los líderes que necesitábamos para tener éxito. Su proceso es riguroso, su gente es excepcional y sus resultados hablan por sí solos.",
  ),
  clientName: "Sharon Jones",
  role: str(
    "VP, Sales – Core Electrical Products",
    "VP de Ventas – Productos Eléctricos",
  ),
  org: str("Sigma Engineered Solutions", "Sigma Engineered Solutions"),
  approved: false,
});

// ── articles ───────────────────────────────────────────────────────────────
for (const article of ARTICLES) {
  docs.push({
    _id: `article-${article.slug}`,
    _type: "article",
    slug: { _type: "slug", current: article.slug },
    categoryKey: article.categoryKey,
    published: article.published,
    featured: false,
    title: heading(article.en.title, article.es.title),
    deck: text(article.en.deck, article.es.deck),
    image: image(article.photo, article.en.imageAlt, article.es.imageAlt),
    body: {
      _type: "localizedArticleBody",
      en: articleBody(article.en),
      es: articleBody(article.es),
    },
    seo: {
      _type: "seo",
      title: str(article.en.metaTitle, article.es.metaTitle),
      description: text(article.en.metaDescription, article.es.metaDescription),
    },
  });
}

// ── case studies ───────────────────────────────────────────────────────────
for (const study of CASE_STUDIES) {
  docs.push({
    _id: `caseStudy-${study.slug}`,
    _type: "caseStudy",
    slug: { _type: "slug", current: study.slug },
    confidential: study.variant === "confidential",
    title: heading(study.en.title, study.es.title),
    deck: text(study.en.deck, study.es.deck),
    image: image(study.photo, study.en.imageAlt, study.es.imageAlt),
    ...(quoted.has(study.slug)
      ? {
          testimonial: {
            _type: "reference",
            _ref: `testimonial-${study.slug}`,
          },
        }
      : {}),
    seo: {
      _type: "seo",
      title: str(study.en.metaTitle, study.es.metaTitle),
      description: text(study.en.metaDescription, study.es.metaDescription),
    },
  });
}

for (const doc of docs) process.stdout.write(`${JSON.stringify(doc)}\n`);

const counts = docs.reduce<Record<string, number>>((acc, d) => {
  const t = String(d._type);
  acc[t] = (acc[t] ?? 0) + 1;
  return acc;
}, {});
console.error(
  `→ ${docs.length} documents: ${Object.entries(counts)
    .map(([t, n]) => `${n} ${t}`)
    .join(", ")}`,
);
if (unresolved.size) {
  console.error(
    `→ hrefs left as plain text (no schema destination): ${[...unresolved].join(", ")}`,
  );
}
