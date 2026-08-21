import fs from "node:fs/promises";
import path from "node:path";

// ---- Types ------------------------------------------------------------------

/**
 * KIE-hosted image generation models.
 *
 * `nano-banana-pro` / `nano-banana-2` route to `/jobs/createTask` and accept
 * up to 8 reference images (`image_input[]`) — best when multi-ref brand
 * grounding matters.
 *
 * `flux-kontext-pro` / `flux-kontext-max` route to the SEPARATE
 * `/api/v1/flux/kontext/generate` endpoint and accept a SINGLE
 * `inputImage` for cross-batch subject consistency (e.g., generating a
 * coherent team batch using one founder portrait as the style anchor).
 * Different response shape — `successFlag` integer instead of `state`
 * string, result at `data.response.resultImageUrl`.
 */
export type KieModel =
  | "nano-banana-pro"
  | "nano-banana-2"
  | "flux-kontext-pro"
  | "flux-kontext-max"
  | "gpt-image-1.5"
  | (string & {});

/** Models routed through the dedicated Flux Kontext endpoint. */
export function isFluxKontextModel(model: string): boolean {
  return model === "flux-kontext-pro" || model === "flux-kontext-max";
}

/**
 * Full nano-banana-pro aspect ratio set per KIE OpenAPI spec.
 * Earlier nano-banana-2 supported a narrower set; the broader list is
 * forward-compatible with nano-banana-pro and degrades gracefully on
 * older models (KIE returns 422 if the model can't honor the ratio).
 */
export type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9"
  | "auto";

export type OutputFormat = "jpg" | "png";
export type Resolution = "1K" | "2K" | "4K";
type TaskState = "waiting" | "queuing" | "generating" | "success" | "fail";

/** KIE caps reference image arrays at 8 per task. Enforce client-side
 *  so the error surfaces before submission rather than as a 422. */
export const MAX_REFERENCE_IMAGES = 8;

interface SubmitInput {
  prompt: string;
  aspect_ratio: AspectRatio;
  resolution?: Resolution;
  output_format?: OutputFormat;
  image_input?: string[];
  // Flux-2 takes references via input_urls (not image_input).
  input_urls?: string[];
  // Imagen 4 supports a negative_prompt; nano-banana models do not.
  negative_prompt?: string;
  google_search?: boolean;
}

interface SubmitBody {
  model: KieModel;
  input: SubmitInput;
  callBackUrl?: string;
}

interface SubmitResponse {
  code: number;
  msg?: string;
  data: { taskId: string };
}

// resultJson is a JSON-encoded string: { resultUrls: string[] }
interface ResultJson {
  resultUrls?: string[];
}

interface PollData {
  taskId: string;
  state: TaskState;
  progress?: number;
  resultJson?: string;
  failMsg?: string;
  failCode?: string;
}

interface PollResponse {
  code: number;
  msg?: string;
  data: PollData;
}

// ---- Constants --------------------------------------------------------------

const KIE_BASE = "https://api.kie.ai/api/v1";
const POLL_INITIAL_MS = 3_000;
const POLL_MAX_MS = 30_000;
// 40 attempts × 1.5x backoff capped at 30s sums to ~10 minutes. nano-banana-pro
// at 4K can run the full window; nano-banana-2 typically completes in <30s.
const POLL_MAX_ATTEMPTS = 40;

// ---- Helpers ----------------------------------------------------------------

