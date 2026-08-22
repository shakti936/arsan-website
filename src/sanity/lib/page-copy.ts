import { draftMode } from "next/headers";
import { COPY_NAMESPACES } from "../schema/copy/namespaces";
import { client } from "./client";

/**
 * Page copy authored in the Studio, merged over the message catalogues.
 *
 * **Why an override layer rather than moving the copy into Sanity outright.**
 * Every page on this site was built against a Direction A comp, and its copy
 * is delivered by ~30 components that each call `useTranslations(namespace)`.
 * Rebuilding those pages as generic section renderers would make the layout
 * editable — which nobody asked for — at the cost of the fidelity the whole
 * build has been about. Merging over `messages/*.json` instead makes every
 * string on every page editable and changes **no component at all**.
 *
 * The JSON stays the structural source of truth: it defines which keys exist,
 * it is what `validate-messages.mjs` checks, and it is the fallback for every
 * key nobody has overridden. Sanity supplies values, not shape.
 *
 * Returns `{}` on any failure. A CMS that is slow, down, or mid-deploy must
 * not take the site's copy with it — the catalogue alone renders a complete,
 * correct page, which is the whole reason this is a merge and not a move.
 */

type Tree = { [key: string]: unknown };

const TYPES = Object.keys(COPY_NAMESPACES);

const QUERY = /* groq */ `*[_type in $types]{ _type, "values": copy }`;

type Row = { _type: string; values: Tree | null };

/** Deep-merges `over` onto `base` without mutating either. Arrays are replaced
 *  wholesale: a partially overridden array of cards is a broken card. */
export function mergeCopy<T extends Tree>(base: T, over: Tree): T {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(over)) {
    if (value === null || value === undefined || value === "") continue;
    const existing = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      out[key] = mergeCopy(existing as Tree, value as Tree);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

/**
 * `_key` and `_type` are Sanity bookkeeping on array members and objects. They
 * would land in the message tree as extra keys, which next-intl would happily
 * hand to a component expecting a string.
 */
function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Tree)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => [k, strip(v)]),
    );
  }
  return value;
}

/**
 * `draftMode()` requires a request scope. `getRequestConfig` also runs during
 * static generation, where there is no request and reading it throws — so a
 * throw here means "this is a build, not a preview", which is exactly false.
 */
async function isDraftRequest(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

export async function pageCopyOverrides(locale: string): Promise<Tree> {
  try {
    /**
     * Click-to-edit depends on this flag.
     *
     * Stega encodes an invisible pointer back to the source field into every
     * string it returns, and that pointer is what lets the Presentation
     * overlay know that this headline is `copyHome.copy.en.hero.subhead` and
     * open it for editing. Plain `client.fetch` does not know a request is a
     * preview, so without passing it explicitly the copy arrives unencoded and
     * every string on the page is inert — the overlays simply never appear.
     *
     * Outside draft mode this is `false` and published HTML is byte-identical
     * to what it was before visual editing existed.
     */
    const isDraft = await isDraftRequest();

    const rows = await client.fetch<Row[]>(
      QUERY,
      { types: TYPES },
      {
        stega: isDraft,
        perspective: isDraft ? "drafts" : "published",
        useCdn: !isDraft,
        ...(isDraft
          ? {
              token: process.env.SANITY_API_READ_TOKEN,
              next: { revalidate: 0 },
            }
          : { next: { revalidate: 60, tags: ["pageCopy"] } }),
      },
    );
    const tree: Tree = {};
    for (const row of rows ?? []) {
      const namespace = COPY_NAMESPACES[row._type];
      if (!namespace || !row.values) continue;
      // a dotted path — "subpage.whyArsan" nests two deep
      const path = namespace.split(".");
      let cursor = tree;
      for (const segment of path.slice(0, -1)) {
        cursor[segment] ??= {};
        cursor = cursor[segment] as Tree;
      }
      const leaf = path.at(-1) as string;
      const localised = (row.values as Tree)[locale] ?? (row.values as Tree).en;
      cursor[leaf] = mergeCopy(
        (cursor[leaf] as Tree) ?? {},
        (strip(localised) as Tree) ?? {},
      );
    }
    return tree;
  } catch {
    // never let the CMS take the site's copy down with it
    return {};
  }
}
