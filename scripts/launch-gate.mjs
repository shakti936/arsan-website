#!/usr/bin/env node
/**
 * Pre-cutover gate. Three things must be gone before this site is public:
 * assets named `placeholder-`, content marked `@unverified`, and fabricated
 * data marked `@placeholder`.
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
/**
 * Claims replicated from the Direction A comps that nobody has verified —
 * third-party statistics, client outcome figures, client testimonials. Drew
 * asked for the comps reproduced exactly (D-071), so they are in the build;
 * this is what stops them reaching production unnoticed. Annotate each one:
 *
 *   // @unverified: needs the real Deloitte figure or removal
 *
 * Delete the claim, delete the marker, and the gate goes quiet.
 */
const UNVERIFIED = /(?:^|\s)(?:\/\/|\*) @unverified:(.*)$/;
/**
 * Fabricated data standing in for a system that does not exist yet — today,
 * the job openings the board renders while the internal ATS is built. A
 * visitor can't tell an invented opening from a real one, so this is a
 * separate category from an unverified claim and a harder stop: someone could
 * apply to a role nobody is hiring for.
 */
const PLACEHOLDER_DATA = /(?:^|\s)(?:\/\/|\*) @placeholder:(.*)$/;
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

const claims = [];
const fixtures = [];
for (const [path, text] of corpus) {
  text.split("\n").forEach((line, i) => {
    // `// @unverified:` exactly — prose in a block comment that happens to
    // name the marker is documentation, not an annotation
    const claim = UNVERIFIED.exec(line);
    if (claim) {
      claims.push({
        where: `${relative(ROOT, path)}:${i + 1}`,
        note: (claim[1] ?? "").trim(),
      });
    }
    const fixture = PLACEHOLDER_DATA.exec(line);
    if (fixture) {
      fixtures.push({
        where: `${relative(ROOT, path)}:${i + 1}`,
        note: (fixture[1] ?? "").trim(),
      });
    }
  });
}

const kb = (path) => `${Math.round(statSync(path).size / 1024)}KB`;

if (orphans.length) {
  console.log("Unreferenced placeholder assets (safe to delete):");
  for (const asset of orphans) {
    console.log(`  ${relative(ROOT, asset)}  ${kb(asset)}`);
  }
  console.log("");
}

if (!blocking.length && !claims.length && !fixtures.length) {
  console.log("✓ launch gate clear — no placeholders, no unverified claims.");
  process.exit(0);
}

const report = (rows) => {
  for (const { where, note } of rows) {
    console.error(`  ${where}`);
    console.error(`      ${note}`);
  }
};

if (blocking.length) {
  console.error("✗ placeholder assets are still live:\n");
  for (const { asset, referencedBy } of blocking) {
    console.error(`  ${relative(ROOT, asset)}  ${kb(asset)}`);
    for (const path of referencedBy) console.error(`      ← ${path}`);
  }
  console.error(
    "\n  → replace with real assets, or remove the surfaces using them (Q-21).\n",
  );
}

if (fixtures.length) {
  console.error(
    `✗ ${fixtures.length} fabricated dataset${fixtures.length === 1 ? " is" : "s are"} still wired up:\n`,
  );
  report(fixtures);
  console.error(
    "\n  → invented records a visitor cannot tell from real ones. Point the\n" +
      "    provider at the real system and delete the fixture (D-074, Q-24).\n",
  );
}

if (claims.length) {
  console.error(`✗ ${claims.length} unverified claims are still live:\n`);
  report(claims);
  console.error(
    "\n  → each is a statistic, source or client quote copied from a Direction A\n" +
      "    comp and never verified. Verify it, replace it, or delete it and its\n" +
      "    marker before promoting to production (D-071, Q-23).\n",
  );
}

process.exit(1);