function getApiKey(): string {
  const key = process.env.KIE_API_KEY;
  if (!key) {
    throw new Error(
      "KIE_API_KEY is not set. Add it to .env.local:\n  KIE_API_KEY=your_key_here",
    );
  }
  return key;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

function parseResultJson(raw: string | undefined): ResultJson {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ResultJson;
  } catch {
    return {};
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Public API -------------------------------------------------------------

export async function submit(
  prompt: string,
  model: KieModel,
  aspectRatio: AspectRatio,
  resolution: Resolution = "2K",
  outputFormat: OutputFormat = "jpg",
  imageInput?: string[],
  googleSearch?: boolean,
): Promise<string> {
  // Client-side validation — fail fast before the network round-trip.
  if (imageInput && imageInput.length > MAX_REFERENCE_IMAGES) {
    throw new Error(
      `Too many reference images (${imageInput.length}). KIE caps at ${MAX_REFERENCE_IMAGES}. ` +
        `Pass the most important ${MAX_REFERENCE_IMAGES} (logo first, then real client photos).`,
    );
  }
  if (imageInput) {
    for (const url of imageInput) {
      if (!/^https?:\/\//i.test(url)) {
        throw new Error(
          `Reference image must be an absolute http or https URL (got "${url}"). KIE ` +
            `cannot fetch local paths. Upload to a CDN (GHL, Vercel Blob) first.`,
        );
      }
    }
  }
  if (prompt.length > 10_000) {
    throw new Error(
      `Prompt exceeds KIE's 10,000-char limit (got ${prompt.length}). Trim it.`,
    );
  }

  // Per-model input schema. KIE's createTask `input` shape differs by model:
  //  - flux-2/*: references go in `input_urls`; resolution is 1K|2K only; no output_format.
  //  - google/imagen4*: TEXT-TO-IMAGE only — no references, no resolution/output_format,
  //    and a narrower aspect-ratio set.
  //  - nano-banana-*: `image_input`, resolution (incl. 4K), output_format, google_search.
  const isFlux2 = model.startsWith("flux-2");
  const isImagen = model.startsWith("google/imagen");

  let input: SubmitInput;
  if (isFlux2) {
    input = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: resolution === "4K" ? "2K" : resolution,
      ...(imageInput && imageInput.length > 0
        ? { input_urls: imageInput }
        : {}),
    };
  } else if (isImagen) {
    const IMAGEN_ASPECTS: AspectRatio[] = [
      "1:1",
      "16:9",
      "9:16",
      "3:4",
      "4:3",
      "auto",
    ];
    input = {
      prompt,
      aspect_ratio: IMAGEN_ASPECTS.includes(aspectRatio) ? aspectRatio : "16:9",
    };
  } else {
    input = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution,
      output_format: outputFormat,
      ...(imageInput && imageInput.length > 0
        ? { image_input: imageInput }
        : {}),
      ...(googleSearch ? { google_search: true } : {}),
    };
  }

  const body: SubmitBody = { model, input };

  const res = await fetch(`${KIE_BASE}/jobs/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIE submit failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as SubmitResponse;

  if (json.code !== 200) {
    // Map common KIE codes to actionable messages per the OpenAPI spec.
    const hint = (
      {
        401: "Check KIE_API_KEY in .env.local. Reset at https://kie.ai/api-key if leaked.",
        402: "Insufficient KIE credits. Top up at https://kie.ai/billing.",
        422: "Validation error — check aspect_ratio, resolution, or prompt format for the chosen model.",
        429: "Rate limited. Wait a minute and retry.",
        455: "KIE is in maintenance. Check https://status.kie.ai.",
        505: "This feature is currently disabled by KIE.",
      } as Record<number, string>
    )[json.code];
    throw new Error(
      `KIE submit error (code ${json.code}): ${json.msg ?? "unknown"}` +
        (hint ? `\n  Hint: ${hint}` : ""),
    );
  }

  return json.data.taskId;
}

export async function pollUntilDone(
  taskId: string,
  onProgress?: (state: TaskState, progress?: number) => void,
): Promise<string[]> {
  // Poll once immediately — fast Flash-model tasks may already be done by the
  // time the first poll fires, so no point sleeping the initial interval.
  let intervalMs = 0;
  let attempts = 0;

  while (attempts < POLL_MAX_ATTEMPTS) {
    if (intervalMs > 0) await sleep(intervalMs);
    attempts++;

    const res = await fetch(
      `${KIE_BASE}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      { headers: authHeaders() },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`KIE poll failed (${res.status}): ${text}`);
    }

    const json = (await res.json()) as PollResponse;

    if (json.code !== 200) {
      throw new Error(
        `KIE poll error (code ${json.code}): ${json.msg ?? "unknown"}`,
      );
    }

    const { state, progress, resultJson, failMsg, failCode } = json.data;

    onProgress?.(state, progress);

    if (state === "fail") {
      throw new Error(
        `KIE generation failed${failCode ? ` [${failCode}]` : ""}: ${failMsg ?? "no reason given"}\n` +
          `  Task ID: ${taskId}\n` +
          `  Last state: ${state}, progress: ${progress ?? "n/a"}\n` +
          `  Check dashboard at https://kie.ai/console for full task log.`,
      );
    }

    if (state === "success") {
      const parsed = parseResultJson(resultJson);
      const urls = parsed.resultUrls ?? [];
      if (urls.length === 0) {
        throw new Error(
          "KIE returned success but no URLs in resultJson.resultUrls",
        );
      }
      return urls;
    }

    // Back off, capped at POLL_MAX_MS. First non-zero interval is POLL_INITIAL_MS.
    intervalMs =
      intervalMs === 0
        ? POLL_INITIAL_MS
        : Math.min(intervalMs * 1.5, POLL_MAX_MS);
  }

  throw new Error(
    `KIE generation timed out after ${POLL_MAX_ATTEMPTS} attempts (~10 min). ` +
      "Check the KIE dashboard for task status.",
  );
}

