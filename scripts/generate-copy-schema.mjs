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
 * Every namespace an editor can change, and where it belongs in the Studio.
 *
 * `nav`, `forms` and `errors` were originally held back as "UI chrome that
 * stays in code". That was wrong: the header's "Discuss a Search" button, the
 * mega-menu labels and a form's own wording are copy the business owns, and
 * leaving them out produced exactly the complaint it deserved — a page where
 * some words can be edited and others cannot, with no way to tell which.
 *
 * The group is what the Studio lists them under. Three groups, because an
 * editor's real question is one of three: *this page*, *the bit that repeats
 * on every page*, or *the whole site*.
 */
const PAGES = [
  ["home", "Home", "Pages"],
  ["subpage.forClients", "For Clients", "Pages"],
  ["subpage.executiveSearch", "Executive Search", "Pages"],
  ["subpage.mexicoAdvisory", "Mexico Advisory", "Pages"],
  ["subpage.leadershipSolutions", "Leadership Solutions", "Pages"],
  ["subpage.forCandidates", "For Candidates", "Pages"],
  ["subpage.results", "Results", "Pages"],
  ["subpage.insights", "Insights", "Pages"],
  ["subpage.whyArsan", "Why ARSAN", "Pages"],
  ["subpage.contact", "Contact", "Pages"],
  ["subpage.opportunities", "Opportunities (job list)", "Pages"],
  ["subpage.opportunity", "Opportunities (one job)", "Pages"],
  ["subpage.submitProfile", "Submit Your Profile", "Pages"],
  ["subpage.talentNetwork", "Talent Network", "Pages"],

  ["hero", "Page headers", "Repeated blocks"],
  ["ctaBand", "“Let’s talk” band — default", "Repeated blocks"],
  ["ctaBandForClients", "“Let’s talk” band — clients", "Repeated blocks"],
  ["ctaBandCandidates", "“Let’s talk” band — candidates", "Repeated blocks"],
  ["newsletter", "Newsletter sign-up", "Repeated blocks"],
  ["team", "Meet the team row", "Repeated blocks"],
  ["insightsRow", "Latest insights row", "Repeated blocks"],
  ["resultsPage", "Results page sections", "Repeated blocks"],
  ["insightsIndex", "Insights index", "Repeated blocks"],
  ["article", "Article page furniture", "Repeated blocks"],
  ["caseStudy", "Case study furniture", "Repeated blocks"],
  ["candidateValues", "Candidate values", "Repeated blocks"],
  ["candidateHelp", "Candidate help", "Repeated blocks"],
  ["candidateTrust", "Candidate trust", "Repeated blocks"],
  ["whyChoose", "Why choose ARSAN", "Repeated blocks"],
  ["whyCall", "Why call", "Repeated blocks"],
  ["functionGrid", "Functions we search", "Repeated blocks"],
  ["mexicoCase", "Mexico case", "Repeated blocks"],
  ["mexicoQuestions", "Mexico questions", "Repeated blocks"],
  ["mexicoEarly", "Mexico early", "Repeated blocks"],

  ["nav", "Menu & header", "Whole site"],
  ["footer", "Footer", "Whole site"],
  ["forms", "Form labels & messages", "Whole site"],
  ["errors", "Error messages", "Whole site"],
  ["articleCategories", "Article category names", "Whole site"],
  ["meta", "Site title & description", "Whole site"],
  ["brand", "Company name", "Whole site"],
];

const get = (path) =>
  path.split(".").reduce((cur, part) => cur?.[part], messages);

const pascal = (s) =>
  s
    .split(/[.\-_]/)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

/**
 * Field labels, written for someone who has never built a website.
 *
 * De-camelCasing the key gives "Headline Lead", "Cta Primary", "Chooser" —
 * accurate names for things the editor has no name for. They describe the
 * data; an editor needs to know **which words on the page** a box changes.
 * Keyed by the bare message key, so one entry fixes the same concept
 * everywhere it appears across 34 pages.
 *
 * Anything not listed falls back to the de-camelCased key, which is fine for
 * the ones that are already plain — "Title", "Body", "Heading".
 */
