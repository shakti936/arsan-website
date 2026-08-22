import type { SchemaTypeDefinition } from "sanity";
import { copyTypes } from "./copy";
import { article } from "./documents/article";
import { caseStudy } from "./documents/case-study";
import { testimonial } from "./documents/testimonial";
import { cta } from "./objects/cta";
import { destination } from "./objects/destination";
import {
  localizedArticleBody,
  localizedHeading,
  localizedRichText,
  localizedString,
  localizedText,
} from "./objects/localized";
import { media } from "./objects/media";
import { seo } from "./objects/seo";

/**
 * Every type the Studio knows about.
 *
 * There is no `block` type with free styles, no HTML embed, no colour field
 * and no CSS anywhere in this list. That is the point: the design system is
 * not something this schema can express, so it is not something an editor can
 * damage. Content is theirs; presentation is the components'.
 *
 * The `page` document and its section catalogue were removed (D-096). They
 * modelled a page as a composable list of sections, and page copy is an
 * override layer over the message catalogue instead — so they offered a second
 * way to edit a page that rendered nothing.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // page copy — one document per message namespace, generated from the
  // catalogue by `bun run generate:copy`
  ...copyTypes,
  // documents
  article,
  caseStudy,
  testimonial,
  // shared objects
  localizedString,
  localizedHeading,
  localizedText,
  localizedRichText,
  localizedArticleBody,
  destination,
  cta,
  media,
  seo,
];