/**
 * Minimum file size for a successfully-rendered KIE image. Anything below
 * this is almost certainly a truncated download or an error placeholder.
 * Empirically, even a 1K nano-banana-pro JPG comes back at 80-200KB.
 */
const MIN_IMAGE_BYTES = 20_000;

/** Magic-byte signatures for file integrity verification. */
const MAGIC_BYTES: Record<OutputFormat, Uint8Array> = {
  jpg: new Uint8Array([0xff, 0xd8, 0xff]),
  png: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
};

function _verifyMagicBytes(buffer: ArrayBuffer, format: OutputFormat): boolean {
  const expected = MAGIC_BYTES[format];
  const actual = new Uint8Array(buffer, 0, expected.length);
  for (let i = 0; i < expected.length; i++) {
    if (actual[i] !== expected[i]) return false;
  }
  return true;
}

/** Detect the actual encoded format from magic bytes. Models don't all honor
 *  the requested output_format — e.g. flux-2 returns PNG regardless — so we
 *  save by what was actually returned rather than what we asked for. */
function detectImageFormat(buffer: ArrayBuffer): "jpg" | "png" | "webp" | null {
  const b = new Uint8Array(buffer, 0, Math.min(12, buffer.byteLength));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return "png";
  if (
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  )
    return "webp";
  return null;
}

// ---- Flux Kontext (separate endpoint + response shape) ---------------------

/** Aspect ratios the flux-kontext endpoint accepts. Narrower set than
 *  nano-banana — KIE returns 422 for any other value. */
export type FluxKontextAspectRatio =
  | "21:9"
  | "16:9"
  | "4:3"
  | "1:1"
  | "3:4"
  | "9:16";

interface FluxKontextSubmitBody {
  prompt: string;
  model: "flux-kontext-pro" | "flux-kontext-max";
  aspectRatio?: FluxKontextAspectRatio;
  inputImage?: string;
  outputFormat?: "jpeg" | "png";
  enableTranslation?: boolean;
  promptUpsampling?: boolean;
  safetyTolerance?: number;
}

interface FluxKontextSubmitResponse {
  code: number;
  msg?: string;
  data: { taskId: string };
}

interface FluxKontextPollData {
  taskId: string;
  successFlag: 0 | 1 | 2 | 3; // 0=generating, 1=success, 2=create failed, 3=generate failed
  errorCode?: number;
  errorMessage?: string;
  response?: {
    originImageUrl?: string;
    resultImageUrl?: string;
  };
}

interface FluxKontextPollResponse {
  code: number;
  msg?: string;
  data: FluxKontextPollData;
}

/** Coerce a nano-banana-style aspect ratio to a flux-kontext-supported one.
 *  Unsupported values fall back to the closest match. */
export function toFluxAspectRatio(ratio: AspectRatio): FluxKontextAspectRatio {
  switch (ratio) {
    case "21:9":
    case "16:9":
    case "4:3":
    case "1:1":
    case "3:4":
    case "9:16":
      return ratio;
    case "3:2":
      return "4:3"; // closest landscape
    case "2:3":
    case "4:5":
      return "3:4"; // closest portrait
    case "5:4":
      return "4:3";
    default:
      return "16:9";
  }
}