const LABELS = {
  hero: "Top of the page",
  chooser: "Choose-your-path cards",
  values: "What we stand for",
  stories: "Client stories",
  logoWall: "Client logos",
  newsletter: "Newsletter sign-up",
  footer: "Footer",
  form: "The form",
  seo: "Google & social sharing",
  headlineLead: "Headline — first part",
  headlineEmphasis: "Headline — the highlighted words",
  headlineTail: "Headline — last part",
  headline: "Headline",
  subhead: "Paragraph under the headline",
  eyebrow: "Small label above the heading",
  deck: "Short intro paragraph",
  lead: "Opening line (bold)",
  heading: "Section heading",
  subheading: "Smaller heading",
  body: "Paragraph",
  text: "Paragraph",
  intro: "Intro paragraph",
  note: "Small print",
  cta: "Button",
  ctaPrimary: "Main button",
  ctaSecondary: "Second button",
  ctaLabel: "Button",
  ctaHeading: "Heading above the button",
  ctaBody: "Paragraph above the button",
  heroCta: "Button at the top of the page",
  label: "Label",
  viewAll: '"View all" link',
  readStory: '"Read story" link',
  readMore: '"Read more" link',
  imageAlt: "Image description (for screen readers and Google)",
  metaTitle: "Google search result — title",
  metaDescription: "Google search result — description",
  regions: "Small line under the buttons",
  cards: "Cards",
  items: "List items",
  steps: "Numbered steps",
  need: "Card — the problem",
  service: "Card — what we call it",
  role: "Person's job title",
  org: "Company name",
  quote: "Quotation",
  placeholder: "Grey hint text inside the box",
  error: "Message shown when it goes wrong",
  success: "Message shown when it works",
};

const deCamel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const title = (key) => LABELS[key] ?? deCamel(key);

/**
 * Names a SECTION by the words it puts on the page.
 *
 * "Chooser" means nothing to an editor; `The "What talent challenge are you
 * facing?" block` is the thing they can see. Taken from the section's own
 * heading text, so it needs no hand-maintained list and cannot describe a
 * section that no longer exists.
 */
function describe(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const joined = [
    value.headlineLead,
    value.headlineEmphasis,
    value.headlineTail,
  ]
    .filter((part) => typeof part === "string")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const sample =
    value.heading ?? value.title ?? value.headline ?? joined ?? value.label;
  if (typeof sample !== "string" || !sample.trim()) return null;
  const trimmed = sample.length > 70 ? `${sample.slice(0, 67)}…` : sample;
  return `The “${trimmed}” block`;
}

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

/** MUST match `src/sanity/lib/copy-keys.ts`. A hyphen is illegal in a Sanity
 *  field name; `__` is the reversible stand-in. */
const toFieldName = (key) => key.replace(/-/g, "__");

function editableEntries(value, path) {
  return Object.entries(value).filter(([k]) => {
    if (k.includes("__")) {
      throw new Error(
        `${path}.${k} contains "__", which is the hyphen marker used to make ` +
          `keys legal as Sanity field names. Rename the message key — the ` +
          `round trip in src/sanity/lib/copy-keys.ts would not be lossless.`,
      );
    }
    if (VALID_FIELD.test(toFieldName(k))) return true;
    skipped.push(`${path}.${k}`);
    return false;
  });
}

function field(key, value) {
  const base = `name: "${toFieldName(key)}", title: ${JSON.stringify(title(key))}`;
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
    const hint = describe(value);
    const described = hint ? `, description: ${JSON.stringify(hint)}` : "";
    // expanded, NOT collapsed: a page of shut accordions with names like
    // "Chooser" shows an editor nothing they recognise. Open, every box holds
    // words they can read off the page.
    return `${pad()}defineField({ ${base}${described}, type: "object", options: { collapsible: true, collapsed: false }, fields: [\n${inner}\n${pad()}] })`;
  }
  return `${pad()}defineField({ ${base}, type: "${isLong(value) ? "text" : "string"}"${isLong(value) ? ", rows: 3" : ""} })`;
}

// wipe previously generated files so a removed namespace cannot linger
const outDir = join(ROOT, "src/sanity/schema/copy");
for (const f of readdirSync(outDir)) {
  if (f.endsWith(".ts") && f !== "index.ts") unlinkSync(join(outDir, f));
}

const types = [];
for (const [namespace, label, group] of PAGES) {
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
          description: "Write the page here. Spanish is generated from it.",
          type: "object",
          options: { collapsible: true, collapsed: false },
          fields: shape,
        }),
        defineField({
          name: "es",
          title: "Español (Spanish)",
          description:
            "Filled in for you. Press “Translate to Spanish” above — you only need to open this to correct a word, and anything you change here is kept forever.",
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
    group,
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

/**
 * The same list, with the label and the Studio group each belongs under.
 *
 * Three groups, because an editor's question is always one of three: *this
 * page*, *the block that repeats on every page*, or *the whole site*.
 */
export const COPY_PAGES: { type: string; label: string; group: string }[] = [
${types.map((t) => `  { type: "${t.typeName}", label: ${JSON.stringify(t.label)}, group: ${JSON.stringify(t.group)} },`).join("\n")}
];
`,
);
console.log(`✓ generated ${types.length} page-copy document types`);
if (skipped.length) {
  console.log(
    `  left in the catalogue (code-keyed, not editorial): ${[...new Set(skipped)].join(", ")}`,
  );
}
