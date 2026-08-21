"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Top-level nav item. Marks the current section with a brass underline
 * and aria-current so it's announced, not just seen.
 */
export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-11 items-center text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300",
        active ? "text-white-warm" : "text-cream-50 hover:text-brass-300",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-brass-500 transition-transform duration-200 motion-reduce:transition-none",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </Link>
  );
}
