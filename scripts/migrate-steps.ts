#!/usr/bin/env bun
/**
 * One-off dataset migration: numbered list items → `steps` blocks.
 *
 *   bun scripts/migrate-steps.ts > steps.ndjson
 *   bunx sanity datasets import steps.ndjson -d production -p shop59xi --replace
 *
 * A **dataset-to-dataset** migration, not a re-seed from code. It reads what is
 * in Sanity now, transforms it, and writes it back — so it is safe to run
 * against content an editor has touched in every way except the paragraphs it
 * is rewriting, and it does not depend on `src/content/insights`, which no
 * longer exists.
 *
 * Why: the first migration flattened the article comps' numbered spine
 * ("five traits that separate high-performing leaders") into a plain numbered
 * list with the title run in bold. Rendered side by side, each step had lost
 * the serif subheading that made it a titled point. `steps` is a first-class
 * block now; this converts the existing five articles onto it.
 *
 * The parse is exact rather than clever, because it is undoing a transform this
 * repo performed: the seeder emitted one list item per step, with the title as
 * a single `strong` span followed by " — " (or ": ") and the body. Anything
 * that does not match that shape is left alone and reported.
 */
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";

type Span = { _type: string; text?: string; marks?: string[] };
type Block = {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: Span[];
};

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

let keySeq = 0;
const key = () => `m${(keySeq++).toString(36)}`;

const skipped: string[] = [];

/** `**Title** — body` → `{title, body}`, or null if it isn't that shape. */
function parseStep(block: Block, where: string) {
  const children = block.children ?? [];
  const [lead, ...rest] = children;
  const title = lead?.marks?.includes("strong") ? lead.text?.trim() : undefined;
  if (!title) {
    skipped.push(`${where}: list item has no bold lead`);
    return null;
  }
  const body = rest
    .map((span) => span.text ?? "")
    .join("")
    .replace(/^\s*(—|:)?\s*/, "")
    .trim();
  if (!body) {
    skipped.push(`${where}: "${title}" has no body`);
    return null;
  }
  return { _key: key(), _type: "step", title, body };
}

/** Collapses each run of numbered list items into one `steps` block. */
function convert(blocks: Block[], where: string): Block[] {
  const out: Block[] = [];
  let run: Block[] = [];

  const flush = () => {
    if (!run.length) return;
    const items = run.map((b, i) => parseStep(b, `${where}[${i}]`));
    // all or nothing: a partially parsed spine would silently drop a step
    if (items.every(Boolean)) {
      out.push({ _type: "steps", _key: key(), items } as unknown as Block);
    } else {
      out.push(...run);
    }
    run = [];
  };

  for (const block of blocks) {
    if (block._type === "block" && block.listItem === "number") run.push(block);
    else {
      flush();
      out.push(block);
    }
  }
  flush();
  return out;
}

/**
 * The WHOLE document, not a projection.
 *
 * `datasets import --replace` replaces a document outright — it does not merge.
 * Emitting `{_id, body}` would import an article whose title, slug, image,
 * takeaways and SEO had all been deleted. So each document is fetched
 * complete, its body swapped, and written back intact.
 */
type Article = Record<string, unknown> & {
  _id: string;
  slug?: { current?: string };
  body?: { en?: Block[]; es?: Block[] };
};

const articles = await client.fetch<Article[]>(`*[_type == "article"]`);

let changed = 0;
for (const article of articles) {
  const slug = article.slug?.current ?? article._id;
  const en = convert(article.body?.en ?? [], `${slug}.en`);
  const es = convert(article.body?.es ?? [], `${slug}.es`);
  if (
    JSON.stringify([en, es]) ===
    JSON.stringify([article.body?.en, article.body?.es])
  ) {
    continue;
  }
  changed += 1;
  // system fields are assigned by the API, not carried in
  const { _rev, _createdAt, _updatedAt, ...doc } = article;
  void _rev;
  void _createdAt;
  void _updatedAt;
  process.stdout.write(
    `${JSON.stringify({ ...doc, body: { _type: "localizedArticleBody", en, es } })}\n`,
  );
}

console.error(`→ ${changed}/${articles.length} articles rewritten`);
if (skipped.length) console.error(`→ left alone:\n   ${skipped.join("\n   ")}`);
