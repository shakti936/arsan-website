import { defineQuery } from "next-sanity";

/**
 * GROQ, written once and shared.
 *
 * Two rules hold across all of them:
 *
 *   1. **Both languages are always fetched.** Filtering by locale in the query
 *      would mean a Spanish page that falls back to English needs a second
 *      round trip. The payloads are small; the fallback in `localize.ts` is
 *      cheaper than a query per language.
 *   2. **`approved` is filtered in the QUERY, not in the renderer.** An
 *      unapproved testimonial must not reach the client at all — a component
 *      that filters is a component someone can forget to use, and the words
 *      would still be sitting in the page's JSON payload. See D-071/Q-23:
 *      every testimonial on this site today is unverified.
 */

const CTA = /* groq */ `{
  label,
  destination {
    kind, page, anchor, url,
    "article": article->slug.current,
    "caseStudy": caseStudy->slug.current
  }
}`;

const IMAGE = /* groq */ `{ ..., "url": asset->url, "lqip": asset->metadata.lqip, alt }`;

const TESTIMONIAL = /* groq */ `{ quote, clientName, role, org }`;

export const pageQuery = defineQuery(`
  *[_type == "page" && route == $route][0]{
    route, title, emphasis, intro,
    "heroImage": heroImage${IMAGE},
    "primaryCta": primaryCta${CTA},
    "secondaryCta": secondaryCta${CTA},
    "sections": sections[!(hidden == true)]{
      _type, _key, heading, body,
      "image": image${IMAGE},
      "cta": cta${CTA},
      cards[]{ title, body, "cta": cta${CTA} },
      "testimonial": testimonial->{ ${TESTIMONIAL.slice(1, -1)}, approved }
    },
    seo { title, description, "ogImage": ogImage${IMAGE} }
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    "slug": slug.current, title, deck, categoryKey, published, featured,
    "image": image${IMAGE},
    body,
    seo { title, description, "ogImage": ogImage${IMAGE} }
  }
`);

export const articleIndexQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(published desc){
    "slug": slug.current, title, deck, categoryKey, published, featured,
    "image": image${IMAGE}
  }
`);

/** Approved only — see rule 2 above. */
export const testimonialsQuery = defineQuery(`
  *[_type == "testimonial" && approved == true]${TESTIMONIAL}
`);
