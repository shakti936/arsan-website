import type { SchemaTypeDefinition } from "sanity";
import { article } from "./documents/article";
import { caseStudy } from "./documents/case-study";
import { page } from "./documents/page";
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
import {
  cardsSection,
  ctaSection,
  mediaSection,
  quoteSection,
  richTextSection,
} from "./objects/sections";
import { seo } from "./objects/seo";

/**
 * Every type the Studio knows about.
 *
 * There is no `block` type with free styles, no HTML embed, no colour field
 * and no CSS anywhere in this list. That is the point: the design system is
 * not something this schema can express, so it is not something an editor can
 * damage. Content is theirs; presentation is the components'.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  page,
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
  // section catalogue
  richTextSection,
  mediaSection,
  cardsSection,
  quoteSection,
  ctaSection,
];
