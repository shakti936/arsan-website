/**
 * KIE.AI image generation CLI
 *
 * Default model: nano-banana-pro (Gemini 3 Pro Image) — the highest-fidelity
 * KIE-hosted model with multi-reference image grounding (up to 8 references
 * per task). Falls back to nano-banana-2 (Gemini 3.1 Flash Image) when speed
 * matters more than detail. flux-kontext is the consistency-tuned alternate
 * for batches that need a stable subject identity across many shots.
 *
 * Usage:
 *   bun run gen:image \
 *     --slot hero|service|project|city|before-after \
 *     --prompt "<engineered prompt>" \
 *     --output <filename-no-ext>          saved as /public/images/<output>.<ext>
 *     [--name <slug>]                     for logging context
 *     [--logo-url <url>]                  primary brand reference (logo)
 *     [--reference-url <url>]             additional reference image, repeatable
 *                                         (max 7 more — total cap is 8 with logo)
 *     [--model nano-banana-pro]           default: nano-banana-pro
 *                                         alternates: nano-banana-2, flux-kontext, gpt-image-1.5
 *     [--resolution 1K|2K|4K]            default: slot-aware
 *                                         (hero/before-after → 4K, others → 2K)
 *     [--aspect 16:9|...]                 override slot default aspect ratio
 *     [--format jpg|png]                  default: jpg
 *     [--google-search]                   real-time search grounding (city slot)
 *
 * ── 2026 Prompting (canonical 8-part formula) ───────────────────────────────
 * Write prompts as descriptive sentences in this order:
 *
 *   [Realism trigger] + [Subject doing specific job] + [Environment] +
 *   [Camera/lens spec] + [Lighting] + [Texture/detail] + [Composition] +
 *   [Style anchor] + [Negative prompt block]
 *
 * Camera physics tokens trigger photoreal mode:
 *   "shot on 35mm at f/4", "Kodak Portra 400 film stock", "subtle natural grain"
 *
 * Drop these junk tokens (treated as noise by current models):
 *   "highly detailed", "8K", "masterpiece", "ultra realistic"
 *
 * Always end with explicit negative prompt:
 *   "Negative: stock-photo posing, plastic skin, fake blue sky,
 *    oversaturated colors, AI smoothing"
 *
 * ── Multi-reference image strategy ──────────────────────────────────────────
 * KIE nano-banana-pro accepts up to 8 reference images. Use them to anchor
 * brand identity:
 *   1. Logo (always — pass as --logo-url)
 *   2. Real client photo showing actual crew or product
 *   3. Vehicle photo if a branded truck appears in any prompt
 *   4-8. Optional: brand color swatch, uniform photo, additional context
 *
 * The PROMPT describes the SCENE. The REFERENCES describe the BRAND.
 * Don't put logo descriptions in the prompt — pass the logo as a reference
 * and let the model match against it.
 * ────────────────────────────────────────────────────────────────────────────
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  AspectRatio,
  KieModel,
  OutputFormat,
  Resolution,
} from "./lib/kie-client";
import {
  downloadImage,
  isFluxKontextModel,
  MAX_REFERENCE_IMAGES,
  pollFluxKontextUntilDone,
  pollUntilDone,
  submit,
  submitFluxKontext,
  toFluxAspectRatio,
} from "./lib/kie-client";

/** Models with "fast" / "flash" semantics — typically <30s generation,
 *  lower fidelity. Used for ETA messaging and runtime decisions. */
const FAST_MODELS: ReadonlySet<string> = new Set([
  "nano-banana-2",
  "gpt-image-1.5-mini",
]);
function isFastModel(model: string): boolean {
  return FAST_MODELS.has(model) || /-(flash|mini|fast)$/i.test(model);
}

// ---- Types ------------------------------------------------------------------

type Slot = "hero" | "service" | "project" | "city" | "before-after";

interface CliArgs {
  slot: Slot;
  name?: string;
  prompt: string;
  output: string;
  logoUrl?: string;
  referenceUrls: string[];
  model: KieModel;
  resolution: Resolution;
  aspect?: AspectRatio;
  format: OutputFormat;
  googleSearch: boolean;
}

// ---- Slot config ------------------------------------------------------------

const SLOT_ASPECT: Record<Slot, AspectRatio> = {
  hero: "16:9",
  service: "16:9",
  project: "4:3",
  city: "16:9",
  "before-after": "16:9",
};

