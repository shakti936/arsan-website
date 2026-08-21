import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: Parameters<typeof Link>[0]["href"];
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "eyebrow inline-flex items-center justify-center px-6 py-3.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "solid" &&
          "bg-brass-500 text-navy-950 hover:bg-brass-400 focus-visible:outline-brass-300",
        variant === "outline" &&
          "border border-brass-500 text-cream-50 hover:border-brass-300 hover:text-white-warm focus-visible:outline-brass-300",
        variant === "outline-dark" &&
          "border border-navy-900 text-navy-900 hover:border-brass-600 hover:text-brass-600 focus-visible:outline-brass-500",
        className,
      )}
    >
      {children}
    </Link>
  );
}
