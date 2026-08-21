import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type LogoProps = {
  /** "light" renders for dark surfaces (header/footer on navy) */
  tone?: "light" | "dark";
  /** Renders the two-line subtitle under the wordmark */
  withSubtitle?: boolean;
  className?: string;
};

export function Logo({
  tone = "light",
  withSubtitle = true,
  className,
}: LogoProps) {
  const t = useTranslations("brand");

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4",
        tone === "light"
          ? "text-white-warm focus-visible:outline-brass-300"
          : "text-navy-900 focus-visible:outline-brass-500",
        className,
      )}
    >
      <span className="font-display text-[1.75rem] font-medium uppercase leading-none tracking-[0.18em]">
        Arsan
      </span>
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
