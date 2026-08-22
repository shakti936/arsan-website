import Image from "next/image";

/**
 * The photographic ground every hero sits on, in one place so the home hero and
 * the twelve page heroes can't drift apart.
 *
 * Two scrims, not one. Below `lg` the copy crosses the middle of the frame, so
 * navy has to cover the whole band; from `lg` up it rakes off to the right and
 * lets the photograph read, which is what refs/dirA-home-v2.png does.
 *
 * The stops are tuned against the darkest text that sits on them — the copy
 * column ends at ~50% of the container, and the fade starts after it. Moving
 * them left puts body copy over lit parts of the photograph; the home hero's
 * subhead measured 3.63:1 before that was corrected.
 */
export function HeroBackdrop({
  src,
  priority,
  objectPosition = "70% 20%",
}: {
  src: string;
  priority?: boolean;
  /** Focal point at `lg` and up; narrow viewports always centre on 72%. */
  objectPosition?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="-z-10 object-cover object-[72%_center] lg:[object-position:var(--hero-pos)]"
        style={{ "--hero-pos": objectPosition } as React.CSSProperties}
      />
      {/* narrow viewports: the photograph is atmosphere, not subject — a
          portrait band can't both feature a subject and carry the copy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--color-navy-950) 86%, transparent) 0%, color-mix(in oklab, var(--color-navy-900) 88%, transparent) 100%)",
        }}
      />
      {/* lg and up: navy holds the copy column, then clears */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--color-navy-950) 98%, transparent) 0%, color-mix(in oklab, var(--color-navy-900) 95%, transparent) 44%, color-mix(in oklab, var(--color-navy-900) 58%, transparent) 55%, transparent 68%)",
        }}
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
    </>
  );
}
