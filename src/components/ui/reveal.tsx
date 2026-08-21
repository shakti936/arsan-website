import { cn } from "@/lib/cn";

/**
 * Shared scroll entrance — the single motion pattern for section content.
 *
 * CSS scroll-driven animation, not JS: content renders visible and the
 * reveal is added only where `animation-timeline: view()` is supported and
 * the visitor hasn't asked for reduced motion. Browsers without support (and
 * anyone with JS disabled) simply see the content, which is the point — the
 * previous motion/react version shipped `opacity: 0` in the server HTML.
 *
 * This is a Server Component: zero client JS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger in seconds; mapped to a scroll-range offset. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        delay
          ? ({
              "--reveal-offset": `${Math.round(delay * 100)}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
