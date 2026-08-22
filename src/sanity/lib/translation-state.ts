import { createHash } from "node:crypto";

/**
 * Bookkeeping that lets auto-translation refresh stale Spanish WITHOUT ever
 * overwriting Spanish a human wrote.
 *
 * Both halves matter and they are different questions:
 *
 *   `src` — a hash of the English this Spanish was translated from. If the
 *           English has changed since, the Spanish is stale.
 *   `out` — a hash of the Spanish the machine produced. If the Spanish no
 *           longer matches it, a person edited it by hand.
 *
 * With only `src` we would refresh stale copy and silently destroy every
 * correction an editor had made. With only `out` we could protect corrections
 * but would never notice the English had moved on. Both together give the one
 * rule that is actually correct: **regenerate what the machine wrote and the
 * author has since changed; never touch what a human wrote.**
 *
 * The catalogue Spanish seeded from `messages/es.json` is recorded here at
 * seed time, so editing an English string refreshes its Spanish, while a
 * hand-edit to that Spanish makes it permanently the editor's.
 */
export type TranslationRecord = { src: string; out: string };
export type TranslationState = Record<string, TranslationRecord>;

export function hash(value: string): string {
  return createHash("sha1").update(value).digest("base64url").slice(0, 16);
}

type Tree = { [key: string]: unknown };

/**
 * Every translatable string in a copy subtree, keyed by the Sanity patch path
 * that reaches it. Array members are addressed by index — `cards[0].title` —
 * which is what `patch().set()` expects.
 */
export function flattenStrings(
  value: unknown,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  if (typeof value === "string") {
    if (prefix && value.trim()) out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      flattenStrings(item, `${prefix}[${i}]`, out);
    });
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Tree)) {
      // `_key`, `_type` — Sanity bookkeeping, never display text
      if (k.startsWith("_")) continue;
      flattenStrings(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

/** What `es` should be for a given path, or `null` to leave it alone. */
export type Verdict =
  | { action: "translate"; reason: "missing" | "stale" }
  | { action: "skip"; reason: "current" | "hand-edited" | "no-source" };

export function verdict(
  english: string | undefined,
  spanish: string | undefined,
  record: TranslationRecord | undefined,
): Verdict {
  if (!english?.trim()) return { action: "skip", reason: "no-source" };
  if (!spanish?.trim()) return { action: "translate", reason: "missing" };
  // a person changed the Spanish — it is theirs now, whatever the English does
  if (!record || hash(spanish) !== record.out) {
    return { action: "skip", reason: "hand-edited" };
  }
  if (record.src !== hash(english))
    return { action: "translate", reason: "stale" };
  return { action: "skip", reason: "current" };
}
