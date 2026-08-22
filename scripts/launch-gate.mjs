#!/usr/bin/env node
/**
 * Pre-cutover gate: nothing named `placeholder-` may go to production.
 *
 * Why this exists as a script rather than a line on a checklist. The
 * leadership row ships generated portraits standing in for real headshots of
 * named partners — a visitor reads those faces as the people who would run
 * their search, which is a claim the files can't make. "Swap them before
 * launch" written in a doc is the kind of thing that is true right up until
 * the day it isn't, so it is a command instead:
 *
 *   bun run check:launch
 *
 * It is deliberately NOT wired into `build`. Placeholders are correct during
 * the build; they are only wrong at cutover, and a gate that fires on every
 * `next dev` is a gate people learn to ignore. Run it before promoting to
 * production, and drop it from the pre-cutover list once it reports clean and
 * no placeholder assets remain.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PREFIX = "placeholder-";
const SEARCH_DIRS = ["src", "messages"];
const SEARCH_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".css"]);

function walk(dir, hit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, hit);
    else hit(path);
  }
}

const assets = [];
walk(join(ROOT, "public"), (path) => {
  const name = path.split("/").pop() ?? "";
  if (name.startsWith(PREFIX)) assets.push(path);
});

const sources = [];
for (const dir of SEARCH_DIRS) {
  walk(join(ROOT, dir), (path) => {
    if (SEARCH_EXTS.has(extname(path))) sources.push(path);
  });
}
const corpus = sources.map((path) => [path, readFileSync(path, "utf8")]);

const blocking = [];
const orphans = [];
for (const asset of assets) {
  const stem = (asset.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
  const referencedBy = corpus
    .filter(([, text]) => text.includes(stem))
    .map(([path]) => relative(ROOT, path));
  if (referencedBy.length) blocking.push({ asset, referencedBy });
  else orphans.push(asset);
}

const kb = (path) => `${Math.round(statSync(path).size / 1024)}KB`;

if (orphans.length) {
  console.log("Unreferenced placeholder assets (safe to delete):");
  for (const asset of orphans) {
    console.log(`  ${relative(ROOT, asset)}  ${kb(asset)}`);
  }
  console.log("");
}

if (!blocking.length) {
  console.log("✓ launch gate clear — no placeholder assets are referenced.");
  process.exit(0);
}

console.error("✗ launch gate BLOCKED — placeholder assets are still live:\n");
for (const { asset, referencedBy } of blocking) {
  console.error(`  ${relative(ROOT, asset)}  ${kb(asset)}`);
  for (const path of referencedBy) console.error(`      ← ${path}`);
}
console.error(
  "\nReplace these with the real assets, or remove the surfaces that use them,\n" +
    "before promoting to production. See docs/sop/11-open-questions.md Q-21.",
);
process.exit(1);
