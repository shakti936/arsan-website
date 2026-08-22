import type { StructureResolver } from "sanity/structure";
import { COPY_PAGES } from "./schema/copy/namespaces";

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
 *   - **Page copy** under a divider: every page's words, one entry per page.
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

      /**
       * Page copy. One entry per page, each a single document — an editor
       * clicks the page they mean and edits its words, which is the mental
       * model they already have. Generated types, so this list cannot drift
       * from the schema.
       *
       * `documentTypeList(...).showIcons(false)` is not used: each of these is
       * effectively a singleton, so the child goes straight to the document
       * rather than to a list containing one row.
       */
      /**
       * The words on the site, in the three piles an editor actually thinks
       * in: the page in front of them, the block that repeats across pages,
       * and the whole site. One flat list of 41 rows named after code
       * namespaces was a listing of the schema, not of the work.
       *
       * Each entry is effectively a singleton, so the child goes straight to
       * the document rather than to a list holding one row.
       */
      ...["Pages", "Repeated blocks", "Whole site"].map((group) =>
        S.listItem()
          .title(group)
          .child(
            S.list()
              .title(group)
              .items(
                COPY_PAGES.filter((page) => page.group === group).map((page) =>
                  S.documentTypeListItem(page.type).title(page.label),
                ),
              ),
          ),
      ),
    ]);