// Hero and before-after benefit most from 4K detail; others default to 2K
const SLOT_DEFAULT_RESOLUTION: Record<Slot, Resolution> = {
  hero: "4K",
  service: "2K",
  project: "2K",
  city: "2K",
  "before-after": "4K",
};

const VALID_ASPECTS: AspectRatio[] = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
  "auto",
];
const VALID_RESOLUTIONS: Resolution[] = ["1K", "2K", "4K"];
const VALID_FORMATS: OutputFormat[] = ["jpg", "png"];

// ---- Arg parsing ------------------------------------------------------------

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2); // strip [bun, script.ts]

  // Single-value flag getter
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return undefined;
    return args[idx + 1];
  };

  // Repeatable flag — collect every occurrence. Skip the value-of-flag so a
  // URL containing the literal flag string can't be misread as another flag.
  const getAll = (flag: string): string[] => {
    const values: string[] = [];
    let i = 0;
    while (i < args.length - 1) {
      const next = args[i + 1];
      if (args[i] === flag && next !== undefined) {
        values.push(next);
        i += 2; // skip past the consumed value
      } else {
        i += 1;
      }
    }
    return values;
  };

  const slot = get("--slot") as Slot | undefined;
  const prompt = get("--prompt");
  const output = get("--output");
  const errors: string[] = [];

  if (!slot) {
    errors.push(
      "--slot is required (hero | service | project | city | before-after)",
    );
  } else if (!Object.keys(SLOT_ASPECT).includes(slot)) {
    errors.push(
      `--slot must be one of: ${Object.keys(SLOT_ASPECT).join(" | ")}`,
    );
  }

  if (!prompt) errors.push("--prompt is required");
  if (!output) errors.push("--output is required (filename without extension)");

  if (errors.length > 0) {
    console.error(`\nErrors:\n${errors.map((e) => `  • ${e}`).join("\n")}`);
    process.exit(1);
  }

  // Narrows the three required args for the rest of the function. The block
  // above has already exited if any is missing; process.exit returns never,
  // so this is what lets TypeScript see that.
  if (!slot || !prompt || !output) process.exit(1);

  const aspectArg = get("--aspect");
  if (aspectArg && !VALID_ASPECTS.includes(aspectArg as AspectRatio)) {
    console.error(`--aspect must be one of: ${VALID_ASPECTS.join(" | ")}`);
    process.exit(1);
  }

  const defaultResolution = SLOT_DEFAULT_RESOLUTION[slot];
  const resolution = (get("--resolution") ?? defaultResolution) as Resolution;
  if (!VALID_RESOLUTIONS.includes(resolution)) {
    console.error(
      `--resolution must be one of: ${VALID_RESOLUTIONS.join(" | ")}`,
    );
    process.exit(1);
  }

  const format = (get("--format") ?? "jpg") as OutputFormat;
  if (!VALID_FORMATS.includes(format)) {
    console.error(`--format must be one of: ${VALID_FORMATS.join(" | ")}`);
    process.exit(1);
  }

  const logoUrl = get("--logo-url");
  const referenceUrls = getAll("--reference-url");
  const totalRefs = (logoUrl ? 1 : 0) + referenceUrls.length;
  if (totalRefs > MAX_REFERENCE_IMAGES) {
    console.error(
      `Too many reference images (${totalRefs}). KIE caps at ${MAX_REFERENCE_IMAGES} ` +
        "(1 logo + 7 additional references max).",
    );
    process.exit(1);
  }

  return {
    slot,
    name: get("--name"),
    prompt,
    output,
    logoUrl,
    referenceUrls,
    model: (get("--model") ?? "nano-banana-pro") as KieModel,
    resolution,
    aspect: aspectArg as AspectRatio | undefined,
    format,
    googleSearch: args.includes("--google-search"),
  };
}

