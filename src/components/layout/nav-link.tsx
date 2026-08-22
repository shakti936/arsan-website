"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Top-level nav item. Two states, both brass-underlined:
 * `aria-current` for the section you are on, so it is announced and not only
 * seen, and `data-open` — set on the `li` by NavMenu — for the section whose
 * panel is showing. The second one is in refs/dirA-meganav-all-panels.png and
 * was missing: a full-width panel would drop open with nothing in the nav row
 * saying which item had opened it.
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
        "relative z-50 inline-flex min-h-11 items-center whitespace-nowrap text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300",
        active
          ? "text-white-warm"
          : "text-cream-50 hover:text-brass-300 group-data-[open]:text-brass-300",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-brass-500 transition-transform duration-200 motion-reduce:transition-none",
          active ? "scale-x-100" : "scale-x-0 group-data-[open]:scale-x-100",
        )}
      />
    </Link>
  );
}
