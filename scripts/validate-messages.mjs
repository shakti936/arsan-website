#!/usr/bin/env node
/**
 * Prebuild gate. Two failure modes this catches, both of which have shipped
 * green through tsc + Biome + `next build` before (SOP D-042):
 *   1. nav.ts references a message key that no catalog defines
 *      (next-intl falls back silently in prod, throws in dev)
 *   2. locale catalogs drift apart — es missing a key en has, or vice versa
 */
import { readFileSync } from "node:fs";

const LOCALES = ["en", "es"];
const catalogs = Object.fromEntries(
  LOCALES.map((l) => [
    l,
    JSON.parse(readFileSync(`messages/${l}.json`, "utf8")),
  ]),
);

const get = (obj, path) =>
  path.split(".").reduce((cur, part) => (cur == null ? cur : cur[part]), obj);

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? flatten(v, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );

const errors = [];

// 1. Every key nav.ts asks for must exist in every locale
const nav = readFileSync("src/lib/nav.ts", "utf8");
const sectionRe =
  /key:\s*"(\w+)",\s*\n\s*href:\s*"[^"]*",\s*\n\s*children:\s*\[(.*?)\n\s{4}\],(\s*\n\s{4}feature:)?/gs;
const required = [];
for (const [, section, childBlock, hasFeature] of nav.matchAll(sectionRe)) {
  required.push(`nav.${section}.label`, `nav.${section}.exploreAll`);
  for (const [, child] of childBlock.matchAll(/key:\s*"(\w+)"/g)) {
    required.push(
      `nav.${section}.children.${child}.label`,
      `nav.${section}.children.${child}.description`,
    );
  }
  if (hasFeature) {
    required.push(
      `nav.${section}.feature.title`,
      `nav.${section}.feature.body`,
      `nav.${section}.feature.cta`,
    );
  }
}
if (required.length === 0) {
  errors.push(
    "nav.ts parsed to zero keys — the parser drifted from the file shape",
  );
}
for (const locale of LOCALES) {
  for (const key of required) {
    if (get(catalogs[locale], key) === undefined) {
      errors.push(`${locale}: nav.ts needs "${key}" — missing from catalog`);
    }
  }
}

// 2. Locale catalogs must have identical key sets
const [base, ...rest] = LOCALES;
const baseKeys = new Set(flatten(catalogs[base]));
for (const locale of rest) {
  const keys = new Set(flatten(catalogs[locale]));
  for (const k of baseKeys) {
    if (!keys.has(k))
      errors.push(`${locale}: missing "${k}" (present in ${base})`);
  }
  for (const k of keys) {
    if (!baseKeys.has(k))
      errors.push(`${base}: missing "${k}" (present in ${locale})`);
  }
}

if (errors.length > 0) {
  console.error(`\n✗ message validation failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}
console.log(
  `✓ messages valid — ${required.length} nav keys, ${baseKeys.size} total, ${LOCALES.length} locales in sync`,
);
