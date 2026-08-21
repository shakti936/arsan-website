import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: React.ReactNode;
  /** Seconds per loop */
  duration?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right" | "up" | "down";
  /** Fade the edges with a mask */
  fade?: boolean;
  /** Fade depth as a percentage of the container */
  fadeAmount?: number;
  className?: string;
  /** Gap classes applied inside each copy, e.g. "gap-16 pr-16" */
  copyClassName?: string;
};

/**
 * Adapted from a 21st.dev marquee (see docs/sop/06-prompts.md):
 * keyframes live in globals.css (the original injected an unscoped <style>
 * per instance, so two marquees overwrote each other), hover-pause is CSS
 * (no client JS), the duplicate copy is aria-hidden, and the animation
 * fully disables under prefers-reduced-motion via the global reset.
 */
export function Marquee({
  children,
  duration = 30,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 10,
  className,
  copyClassName = "gap-16 pr-16",
}: MarqueeProps) {
  const vertical = direction === "up" || direction === "down";
  const reverse = direction === "right" || direction === "down";

  const mask = fade
    ? `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
    : undefined;

  const copy = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center",
        vertical && "flex-col",
        copyClassName,
      )}
    >
      {children}
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden",
        vertical && "h-full flex-col",
        pauseOnHover && "marquee-hover-pause",
        className,
      )}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        className={cn(
          "marquee-track flex w-max shrink-0",
          vertical && "h-max w-full flex-col",
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-anim": vertical ? "marquee-y" : "marquee-x",
            "--marquee-dir": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
