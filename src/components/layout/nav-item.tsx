"use client";

import type { NavSection } from "@/lib/nav";
import { useNavMenu } from "./nav-menu";

/**
 * One top-level nav item. It carries its key for the header's delegated
 * pointer and focus handling to find, and marks itself open when the header
 * says so. It holds no handlers and makes no decisions — see nav-menu.tsx for
 * why that is the whole point.
 */
export function NavItem({
  section,
  children,
}: {
  section: NavSection;
  children: React.ReactNode;
}) {
  const { openKey } = useNavMenu();

  return (
    <li
      className="group"
      data-nav-key={section.key}
      data-open={openKey === section.key ? "true" : undefined}
    >
      {children}
    </li>
  );
}
