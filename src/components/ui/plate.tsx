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
 * Pass `src` and the photograph takes over: refs/dirA-home-v2.png and
 * refs/dirA-meganav-all-panels.png show plain, full-colour photographs in these
 * slots, so a photographed plate drops the grid, the ticks and all but a
 * whisper of navy. The drawing treatment is what an *empty* plate renders — it
 * exists to keep an unphotographed slot from reading as a grey box.
 *
 * `overlay="heavy"` is for the rare plate that carries type over the image.
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

/**
 * Fades the orthographic grid out toward the plate's edges.
 * design-system-ignore: a mask, not a colour — #000 is opacity 1 here.
 */
const GRID_MASK =
  "radial-gradient(130% 100% at 30% 20%, #000 10%, transparent 82%)";

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
                  : "linear-gradient(150deg, color-mix(in oklab, var(--color-navy-800) 6%, transparent) 0%, color-mix(in oklab, var(--color-navy-950) 14%, transparent) 100%)",
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
      {!src && (
        <>
          {/* orthographic grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(242,239,236,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,239,236,.5) 1px, transparent 1px)",
              backgroundSize: `${grid} ${grid}`,
              maskImage: GRID_MASK,
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
        </>
      )}
      {children}
    </div>
  );
}
