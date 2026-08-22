#!/usr/bin/env bun
/**
 * Pushes the English and Spanish message catalogues into Sanity as page-copy
 * documents.
 *
 *   bun run seed:copy            # create what's missing, never overwrite
 *   bun run seed:copy --dry-run  # report only
 *
 * **Why the catalogue has to be IN Sanity, not just overridable by it.**
 * Click-to-edit works by stega: every string Sanity returns carries an
 * invisible pointer back to the field that produced it, and the Presentation
 * overlay turns those pointers into clickable regions. A string still coming
 * from `messages/en.json` has no pointer, so it is inert — the editor sees a
 * page where some paragraphs are editable and others silently are not. Seeding
 * every string makes the whole page editable and leaves the JSON as what it
 * should be: the fallback that renders a correct site when the CMS is
 * unreachable.
 *
 * **Never overwrites.** Documents that exist are patched with `setIfMissing`
 * for keys added to the catalogue since the last run, so a re-run after
 * someone has edited copy in the Studio cannot clobber their work.
 */
import { createClient } from "next-sanity";
import en from "../messages/en.json";
import es from "../messages/es.json";
import {
  flattenStrings,
  hash,
  type TranslationState,
} from "../src/sanity/lib/translation-state";
import { COPY_NAMESPACES } from "../src/sanity/schema/copy/namespaces";

const DRY = process.argv.includes("--dry-run");
/**
 * Emit NDJSON on stdout instead of writing, so the seed can be run through the
 * Sanity CLI on a developer's own login:
 *
 *   bun run seed:copy --ndjson > copy.ndjson
 *   bunx sanity documents create --missing copy.ndjson
 *
 * That path needs no write token at all. The client path below is the one to
 * use from CI, where there is no interactive login to borrow.
 */
const NDJSON = process.argv.includes("--ndjson");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset)
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET are required");
if (!token && !DRY && !NDJSON) {
  throw new Error(
    "SANITY_API_WRITE_TOKEN is required to write (or pass --dry-run / --ndjson)",
  );
}

/** Mirrors the generator: Sanity field names cannot contain hyphens, and the
 *  keys that do are enum codes, not editorial copy. */
const VALID_FIELD = /^[A-Za-z]+[0-9A-Za-z_]*$/;

type Tree = { [key: string]: unknown };

function at(tree: Tree, dotted: string): Tree | undefined {
  let cursor: unknown = tree;
  for (const segment of dotted.split(".")) {
    if (!cursor || typeof cursor !== "object") return undefined;
    cursor = (cursor as Tree)[segment];
  }
  return cursor && typeof cursor === "object" && !Array.isArray(cursor)
    ? (cursor as Tree)
    : undefined;
}

/** Array members need a `_key`. Deterministic by index so a re-seed does not
 *  churn every array in the dataset. */
function sanitise(value: unknown, path: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      item && typeof item === "object"
        ? { _key: `k${i}`, ...(sanitise(item, `${path}[${i}]`) as Tree) }
        : item,
    );
  }
  if (value && typeof value === "object") {
    const out: Tree = {};
    for (const [k, v] of Object.entries(value as Tree)) {
      if (!VALID_FIELD.test(k)) continue;
      out[k] = sanitise(v, `${path}.${k}`);
    }
    return out;
  }
  return value;
}

/** Leaf paths for `setIfMissing`. An array counts as one leaf: a partially
 *  filled array of cards is a broken card, same rule the merge uses. */
function leaves(tree: Tree, prefix: string, out: Record<string, unknown>) {
  for (const [k, v] of Object.entries(tree)) {
    const path = `${prefix}.${k}`;
    if (v && typeof v === "object" && !Array.isArray(v))
      leaves(v as Tree, path, out);
    else out[path] = v;
  }
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-19",
  token,
  useCdn: false,
});

const ids = Object.keys(COPY_NAMESPACES);
const existing =
  DRY || NDJSON
    ? new Set<string>()
    : new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }));

let created = 0;
let patched = 0;
const tx = client.transaction();

for (const [typeName, namespace] of Object.entries(COPY_NAMESPACES)) {
  const enTree = at(en as Tree, namespace);
  if (!enTree) {
    console.error(`  ! ${namespace} missing from messages/en.json — skipped`);
    continue;
  }
  const copy = {
    en: sanitise(enTree, namespace) as Tree,
    es: (sanitise(at(es as Tree, namespace) ?? {}, namespace) as Tree) ?? {},
  };

  /**
   * Record the catalogue pairing as if the machine had produced it.
   *
   * Without this, every seeded Spanish string looks hand-written to the
   * Translate action, which would protect it forever — correct for the
   * professional Spanish already in `messages/es.json`, but it would also mean
   * that editing an English string never refreshes its Spanish. Recording the
   * pair here makes both behaviours right: edit the English and the Spanish
   * regenerates; edit the Spanish and it becomes permanently yours.
   */
  const enFlat = flattenStrings(copy.en);
  const esFlat = flattenStrings(copy.es);
  const state: TranslationState = {};
  for (const [path, english] of Object.entries(enFlat)) {
    const spanish = esFlat[path];
    if (spanish) state[path] = { src: hash(english), out: hash(spanish) };
  }
  const translationState = JSON.stringify(state);

  if (!existing.has(typeName)) {
    const doc = {
      _id: typeName,
      _type: typeName,
      namespace,
      copy,
      translationState,
    };
    if (NDJSON) process.stdout.write(`${JSON.stringify(doc)}\n`);
    else tx.createIfNotExists(doc);
    created++;
  } else if (NDJSON) {
    // `documents create --missing` skips documents that already exist
  } else {
    const flat: Record<string, unknown> = { translationState };
    leaves(copy as unknown as Tree, "copy", flat);
    tx.patch(typeName, (p) => p.setIfMissing(flat));
    patched++;
  }
}

if (NDJSON) {
  console.error(`ndjson — ${created} documents on stdout`);
} else if (DRY) {
  console.log(`dry run — would create ${created}, backfill ${patched}`);
} else {
  await tx.commit({ visibility: "async" });
  console.log(`✓ seeded page copy — created ${created}, backfilled ${patched}`);
}
