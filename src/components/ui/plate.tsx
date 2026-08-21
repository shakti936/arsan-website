import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * "Plate" — the site's image-slot treatment.
 *
 * Every media surface (hero panel, card thumbnail, featured case) is a plate:
 * deep navy ground, a fine orthographic grid, corner registration ticks and a
 * warm brass light — the visual language of an engineering drawing, which is
 * what ARSAN's clients actually work from.
 *
 * Pass `src` and a plate becomes a frame: the photograph sits underneath and
 * the ticks, grid and grain stay on top, so a photographed plate still belongs
 * to the same world as an empty one. Without `src` it renders the pure CSS
 * treatment — no image request, no layout shift.
 *
 * `overlay="heavy"` is for plates that carry text (the home hero); it darkens
 * the photograph enough to hold contrast against cream type.
 */
type PlateBase = {
  /** Varies grid scale and light position so repeated plates don't twin. */
  variant?: "a" | "b" | "c";
  /** How far the navy scrim is pushed. "heavy" when type sits on the plate. */
  overlay?: "light" | "heavy";
  className?: string;
  children?: React.ReactNode;
};

type PlateProps = PlateBase &
  (
    | { src: string; alt: string; priority?: boolean; sizes?: string }
    | { src?: never; alt?: never; priority?: never; sizes?: never }
  );

export function Plate({
  variant = "a",
  overlay = "light",
  src,
  alt,
  priority,
  sizes = "(min-width: 768px) 33vw, 100vw",
  className,
  children,
}: PlateProps) {
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
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
          {/* navy scrim — keeps photographs inside the palette, and holds
              contrast for any type the plate carries */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                overlay === "heavy"
                  ? "linear-gradient(150deg, color-mix(in oklab, var(--color-navy-900) 58%, transparent) 0%, color-mix(in oklab, var(--color-navy-950) 80%, transparent) 100%)"
                  : "linear-gradient(150deg, color-mix(in oklab, var(--color-navy-800) 34%, transparent) 0%, color-mix(in oklab, var(--color-navy-950) 52%, transparent) 100%)",
            }}
          />
        </>
      ) : (
        /* warm light — the empty plate's own ground */
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% ${light}, color-mix(in oklab, var(--color-brass-500) 26%, transparent) 0%, transparent 58%), linear-gradient(150deg, var(--color-navy-800) 0%, var(--color-navy-950) 78%)`,
          }}
        />
      )}
      {/* orthographic grid — recedes over a photograph so it reads as
          registration, not texture */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          src ? "opacity-[0.07]" : "opacity-[0.18]",
        )}
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
