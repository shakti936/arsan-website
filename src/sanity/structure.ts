import type { StructureResolver } from "sanity/structure";

/**
 * The Studio's left-hand navigation.
 *
 * The default is one row per document type, alphabetical, which is a listing
 * of the schema rather than of the work. This is organised the way the content
 * actually behaves:
 *
 *   - **Articles** newest first, because that is the order they are worked on
 *     and the order the site shows them.
 *   - **Testimonials split by approval.** Every quote on this site was
 *     reproduced from a comp and none has been approved by a client
 *     (D-071, Q-23); unapproved ones are filtered out of the GROQ, so they are
 *     in the CMS and invisible on the site. Without this split that is a
 *     silent state — a row that looks published and is not. "Awaiting
 *     approval" is a to-do list with a real consequence at the end of it.
 *   - **Pages last**, because they are the least-touched type.
 *
 * `S.documentTypeListItem` is used where the default is right; only the two
 * lists that need an order or a filter are spelled out.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Articles")
        .schemaType("article")
        .child(
          S.documentTypeList("article")
            .title("Articles")
            .defaultOrdering([{ field: "published", direction: "desc" }]),
        ),

      S.documentTypeListItem("caseStudy").title("Case studies"),

      S.listItem()
        .title("Testimonials")
        .child(
          S.list()
            .title("Testimonials")
            .items([
              S.listItem()
                .title("Awaiting approval")
                .child(
                  S.documentList()
                    .title("Awaiting approval")
                    .schemaType("testimonial")
                    .filter('_type == "testimonial" && approved != true')
                    .initialValueTemplates([]),
                ),
              S.listItem()
                .title("Approved — live on the site")
                .child(
                  S.documentList()
                    .title("Approved")
                    .schemaType("testimonial")
                    .filter('_type == "testimonial" && approved == true')
                    .initialValueTemplates([]),
                ),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("page").title("Pages"),
    ]);
