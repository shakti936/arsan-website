/**
 * The icon vocabulary, as data.
 *
 * Split out of `icons.tsx` so the Sanity schema can offer these as a dropdown
 * without importing a module full of React components — the Studio would pull
 * all of lucide into its bundle to render a `<select>`.
 *
 * `icons.tsx` types its map as `Record<IconName, …>`, so this list and the
 * actual set of drawable icons cannot drift: a name here with no icon fails to
 * compile, and an icon with no name here has nowhere to go.
 *
 * Letting an editor pick an icon is a content decision, not a design one —
 * which glyph represents "we understand manufacturing environments" is about
 * meaning. What they cannot do is supply one: it is a closed list of glyphs
 * the design system already draws, at a size and weight the component sets.
 */
export const ICON_NAMES = [
  "person",
  "users",
  "personStar",
  "factory",
  "building",
  "cog",
  "globe",
  "map",
  "handshake",
  "chat",
  "chart",
  "bars",
  "trend",
  "calendar",
  "check",
  "shield",
  "shieldPlain",
  "shieldLock",
  "lock",
  "hierarchy",
  "briefcase",
  "mail",
  "search",
  "chevronDown",
  "compass",
  "star",
  "puzzle",
  "target",
  "document",
  "clipboard",
  "book",
  "lightbulb",
  "award",
  "gear",
  "truck",
  "scale",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Title-cased for the Studio dropdown: `personStar` → "Person star". */
export const ICON_OPTIONS = ICON_NAMES.map((name) => ({
  value: name,
  title: name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
}));
