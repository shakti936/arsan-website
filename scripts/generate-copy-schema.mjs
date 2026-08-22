#!/usr/bin/env node
/**
 * Generates Sanity schema for editable page copy, from `messages/en.json`.
 *
 *   bun run generate:copy
 *
 * **The catalogue defines the shape; Sanity supplies values.** Hand-writing a
 * schema for ~270 keys would be a second declaration of the same structure,
 * and the two would drift the first time anyone added a message key. This
 * reads the real tree and emits a form that mirrors it, so the only way to add
 * an editable field is to add the key — which `validate-messages.mjs` already
 * guards across locales.
 *
 * One document type per page namespace, because "click Home, edit the home
 * page" is what an editor expects. A single type with a namespace dropdown
 * would need thirteen mutually-hidden branches in one form.
 *
 * Every field is optional. An empty field means "use the catalogue", which is
 * what makes this a safe override layer rather than a migration: nothing has
 * to be filled in for the site to render exactly as it does today.
 */
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const messages = JSON.parse(
  readFileSync(join(ROOT, "messages/en.json"), "utf8"),
);

/**
 * Namespaces that are PAGE COPY. Everything absent is UI chrome and stays in
 * code (D-090): `nav` labels, `forms` validation, `errors`, `meta`, `brand`.
 * Shared section namespaces are listed too — they are copy, they are just copy
 * that appears on more than one page.
 */
const PAGES = [
  ["home", "Home"],
  ["subpage.forClients", "For Clients"],
  ["subpage.executiveSearch", "Executive Search"],
  ["subpage.mexicoAdvisory", "Mexico Advisory"],
  ["subpage.leadershipSolutions", "Leadership Solutions"],
  ["subpage.forCandidates", "For Candidates"],
  ["subpage.results", "Results"],
  ["subpage.insights", "Insights"],
  ["subpage.whyArsan", "Why ARSAN"],
  ["subpage.contact", "Contact"],
  ["subpage.opportunities", "Opportunities"],
  ["subpage.submitProfile", "Submit Your Profile"],
  ["subpage.talentNetwork", "Talent Network"],
  ["resultsPage", "Results — sections"],
  ["insightsIndex", "Insights — index"],
  ["article", "Article furniture"],
  ["newsletter", "Newsletter band"],
  ["ctaBand", "CTA band — default"],
  ["ctaBandForClients", "CTA band — for clients"],
  ["ctaBandCandidates", "CTA band — for candidates"],
  ["insightsRow", "Insights row"],
  ["team", "Team row"],
  ["candidateValues", "Candidate values"],
  ["candidateHelp", "Candidate help"],
  ["candidateTrust", "Candidate trust"],
  ["whyChoose", "Why choose ARSAN"],
  ["whyCall", "Why call"],
  ["functionGrid", "Function grid"],
  ["mexicoCase", "Mexico case"],
  ["mexicoQuestions", "Mexico questions"],
  ["mexicoEarly", "Mexico early"],
  ["caseStudy", "Case study furniture"],
  ["hero", "Hero furniture"],
  ["footer", "Footer"],
];

const get = (path) =>
  path.split(".").reduce((cur, part) => cur?.[part], messages);

const pascal = (s) =>
  s
    .split(/[.\-_]/)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

const title = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

/** Long strings get a textarea; short ones a single line. */
const isLong = (v) => typeof v === "string" && v.length > 90;

let indentLevel = 0;
const pad = () => "  ".repeat(indentLevel);

/**
 * Sanity field names cannot contain hyphens. Some message keys are enum CODES
 * used as lookup keys — `employment["full-time"]`, `fn["supply-chain"]` — which
 * are not editorial copy at all: they are labels for facet values the job board
 * matches on. Skipping them keeps a code table out of a copy editor, and the
 * catalogue still supplies them.
 */
const VALID_FIELD = /^[A-Za-z]+[0-9A-Za-z_]*$/;
const skipped = [];

function editableEntries(value, path) {
  return Object.entries(value).filter(([k]) => {
    if (VALID_FIELD.test(k)) return true;
    skipped.push(`${path}.${k}`);
    return false;
  });
}

function field(key, value) {
  const base = `name: "${key}", title: ${JSON.stringify(title(key))}`;
  if (Array.isArray(value)) {
    const [sample] = value;
    if (sample && typeof sample === "object") {
      indentLevel += 1;
      const entries = editableEntries(sample, `${key}[]`);
      if (!entries.length) {
        indentLevel -= 1;
        return null;
      }
      const inner = entries
        .map(([k, v]) => field(k, v))
        .filter(Boolean)
        .join(",\n");
      indentLevel -= 1;
      return `${pad()}defineField({ ${base}, type: "array", of: [defineArrayMember({ type: "object", fields: [\n${inner}\n${pad()}] })] })`;
    }
    return `${pad()}defineField({ ${base}, type: "array", of: [defineArrayMember({ type: "string" })] })`;
  }
  if (value && typeof value === "object") {
    indentLevel += 1;
    const entries = editableEntries(value, key);
    if (!entries.length) {
      indentLevel -= 1;
      return null;
    }
    const inner = entries
      .map(([k, v]) => field(k, v))
      .filter(Boolean)
      .join(",\n");
    indentLevel -= 1;
    return `${pad()}defineField({ ${base}, type: "object", options: { collapsible: true, collapsed: true }, fields: [\n${inner}\n${pad()}] })`;
  }
  return `${pad()}defineField({ ${base}, type: "${isLong(value) ? "text" : "string"}"${isLong(value) ? ", rows: 3" : ""} })`;
}

