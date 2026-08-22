import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Renders article prose, resolving the one inline construct the content
 * modules use: `[label](/path)`.
 *
 * Links inside a sentence are the ones that carry weight, both for a reader
 * deciding what to do next and for search. A rail of related links under the
 * article is not the same thing. Everything else is plain text — no bold, no
 * nesting — because each construct added here is one a translator can break
 * silently, and a malformed one would render as literal brackets rather than
 * throw.
 */
const LINK = /\[([^\]]+)\]\((\/[^)]*)\)/g;

export function ProseText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK)) {
    const [raw, label, href] = match;
    const at = match.index;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <Link
        key={`${href}-${at}`}
        href={href as Parameters<typeof Link>[0]["href"]}
        className="text-navy-900 underline decoration-brass-500 decoration-2 underline-offset-4 transition-colors hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500"
      >
        {label}
      </Link>,
    );
    cursor = at + raw.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <p className={cn(className)}>{parts}</p>;
}
