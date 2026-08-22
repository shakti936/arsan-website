import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import {
  flattenStrings,
  hash,
  type TranslationState,
  verdict,
} from "@/sanity/lib/translation-state";
import { COPY_NAMESPACES } from "@/sanity/schema/copy/namespaces";

/**
 * Fills in the Spanish for a page-copy document from its English.
 *
 * **Why this takes a document id and nothing else.** The obvious shape for a
 * translation endpoint is "send text, get text back", and it is the wrong one
 * here: it turns a route on a public marketing site into a free translation
 * API that any passer-by can bill to our Anthropic account. Taking only an id,
 * validating it against the generated namespace map, and reading the English
 * out of our own dataset means the only thing a caller can ask for is a
 * retranslation of copy we already own.
 *
 * That, combined with the staleness check, is what makes the endpoint cheap to
 * leave exposed: a repeat call translates nothing, because nothing has
 * changed, and returns before it ever reaches Anthropic. Making it expensive
 * requires first editing the English, which requires Studio credentials.
 */
export const runtime = "nodejs";

/** Bulk, well-specified work with a fixed output shape — Sonnet's zone. */
const MODEL = "claude-sonnet-5";
/** Large enough to keep calls few, small enough that a response stays reliable. */
const CHUNK = 50;

const SYSTEM = `You translate website copy for ARSAN Consulting Group, an executive search and manufacturing talent advisory firm operating in the United States and Mexico.

Translate from English into Spanish for a MEXICAN business audience.

Rules:
- Register: formal, professional, usted. The readers are senior executives and HR leaders.
- Mexican Spanish, not Castilian. No vosotros. Avoid regionalisms from Spain.
- Keep it tight. Spanish runs longer than English; this copy sits in a fixed layout, so prefer the shorter faithful phrasing over the literal one.
- Never translate: "ARSAN", proper nouns, company names, or people's names.
- Preserve ICU placeholders EXACTLY as written, including braces: {count}, {name}, {year}.
- Preserve any markup tags EXACTLY, including their names: <b>, </b>, <link>, </link>.
- Preserve leading/trailing whitespace and terminal punctuation.
- Translate the meaning, not the words. This is marketing copy — it must read as though written in Spanish, not translated into it.

You receive a JSON object mapping keys to English strings. Return ONLY a JSON object with the SAME keys mapping to the Spanish. No commentary, no code fences.`;

type Tree = { [key: string]: unknown };

async function translateChunk(
  entries: [string, string][],
  apiKey: string,
): Promise<Record<string, string>> {
  const payload = Object.fromEntries(entries);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(payload, null, 1) }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic ${response.status}: ${detail.slice(0, 300)}`);
  }

  const body = (await response.json()) as { content?: { text?: string }[] };
  const text = body.content?.map((block) => block.text ?? "").join("") ?? "";
  // tolerate a stray code fence even though the prompt forbids one
  const json = text
    .trim()
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(`model did not return JSON: ${json.slice(0, 200)}`);
  }
  if (!parsed || typeof parsed !== "object")
    throw new Error("model returned a non-object");
  return parsed as Record<string, string>;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!apiKey || !token) {
    return NextResponse.json(
      {
        error:
          "Translation is not configured. Set ANTHROPIC_API_KEY and SANITY_API_WRITE_TOKEN on the server.",
      },
      { status: 503 },
    );
  }

  let documentId: unknown;
  try {
    ({ documentId } = (await request.json()) as { documentId?: unknown });
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  // the whitelist: only documents this site generated are translatable
  if (typeof documentId !== "string" || !(documentId in COPY_NAMESPACES)) {
    return NextResponse.json(
      { error: "Unknown copy document." },
      { status: 400 },
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  /**
   * Fetch BOTH, whole.
   *
   * The draft is what the editor is looking at and so is what gets translated,
   * but the published document is needed too: if there is no draft yet, the
   * one we create has to be a fork of what is live. Creating a bare draft and
   * patching only Spanish into it would leave a document whose English is
   * missing entirely — and publishing that would wipe the page.
   */
  const [draft, published] = await Promise.all([
    client.getDocument(`drafts.${documentId}`),
    client.getDocument(documentId),
  ]);
  const doc = (draft ?? published) as
    | { copy?: { en?: Tree; es?: Tree }; translationState?: string }
    | undefined;

  if (!doc?.copy?.en) {
    return NextResponse.json(
      { error: "Document has no English copy." },
      { status: 404 },
    );
  }

  let state: TranslationState = {};
  try {
    state = doc.translationState
      ? (JSON.parse(doc.translationState) as TranslationState)
      : {};
  } catch {
    // unparseable bookkeeping means we cannot prove anything was machine-written,
    // so every existing translation is treated as a human's and left alone
    state = {};
  }

  const english = flattenStrings(doc.copy.en);
  const spanish = flattenStrings(doc.copy.es ?? {});

  const todo: [string, string][] = [];
  const counts = { current: 0, handEdited: 0, missing: 0, stale: 0 };
  for (const [path, source] of Object.entries(english)) {
    const call = verdict(source, spanish[path], state[path]);
    if (call.action === "translate") {
      counts[call.reason] += 1;
      todo.push([path, source]);
    } else if (call.reason === "hand-edited") counts.handEdited += 1;
    else if (call.reason === "current") counts.current += 1;
  }

  if (!todo.length) {
    return NextResponse.json({ translated: 0, ...counts });
  }

  const patch: Record<string, string> = {};
  const nextState: TranslationState = { ...state };

  try {
    for (let i = 0; i < todo.length; i += CHUNK) {
      const chunk = todo.slice(i, i + CHUNK);
      const result = await translateChunk(chunk, apiKey);
      for (const [path, source] of chunk) {
        const translated = result[path];
        if (typeof translated !== "string" || !translated.trim()) continue;
        patch[`copy.es.${path}`] = translated;
        nextState[path] = { src: hash(source), out: hash(translated) };
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed." },
      { status: 502 },
    );
  }

  const written = Object.keys(patch).length;
  if (written) {
    // patch the DRAFT, so the editor reviews the Spanish before it goes live
    const tx = client.transaction();
    if (!draft) {
      if (!published) {
        return NextResponse.json(
          { error: "Document not found." },
          { status: 404 },
        );
      }
      tx.createIfNotExists({ ...published, _id: `drafts.${documentId}` });
    }
    await tx
      .patch(`drafts.${documentId}`, (p) =>
        p.set({ ...patch, translationState: JSON.stringify(nextState) }),
      )
      .commit({ visibility: "async" });
  }

  return NextResponse.json({ translated: written, ...counts });
}
