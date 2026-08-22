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
 *
 * **The size is a role, not a class.** This used to take `className` and every
 * caller passed `text-display-xl`, which is how the home hero and every page
 * hero ended up identical: the distinction existed in the design and had
 * nowhere to live in the code. A caller now says what kind of H1 this is and
 * the scale decides how big that is.
 */
const ROLE = {
  /** The persuasion moment — the home hero. */
  headline: "text-headline",
  /** The H1 of a page that is about something. Every other hero. */
  title: "text-title",
} as const;

export function HeroTitle({
  text,
  emphasis,
  role,
  className,
}: {
  text: string;
  /** A phrase inside `text` to set in brass italic. */
  emphasis?: string;
  role: keyof typeof ROLE;
  /** Position and colour only — never a size. */
  className?: string;
}) {
  const base = cn(
    "font-display font-semibold text-white-warm text-balance",
    ROLE[role],
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
