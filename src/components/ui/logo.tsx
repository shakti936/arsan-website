import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import lockupCream from "../../../public/logo/arsan-lockup-cream.png";
import lockupNavy from "../../../public/logo/arsan-lockup-navy.png";
import wordmarkCream from "../../../public/logo/arsan-wordmark-cream.png";
import wordmarkNavy from "../../../public/logo/arsan-wordmark-navy.png";

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

/**
 * Imported rather than referenced by path, so the intrinsic size comes from
 * the files themselves. It used to be a hand-written ratio taken from the
 * 1350px source artwork, while the exported assets are 1100 and 900 wide with
 * ratios that differ in the third decimal — enough that `next/image` warned
 * about a mismatched box on every page of the site, and enough to reserve
 * slightly the wrong space before the image loads. A re-export now corrects
 * itself; a constant would have to be remembered.
 */
const ASSETS: Record<string, StaticImageData> = {
  "lockup-cream": lockupCream,
  "lockup-navy": lockupNavy,
  "wordmark-cream": wordmarkCream,
  "wordmark-navy": wordmarkNavy,
};

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
        src={ASSETS[`${variant}-${shade}`] ?? lockupCream}
        alt={
          variant === "lockup"
            ? "ARSAN — Executive Search & Manufacturing Talent Advisory"
            : "ARSAN"
        }
        priority
        sizes={`${width}px`}
        // the file carries the intrinsic size; this sets the rendered one, and
        // `height: auto` is what keeps the ratio honest at any width
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
