import { Icon } from "@sanity/icons";
import { useCallback, useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

/**
 * "Translate to Spanish" on every page-copy document.
 *
 * The editor writes English and presses this. The work happens server-side —
 * the browser never sees the Anthropic key and never sends it any text; it
 * sends a document id, and the route reads the English out of the dataset
 * itself.
 *
 * Spanish lands in the DRAFT, so it is reviewed like any other edit before it
 * goes live. Strings a human has edited are never overwritten; the rule lives
 * in `translation-state.ts`.
 *
 * Results are reported in the action's own dialog rather than a toast: the
 * summary distinguishes "translated 14" from "left 3 alone because you wrote
 * them", which is worth reading rather than glimpsing. (`useToast` is also
 * untypeable in @sanity/ui 4.0.6 — its `ToastContextValue` is declared
 * `never`, so the hook appears to return nothing callable.)
 */
type Result = {
  translated?: number;
  current?: number;
  handEdited?: number;
  missing?: number;
  stale?: number;
  error?: string;
};

function summarise(result: Result): string {
  const {
    translated = 0,
    current = 0,
    handEdited = 0,
    missing = 0,
    stale = 0,
  } = result;
  const plural = (n: number, word: string) =>
    `${n} ${word}${n === 1 ? "" : "s"}`;

  if (!translated) {
    const parts = [`${plural(current, "string")} already current`];
    if (handEdited)
      parts.push(`${plural(handEdited, "string")} written by hand`);
    return `Nothing needed translating — ${parts.join(", ")}.`;
  }

  const why: string[] = [];
  if (missing) why.push(`${plural(missing, "string")} had no Spanish`);
  if (stale) why.push(`${plural(stale, "string")} changed in English`);

  const parts = [`Translated ${plural(translated, "string")} into the draft`];
  if (why.length) parts.push(`(${why.join("; ")})`);
  const tail = handEdited
    ? ` ${plural(handEdited, "string")} you edited by hand were left alone.`
    : "";
  return `${parts.join(" ")}.${tail} Review the Spanish, then publish.`;
}

/**
 * @sanity/icons 5 dropped its named icon exports (`TranslateIcon` and friends)
 * in favour of one `Icon` component and a symbol registry. The package's types
 * resolve loosely enough that importing a name that no longer exists still
 * typechecks — it fails at bundle time instead.
 */
const TranslateIcon = () => <Icon symbol="translate" />;

export const translateAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { id, onComplete } = props;
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const close = useCallback(() => {
    setReport(null);
    onComplete();
  }, [onComplete]);

  const onHandle = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/studio/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ documentId: id }),
      });
      const result = (await response.json()) as Result;
      setReport(
        response.ok
          ? { ok: true, message: summarise(result) }
          : {
              ok: false,
              message:
                result.error ?? `The server returned ${response.status}.`,
            },
      );
    } catch (error) {
      setReport({
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "The request did not complete.",
      });
    } finally {
      setBusy(false);
    }
  }, [id]);

  return {
    label: busy ? "Translating…" : "Translate to Spanish",
    icon: TranslateIcon,
    disabled: busy,
    onHandle,
    dialog: report !== null && {
      type: "dialog" as const,
      onClose: close,
      header: report.ok ? "Spanish updated" : "Translation failed",
      content: (
        <div
          style={{ padding: "1rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}
        >
          {report.message}
        </div>
      ),
    },
  };
};
