import { cn } from "@/lib/cn";

/**
 * "Plate" — the site's image-slot treatment.
 *
 * Every media surface (hero panel, card thumbnail, featured case) is a plate:
 * deep navy ground, a fine orthographic grid, corner registration ticks and a
 * warm brass light — the visual language of an engineering drawing, which is
 * what ARSAN's clients actually work from.
 *
 * It exists because real photography hasn't been supplied yet (SOP Q-06) and a
 * grey box reads as unfinished. When photos arrive, a plate becomes the frame:
 * drop `<Image fill>` inside and keep the ticks and grain on top.
 *
 * Pure CSS/SVG — no image requests, no layout shift, nothing to optimise later.
 */
export function Plate({
  variant = "a",
  className,
  children,
}: {
  /** Varies grid scale and light position so repeated plates don't twin. */
  variant?: "a" | "b" | "c";
  className?: string;
  children?: React.ReactNode;
}) {
  const grid = { a: "28px", b: "22px", c: "34px" }[variant];
  const light = {
    a: "at 22% 18%",
    b: "at 74% 26%",
    c: "at 46% 12%",
  }[variant];

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-navy-900", className)}
    >
      {/* warm light */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% ${light}, color-mix(in oklab, var(--color-brass-500) 26%, transparent) 0%, transparent 58%), linear-gradient(150deg, var(--color-navy-800) 0%, var(--color-navy-950) 78%)`,
        }}
      />
      {/* orthographic grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(242,239,236,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,239,236,.5) 1px, transparent 1px)",
          backgroundSize: `${grid} ${grid}`,
          maskImage:
            "radial-gradient(130% 100% at 30% 20%, #000 10%, transparent 82%)",
        }}
      />
      {/* registration ticks — corner marks from engineering drawings */}
      <div aria-hidden="true" className="absolute inset-0">
        {[
          "left-3.5 top-3.5 border-l border-t",
          "right-3.5 top-3.5 border-r border-t",
          "bottom-3.5 left-3.5 border-b border-l",
          "bottom-3.5 right-3.5 border-b border-r",
        ].map((corner) => (
          <span
            key={corner}
            className={cn("absolute h-5 w-5 border-brass-400/50", corner)}
          />
        ))}
      </div>
      {/* grain */}
      <div aria-hidden="true" className="grain absolute inset-0" />
      {children}
    </div>
  );
}
