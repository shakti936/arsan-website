#!/usr/bin/env node
/**
 * Prebuild gate for the design system itself.
 *
 * The type scale is only a system if it is the ONLY way to set type. Three
 * things have broken it before, all of them silent — no type error, no lint
 * error, a green build and a wrong page:
 *
 *   1. A custom `--text-*` token not registered with tailwind-merge. It cannot
 *      tell a custom size from a colour, so `cn("text-heading","text-navy-900")`
 *      drops one of them. This shipped twice: once as section headings at body
 *      size (D-043), once as a navy-on-navy hero H1 (D-089).
 *   2. An arbitrary `text-[1.75rem]` next to the scale, which is how the scale
 *      drifted to five sizes for one role in the first place.
 *   3. A hex colour that is not in the palette. Hex is unavoidable in two
 *      places — `themeColor` metadata and the OG images, because Satori
 *      resolves no CSS variables — so the rule is not "no hex", it is "no hex
 *      the palette does not define". A brand colour that drifts from
 *      globals.css is the failure; a literal that matches it is not.
 *
 * Content is edited in Sanity; the design system is not. This is the code-side
 * half of that boundary — the schema layer is the other half.
 */
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const errors = [];

/** Sizes Tailwind already ships; overriding one needs no registration. */
const BUILT_IN = new Set([
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
]);

const css = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
const cn = readFileSync(join(ROOT, "src/lib/cn.ts"), "utf8");

// 1. every custom --text-* role is registered with tailwind-merge
const declared = new Set(
  [...css.matchAll(/^\s*--text-([a-z0-9-]+):/gm)]
    .map((m) => m[1])
    .filter((name) => !name.endsWith("--line-height") && !BUILT_IN.has(name)),
);
const registeredBlock = cn.match(/TYPE_ROLES = \[(.*?)\]/s)?.[1] ?? "";
const registered = new Set(
  [...registeredBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]),
);
for (const name of declared) {
  if (!registered.has(name)) {
    errors.push(
      `--text-${name} is defined in globals.css but missing from TYPE_ROLES in src/lib/cn.ts —\n` +
        `      tailwind-merge will treat \`text-${name}\` as a COLOUR and silently drop it or the\n` +
        `      colour beside it. Add "${name}" to TYPE_ROLES.`,
    );
  }
}
for (const name of registered) {
  if (!declared.has(name)) {
    errors.push(
      `TYPE_ROLES lists "${name}" but globals.css defines no --text-${name}. Remove it, or the\n` +
        `      next person will use a class that produces nothing.`,
    );
  }
}

// 2 + 3. component-level bypasses
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if ([".tsx", ".ts"].includes(extname(p))) files.push(p);
  }
})(join(ROOT, "src"));

/**
 * Sanity SCHEMA modules import `sanity`, which is the Studio. Pulling one into
 * app code drags the Studio into the server graph, where `swr` resolves to a
 * react-server build with no default export — and the build dies pointing at a
 * file in node_modules that nobody wrote. This has happened twice: once via the
 * Studio route (D-090) and once via the generated copy schema (D-097).
 *
 * `.../schema/copy/namespaces` is the exception by design: pure data, no
 * imports, which is exactly why it was split out.
 */
const SCHEMA_IMPORT =
  /from\s+["'][^"']*sanity\/schema(?!\/copy\/namespaces)([^"']*)["']/;

/** `text-[0.5em]` scales a unit suffix to its figure — relative, so allowed. */
const RELATIVE = /^text-\[[\d.]+em\]$/;
const DEAD_VOCAB = /\btext-display-(?:xl|lg|md|sm)\b/;
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
/** Hexes globals.css defines. A literal is fine if it IS the palette. */
const PALETTE = new Set(
  [...css.matchAll(/--color-[a-z0-9-]+:\s*(#[0-9a-fA-F]{3,8})/g)].map((m) =>
    m[1].toLowerCase(),
  ),
);
/**
 * Deliberate exception, reason required: `design-system-ignore: why`.
 * Looked for on the line itself or in the three above it — a formatter will
 * split a long declaration away from the comment that explains it.
 */
const IGNORE = /design-system-ignore:\s*\S/;
const exempt = (all, i) =>
  all.slice(Math.max(0, i - 3), i + 1).some((l) => IGNORE.test(l));

for (const file of files) {
  const where = relative(ROOT, file);
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i, all) => {
      const at = `${where}:${i + 1}`;
      const trimmed = line.trim();
      // a comment naming a class is documentation, not a use of it
      if (trimmed.startsWith("*") || trimmed.startsWith("//")) return;
      if (exempt(all, i)) return;
      for (const m of line.matchAll(/\btext-\[[^\]]+\]/g)) {
        if (!RELATIVE.test(m[0])) {
          errors.push(
            `${at}\n      \`${m[0]}\` is an arbitrary font size. Use a role from the scale —\n` +
              `      headline · title · heading · subheading · figure · lead · badge.`,
          );
        }
      }
      if (!where.startsWith("src/sanity/schema/") && SCHEMA_IMPORT.test(line)) {
        errors.push(
          `${at}\n      imports Sanity SCHEMA from app code. That pulls the Studio into the\n` +
            `      server bundle and breaks the build in node_modules. Import the data you\n` +
            `      need from a Studio-free module (see src/sanity/schema/copy/namespaces.ts).`,
        );
      }
      if (DEAD_VOCAB.test(line)) {
        errors.push(
          `${at}\n      \`text-display-*\` was replaced by named roles (D-089).`,
        );
      }
      // hex inside an inlined SVG is drawing; `&#8203;` is an HTML entity
      if (!line.includes("data:image/svg") && !line.includes("%23")) {
        for (const m of line.replace(/&#\d+;/g, "").matchAll(HEX)) {
          if (!PALETTE.has(m[0].toLowerCase())) {
            errors.push(
              `${at}\n      \`${m[0]}\` is not in the palette. Use a token, or — where hex is\n` +
                `      unavoidable (themeColor, OG images) — use the exact palette value so it\n` +
                `      cannot drift from globals.css. Deliberate exception: add a trailing\n` +
                `      \`design-system-ignore: <reason>\` comment.`,
            );
          }
        }
      }
    });
}

if (errors.length) {
  console.error(`\n✗ design system validation failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  ${e}\n`);
  process.exit(1);
}
console.log(
  `✓ design system valid — ${declared.size} type roles registered, no arbitrary sizes, no raw hex`,
);
