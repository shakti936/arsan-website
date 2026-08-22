import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The editorial type roles, as tailwind-merge needs to hear about them.
 *
 * tailwind-merge only knows Tailwind's BUILT-IN font-size scale. A custom
 * `text-*` size is indistinguishable to it from a `text-*` COLOUR, so
 * cn("text-heading", "text-navy-900") silently drops one of them — which is
 * how every section heading once rendered at inherited body size (SOP D-043),
 * and how the home hero H1 rendered navy-on-navy the day the roles were
 * renamed and this list was not (D-089).
 *
 * Exported because `scripts/validate-design-system.mjs` diffs it against the
 * `--text-*` tokens in globals.css: adding a token without adding it here
 * fails the build instead of failing silently in a component nobody reopens.
 */
export const TYPE_ROLES = [
  "headline",
  "title",
  "heading",
  "subheading",
  "figure",
  "lead",
  "badge",
  "quote",
  "quote-sm",
  "watermark",
  "watermark-sm",
  "watermark-lg",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: { "font-size": [{ text: [...TYPE_ROLES] }] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
