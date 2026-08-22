import { defineQuery } from "next-sanity";

/**
 * GROQ, written once and shared.
 *
 * Three rules hold across all of them:
 *
 *   1. **The locale is resolved in the query**, via `coalesce(x[$locale], x.en)`.
 *      Fetching both languages and picking in TypeScript works, but it doubles
 *      every payload and puts the fallback rule in two places. English is the
 *      fallback because a missing translation should be *visible*, not blank.
 *   2. **Links are resolved to hrefs here**, not in the renderer. A `destination`
 *      is four shapes (a route, an article ref, a case-study ref, a URL) and a
 *      component that has to branch on all four is a component every renderer
 *      has to re-implement. GROQ can follow the reference; JSX cannot.
 *   3. **`approved` is filtered in the QUERY.** An unapproved testimonial must
 *      not reach the client at all — a component that filters is one someone can
 *      forget to use, and the words would still sit in the page's JSON payload.
 */

/** Collapses a `destination` object into the one string a link needs. */
const HREF = /* groq */ `"href": select(
  destination.kind == "page"      => destination.page + select(defined(destination.anchor) => "#" + destination.anchor, ""),
  destination.kind == "article"   => "/insights/" + destination.article->slug.current,
  destination.kind == "caseStudy" => "/results/" + destination.caseStudy->slug.current,
  destination.kind == "external"  => destination.url,
  null
)`;

const IMAGE = /* groq */ `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": coalesce(alt[$locale], alt.en)
}`;

/** Portable Text with its link annotations already turned into hrefs. */
const BODY = (
  field: string,
) => /* groq */ `coalesce(${field}[$locale], ${field}.en)[]{
  ...,
  markDefs[]{ ..., _type == "internalLink" => { ${HREF} } }
}`;

const ARTICLE_CARD = /* groq */ `
  "slug": slug.current,
  "characters": length(pt::text(coalesce(body[$locale], body.en))),
  categoryKey,
  published,
  featured,
  "title": coalesce(title[$locale], title.en),
  "deck": coalesce(deck[$locale], deck.en),
  "image": image${IMAGE}
`;

export const articleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

export const articleIndexQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(published desc){ ${ARTICLE_CARD} }
`);

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    ${ARTICLE_CARD},
    "body": ${BODY("body")},
    "pullQuote": coalesce(pullQuote[$locale], pullQuote.en),
    "pullQuoteBy": coalesce(pullQuoteBy[$locale], pullQuoteBy.en),
    "pullQuoteOrg": coalesce(pullQuoteOrg[$locale], pullQuoteOrg.en),
    "stat": stat{ figure, source, "body": coalesce(body[$locale], body.en) },
    "asideHeading": coalesce(asideHeading[$locale], asideHeading.en),
    "asideItems": asideItems[]{ "value": coalesce(@[$locale], @.en) }.value,
    "takeawaysHeading": coalesce(takeawaysHeading[$locale], takeawaysHeading.en),
    "takeaways": takeaways[]{
      icon,
      "title": coalesce(title[$locale], title.en),
      "body": coalesce(body[$locale], body.en)
    },
    "seo": seo{
      "title": coalesce(title[$locale], title.en),
      "description": coalesce(description[$locale], description.en),
      "ogImage": ogImage${IMAGE}
    }
  }
`);

/** Approved only — see rule 3 above. */
export const testimonialsQuery = defineQuery(`
  *[_type == "testimonial" && approved == true]{
    clientName,
    "quote": coalesce(quote[$locale], quote.en),
    "role": coalesce(role[$locale], role.en),
    "org": coalesce(org[$locale], org.en)
  }
`);