// ---- Main -------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const {
    slot,
    name,
    prompt,
    output,
    logoUrl,
    referenceUrls,
    model,
    resolution,
    aspect,
    format,
    googleSearch,
  } = args;

  const aspectRatio = aspect ?? SLOT_ASPECT[slot];
  // fileURLToPath handles Windows correctly (avoids leading slash on /C:/...);
  // import.meta.url alone breaks cross-platform path resolution.
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const destPath = path.resolve(
    scriptDir,
    "../public/images",
    `${output}.${format}`,
  );

  const slotLabel = name ? `${slot}/${name}` : slot;
  const allReferences = [logoUrl, ...referenceUrls].filter((u): u is string =>
    Boolean(u),
  );

  console.log(`\nKIE Image Generator`);
  console.log(`  Slot:          ${slotLabel}`);
  console.log(`  Model:         ${model}`);
  console.log(`  Aspect:        ${aspectRatio}`);
  console.log(`  Resolution:    ${resolution}`);
  console.log(`  Format:        ${format}`);
  console.log(`  Google search: ${googleSearch ? "yes" : "no"}`);
  console.log(
    `  References:    ${allReferences.length}/${MAX_REFERENCE_IMAGES}`,
  );
  for (const [i, url] of allReferences.entries()) {
    const label = i === 0 && logoUrl ? "logo" : `ref ${i}`;
    console.log(`    [${label}] ${url}`);
  }
  console.log(`  Output:        ${destPath}`);
  console.log(
    `  Prompt:        ${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}`,
  );
  console.log();

  // 1. Submit job — route by model. flux-kontext uses a separate endpoint
  //    and accepts only ONE inputImage (the most important reference).
  console.log("Submitting to KIE...");
  let taskId: string;
  let imageUrls: string[];
  const startedAt = Date.now();

  if (isFluxKontextModel(model)) {
    if (allReferences.length > 1) {
      console.log(
        `  Note: flux-kontext accepts only 1 reference. Using the first ` +
          `(${allReferences.length - 1} additional reference${allReferences.length === 2 ? "" : "s"} dropped).`,
      );
    }
    taskId = await submitFluxKontext(
      prompt,
      model as "flux-kontext-pro" | "flux-kontext-max",
      toFluxAspectRatio(aspectRatio),
      format,
      allReferences[0],
    );
    console.log(`Task ID: ${taskId}`);
    console.log(`Generating (${model} typically takes 20-60s)...`);
    let lastState = "";
    imageUrls = await pollFluxKontextUntilDone(taskId, (state) => {
      if (state !== lastState) {
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        console.log(`  → ${state} [${elapsed}s elapsed]`);
        lastState = state;
      }
    });
  } else {
    taskId = await submit(
      prompt,
      model,
      aspectRatio,
      resolution,
      format,
      allReferences.length > 0 ? allReferences : undefined,
      googleSearch,
    );
    console.log(`Task ID: ${taskId}`);
    const expectedTime = isFastModel(model) ? "5-30s" : "30-120s";
    console.log(`Generating (${model} typically takes ${expectedTime})...`);
    let lastState = "";
    imageUrls = await pollUntilDone(taskId, (state, progress) => {
      if (state !== lastState) {
        const pct = progress != null ? ` (${progress}%)` : "";
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        console.log(`  → ${state}${pct} [${elapsed}s elapsed]`);
        lastState = state;
      }
    });
  }

  // 3. Download first image with integrity verification.
  // KIE returns one URL per generation by default; if multiple are returned in
  // the future (e.g., variant batching), surface the count so we can expose it.
  if (imageUrls.length > 1) {
    console.log(
      `\nNote: KIE returned ${imageUrls.length} variants — using the first. ` +
        `Other URLs:\n  ${imageUrls.slice(1).join("\n  ")}`,
    );
  }
  const imageUrl = imageUrls[0];
  if (imageUrl === undefined) {
    console.error("\nKIE reported success but returned no image URL.");
    process.exit(1);
  }
  console.log(`\nDownloading from: ${imageUrl}`);
  const {
    bytes,
    savedPath,
    format: savedFormat,
  } = await downloadImage(imageUrl, destPath, format);
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  const sizeKb = Math.round(bytes / 1024);

  const publicPath = `/images/${output}.${savedFormat}`;
  console.log(`\n✓ Saved: ${savedPath}`);
  console.log(`  Size:        ${sizeKb} KB`);
  console.log(`  Total time:  ${elapsed}s`);
  console.log(`  Public path: ${publicPath}`);
  console.log(
    `\nNext: verify the image at ${savedPath} matches the brand and the scene.`,
  );
  console.log(
    `If quality is below bar, regenerate with refined prompt or add references.`,
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ Error: ${message}`);
  process.exit(1);
});
