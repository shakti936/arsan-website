import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * The logo is the supplied artwork (`refs/dirA-logo-lockup.png`), used whole.
 *
 * `variant="lockup"` is the complete image — wordmark and the two-line
 * descriptor beneath it — nothing cropped out. `variant="wordmark"` is ARSAN
 * alone, which is what the footer asks for.
 *
 * **Colour variants, not a CSS filter.** The source is grayscale + alpha: the
 * shape lives in the alpha channel, so each variant is that mask filled with a
 * surface colour. Inverting the black artwork instead would also invert how its
 * anti-aliased edges meet the ground and fringe the letterforms.
 *
 *   magick refs/dirA-logo-lockup.png -trim +repage \
 *     -alpha extract -write mpr:m +delete -size WxH xc:'#fefefa' \
 *     mpr:m -alpha off -compose CopyOpacity -composite -resize 1100x
 *
 * **Known gap (SOP Q-19):** the descriptor is baked into the artwork in
 * English, so `/es` shows an English descriptor under the mark. A Spanish
 * lockup needs to come from whoever produced the original — it can't be
 * cropped or re-set here without altering the supplied asset.
 */
type LogoProps = {
  /** "light" renders for dark surfaces (header/footer on navy) */
  tone?: "light" | "dark";
  /** "lockup" is the full artwork; "wordmark" is ARSAN alone */
  variant?: "lockup" | "wordmark";
  /** Rendered width in px */
  width?: number;
  className?: string;
};

/** Intrinsic ratios of the two trimmed assets. */
const RATIO = { lockup: 361 / 1350, wordmark: 223 / 1350 } as const;

export function Logo({
  tone = "light",
  variant = "lockup",
  width = 190,
  className,
}: LogoProps) {
  const shade = tone === "light" ? "cream" : "navy";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex focus-visible:outline-2 focus-visible:outline-offset-4",
        tone === "light"
          ? "focus-visible:outline-brass-300"
          : "focus-visible:outline-brass-500",
        className,
      )}
    >
      <Image
        src={`/logo/arsan-${variant}-${shade}.png`}
        alt={
          variant === "lockup"
            ? "ARSAN — Executive Search & Manufacturing Talent Advisory"
            : "ARSAN"
        }
        width={width}
        height={Math.round(width * RATIO[variant])}
        priority
        sizes={`${width}px`}
      />
    </Link>
  );
}
