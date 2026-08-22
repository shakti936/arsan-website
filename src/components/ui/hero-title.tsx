import { cn } from "@/lib/cn";

/**
 * Hero headline with one phrase set in brass italic — the treatment every
 * headline carries in refs/dirA-home-v2.png.
 *
 * The emphasis is a substring of the headline rather than a separate slot, so
 * a translator moves the phrase by writing the sentence, not by splitting it
 * into three keys that then have to be reassembled in the right order. If the
 * phrase isn't found — a typo, or a locale that phrased it differently — the
 * headline renders plain rather than disappearing.
 */
export function HeroTitle({
  text,
  emphasis,
  className,
}: {
  text: string;
  /** A phrase inside `text` to set in brass italic. */
  emphasis?: string;
  className?: string;
}) {
  const base = cn(
    "font-display font-semibold text-white-warm text-balance",
    className,
  );
  const at = emphasis ? text.indexOf(emphasis) : -1;

  if (at < 0 || !emphasis) return <h1 className={base}>{text}</h1>;

  return (
    <h1 className={base}>
      {text.slice(0, at)}
      <em className="font-medium text-brass-400">{emphasis}</em>
      {text.slice(at + emphasis.length)}
    </h1>
  );
}
