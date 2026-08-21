import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ArrowLinkProps = {
  href: Parameters<typeof Link>[0]["href"];
  children: React.ReactNode;
  tone?: "navy" | "brass" | "light";
  className?: string;
};

/**
 * The arrow sits INSIDE the text flow (not as a flex sibling) so that when the
 * label wraps it stays glued to the last word rather than floating to the
 * right of the whole block.
 */
export function ArrowLink({
  href,
  children,
  tone = "navy",
  className,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "eyebrow group inline-block min-h-11 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
        tone === "navy" &&
          "text-navy-900 hover:text-brass-600 focus-visible:outline-brass-500",
        tone === "brass" &&
          "text-brass-600 hover:text-navy-900 focus-visible:outline-brass-500",
        tone === "light" &&
          "text-cream-50 hover:text-brass-300 focus-visible:outline-brass-300",
        className,
      )}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="ml-2 inline-block h-3.5 w-3.5 align-[-0.15em] transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <title />
        <path d="M1 8h13M9.5 3.5 14 8l-4.5 4.5" strokeLinecap="square" />
      </svg>
    </Link>
  );
}