export async function submitFluxKontext(
  prompt: string,
  model: "flux-kontext-pro" | "flux-kontext-max",
  aspectRatio: FluxKontextAspectRatio = "16:9",
  outputFormat: OutputFormat = "jpg",
  inputImage?: string,
): Promise<string> {
  if (inputImage && !/^https?:\/\//i.test(inputImage)) {
    throw new Error(
      `inputImage must be an absolute http/https URL (got "${inputImage}"). ` +
        "KIE cannot fetch local paths. Upload to a CDN first.",
    );
  }
  if (prompt.length > 10_000) {
    throw new Error(
      `Prompt exceeds KIE's 10,000-char limit (got ${prompt.length}). Trim it.`,
    );
  }

  const body: FluxKontextSubmitBody = {
    prompt,
    model,
    aspectRatio,
    outputFormat: outputFormat === "png" ? "png" : "jpeg",
    enableTranslation: false, // our prompts are already English
  };
  if (inputImage) body.inputImage = inputImage;

  const res = await fetch(`${KIE_BASE}/flux/kontext/generate`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIE flux-kontext submit failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as FluxKontextSubmitResponse;
  if (json.code !== 200) {
    throw new Error(
      `KIE flux-kontext submit error (code ${json.code}): ${json.msg ?? "unknown"}`,
    );
  }
  return json.data.taskId;
}

export async function pollFluxKontextUntilDone(
  taskId: string,
  onProgress?: (state: string) => void,
): Promise<string[]> {
  let intervalMs = 0;
  let attempts = 0;

  while (attempts < POLL_MAX_ATTEMPTS) {
    if (intervalMs > 0) await sleep(intervalMs);
    attempts++;

    const res = await fetch(
      `${KIE_BASE}/flux/kontext/record-info?taskId=${encodeURIComponent(taskId)}`,
      { headers: authHeaders() },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`KIE flux-kontext poll failed (${res.status}): ${text}`);
    }

    const json = (await res.json()) as FluxKontextPollResponse;
    if (json.code !== 200) {
      throw new Error(
        `KIE flux-kontext poll error (code ${json.code}): ${json.msg ?? "unknown"}`,
      );
    }

    const { successFlag, errorCode, errorMessage, response } = json.data;
    const stateLabel = (
      {
        0: "generating",
        1: "success",
        2: "create-fail",
        3: "generate-fail",
      } as const
    )[successFlag];
    onProgress?.(stateLabel);

    if (successFlag === 2 || successFlag === 3) {
      throw new Error(
        `KIE flux-kontext generation failed${errorCode ? ` [${errorCode}]` : ""}: ` +
          `${errorMessage ?? "no reason given"}\n` +
          `  Task ID: ${taskId}\n` +
          `  Check dashboard at https://kie.ai/console for full task log.`,
      );
    }

    if (successFlag === 1) {
      const url = response?.resultImageUrl;
      if (!url) {
        throw new Error(
          "KIE flux-kontext returned success but no resultImageUrl in response.",
        );
      }
      return [url];
    }

    intervalMs =
      intervalMs === 0
        ? POLL_INITIAL_MS
        : Math.min(intervalMs * 1.5, POLL_MAX_MS);
  }

  throw new Error(
    `KIE flux-kontext generation timed out after ${POLL_MAX_ATTEMPTS} attempts (~10 min). ` +
      "Check the KIE dashboard for task status.",
  );
}

export async function downloadImage(
  url: string,
  destPath: string,
  format: OutputFormat = "jpg",
): Promise<{ bytes: number; savedPath: string; format: string }> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download image (${res.status}): ${url}`);
  }

  const buffer = await res.arrayBuffer();

  if (buffer.byteLength < MIN_IMAGE_BYTES) {
    throw new Error(
      `Downloaded image is suspiciously small (${buffer.byteLength} bytes). ` +
        `KIE may have returned an error placeholder. URL: ${url}`,
    );
  }

  const actual = detectImageFormat(buffer);
  if (!actual) {
    throw new Error(
      `Downloaded file is not a recognized image (jpg/png/webp). URL: ${url}`,
    );
  }

  // Save by the ACTUAL returned format. Some models (flux-2) ignore the
  // requested output_format and return PNG — write the right extension so the
  // file is valid rather than a mislabeled .jpg.
  const savedPath =
    actual === format ? destPath : destPath.replace(/\.[^.]+$/, `.${actual}`);

  await fs.mkdir(path.dirname(savedPath), { recursive: true });
  await fs.writeFile(savedPath, Buffer.from(buffer));
  return { bytes: buffer.byteLength, savedPath, format: actual };
}
