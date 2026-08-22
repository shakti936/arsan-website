#!/usr/bin/env bun
/**
 * Pushes content that still lives in `src/content/**` into the Sanity dataset,
 * as NDJSON for `sanity datasets import`.
 *
 *   bun run seed:sanity > seed.ndjson
 *   bunx sanity datasets import seed.ndjson -d production -p shop59xi --replace
 *
 * Import rather than the JS client because the CLI is already authenticated —
 * no write token has to be minted, stored or leaked to seed a dataset.
 *
 * **Articles are no longer here, and must not come back.** They were seeded
 * from `src/content/insights/` (D-091), those modules are deleted, and Sanity
 * is their source of truth (D-092). Re-seeding an article would overwrite
 * whatever an editor last wrote with a snapshot from a git history — the
 * backup mechanism for CMS-owned content is `sanity dataset export`, not a
 * script that regenerates it from code.
 *
 * What is left is the content whose READ path has not moved yet: case studies
 * and the testimonials they carry. Re-running this is safe for them, because
 * nothing reads them from Sanity, so nothing has been edited there.
 */
import { CASE_STUDIES } from "@/content/case-studies";

type Json = Record<string, unknown>;

let keySeq = 0;
const key = () => `k${(keySeq++).toString(36)}`;

/** An image the importer uploads from disk and swaps for a real asset ref.
 *  Absolute, because a relative path resolves against the NDJSON file. */
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
const quoted = new Set<string>();
for (const study of CASE_STUDIES) {
  // `quote` is optional on CaseStudyCopy — a confidential engagement that
  // cannot be quoted is exactly the case it was made optional for
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

// ── case studies ───────────────────────────────────────────────────────────
for (const study of CASE_STUDIES) {
  docs.push({
    _id: `caseStudy-${study.slug}`,
    _type: "caseStudy",
    _key: key(),
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
console.error(
  `→ ${docs.length} documents (case studies + testimonials; articles are CMS-owned)`,
);
