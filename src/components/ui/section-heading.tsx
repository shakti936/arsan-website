import { cn } from "@/lib/cn";

/** Direction A heading with the short brass rule beneath */
export function SectionHeading({
  children,
  tone = "navy",
  className,
}: {
  children: React.ReactNode;
  tone?: "navy" | "light";
  className?: string;
}) {
  return (
    <div className={className}>
      <h2
        className={cn(
          "font-display text-heading font-semibold text-balance",
          tone === "navy" ? "text-navy-900" : "text-white-warm",
        )}
      >
        {children}
      </h2>
      <div aria-hidden="true" className="mt-3 h-0.5 w-10 bg-brass-500" />
    </div>
  );
}
