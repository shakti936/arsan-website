import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * The wordmark is the supplied artwork (`refs/dirA-logo-lockup.png`), not type
 * we set ourselves.
 *
 * **Only the wordmark, though.** The supplied lockup has the two-line
 * descriptor baked in, in English, which would put English under the mark on
 * every Spanish page. The artwork is cropped to `ARSAN`; the descriptor stays
 * live text so it localizes.
 *
 * **Two colour variants rather than a CSS filter.** The source is grayscale +
 * alpha — the shape lives in the alpha channel — so each variant is that mask
 * filled with a surface colour. Inverting the black artwork would also invert
 * how its anti-aliased edges meet the ground, fringing the letterforms.
 * Generated with:
 *
 *   magick refs/dirA-logo-lockup.png -crop 1370x235+0+0 +repage -trim +repage \
 *     -alpha extract -write mpr:mask +delete -size WxH xc:'#fefefa' \
 *     mpr:mask -alpha off -compose CopyOpacity -composite -resize 900x
 */
type LogoProps = {
  /** "light" renders for dark surfaces (header/footer on navy) */
  tone?: "light" | "dark";
  /** Renders the two-line descriptor under the wordmark */
  withSubtitle?: boolean;
  /** Rendered width of the wordmark in px */
  width?: number;
  className?: string;
};

/** Intrinsic ratio of the cropped artwork (1350×223). */
const WORDMARK_RATIO = 223 / 1350;

export function Logo({
  tone = "light",
  withSubtitle = true,
  width = 176,
  className,
}: LogoProps) {
  const t = useTranslations("brand");

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4",
        tone === "light"
          ? "focus-visible:outline-brass-300"
          : "focus-visible:outline-brass-500",
        className,
      )}
    >
      <Image
        src={
          tone === "light"
            ? "/logo/arsan-wordmark-cream.png"
            : "/logo/arsan-wordmark-navy.png"
        }
        alt="ARSAN"
        width={width}
        height={Math.round(width * WORDMARK_RATIO)}
        priority
        sizes={`${width}px`}
      />
      {withSubtitle && (
        <span
          className={cn(
            "mt-2 hidden max-w-[13.25rem] text-[0.59375rem] font-medium uppercase leading-tight tracking-[0.1em] sm:block",
            tone === "light" ? "text-cream-100/80" : "text-navy-700",
          )}
        >
          {t("subtitle")}
        </span>
      )}
    </Link>
  );
}