// wipe previously generated files so a removed namespace cannot linger
const outDir = join(ROOT, "src/sanity/schema/copy");
for (const f of readdirSync(outDir)) {
  if (f.endsWith(".ts") && f !== "index.ts") unlinkSync(join(outDir, f));
}

const types = [];
for (const [namespace, label] of PAGES) {
  const tree = get(namespace);
  if (!tree || typeof tree !== "object") {
    console.error(`  skipped ${namespace} — not an object in messages/en.json`);
    continue;
  }
  const typeName = `copy${pascal(namespace)}`;
  indentLevel = 3;
  const fields = Object.entries(tree)
    .map(([k, v]) => field(k, v))
    .join(",\n");
  /** Namespaces with no list in them never call `defineArrayMember`, and an
   *  unused import is a lint error in a file nobody is allowed to hand-fix. */
  const usesArrays = fields.includes("defineArrayMember");
  const file = `// GENERATED by scripts/generate-copy-schema.mjs — do not edit.
// Shape mirrors the "${namespace}" namespace in messages/en.json.
import { ${usesArrays ? "defineArrayMember, " : ""}defineField, defineType } from "sanity";

const shape = [
${fields},
];

export const ${typeName} = defineType({
  name: "${typeName}",
  title: ${JSON.stringify(label)},
  type: "document",
  fields: [
    defineField({
      name: "namespace",
      type: "string",
      hidden: true,
      readOnly: true,
      initialValue: "${namespace}",
    }),
    defineField({
      name: "translationState",
      title: "Translation bookkeeping",
      type: "text",
      hidden: true,
      readOnly: true,
      description:
        "Written by the Translate action. Records which Spanish strings the machine produced and from which English, so a hand-edited translation is never overwritten.",
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "object",
      fields: [
        // collapsible objects rather than field GROUPS: groups are only valid
        // on a document's top-level fields, and these are nested one deep
        // inside \`copy\`. Sanity does not reject that at schema-validate time —
        // it crashes the structure tool when the form is opened (D-098).
        defineField({
          name: "en",
          title: "English",
          type: "object",
          options: { collapsible: true, collapsed: false },
          fields: shape,
        }),
        defineField({
          name: "es",
          title: "Español",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: shape,
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: ${JSON.stringify(label)} }) },
});
`;
  writeFileSync(join(outDir, `${namespace.replace(/\./g, "-")}.ts`), file);
  types.push({
    typeName,
    namespace,
    label,
    file: namespace.replace(/\./g, "-"),
  });
}

writeFileSync(
  join(outDir, "index.ts"),
  `// GENERATED by scripts/generate-copy-schema.mjs — do not edit.
import type { SchemaTypeDefinition } from "sanity";
${types.map((t) => `import { ${t.typeName} } from "./${t.file}";`).join("\n")}

/**
 * Every page-copy document type, in the order the Studio lists them.
 *
 * STUDIO-ONLY. Importing this from app code pulls all ${types.length} schema modules — and
 * therefore \`sanity\` — into the server graph, where \`swr\` resolves to a
 * react-server build with no default export and the build dies pointing at a
 * file nobody wrote. Runtime code wants \`./namespaces\`, which imports nothing.
 */
export const copyTypes: SchemaTypeDefinition[] = [
${types.map((t) => `  ${t.typeName},`).join("\n")}
];
`,
);

writeFileSync(
  join(outDir, "namespaces.ts"),
  `// GENERATED by scripts/generate-copy-schema.mjs — do not edit.

/**
 * Studio type name → the dotted message namespace it overrides.
 *
 * Deliberately a separate module from \`index.ts\` with NO imports: this is the
 * half the running site needs, and pulling the schema in beside it would drag
 * the whole Studio into the server bundle (D-097).
 */
export const COPY_NAMESPACES: Record<string, string> = {
${types.map((t) => `  ${t.typeName}: ${JSON.stringify(t.namespace)},`).join("\n")}
};
`,
);
console.log(`✓ generated ${types.length} page-copy document types`);
if (skipped.length) {
  console.log(
    `  left in the catalogue (code-keyed, not editorial): ${[...new Set(skipped)].join(", ")}`,
  );
}
