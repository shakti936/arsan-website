"use client";

import { useState } from "react";

/**
 * One top-level nav item, and the only client component in the header.
 *
 * It exists for one behaviour CSS can't express: after you click through to a
 * page, the pointer is still sitting on the item you clicked, so a pure
 * `:hover` panel stays open over the page you just asked for. Clicking
 * suppresses the panel until the pointer leaves the item — at which point
 * hover behaves normally again.
 *
 * Escape closes it too, for anyone who opened it and changed their mind.
 */
export function NavItem({ children }: { children: React.ReactNode }) {
  const [suppressed, setSuppressed] = useState(false);

  return (
    <li
      className="group"
      data-suppressed={suppressed ? "true" : undefined}
      onClickCapture={() => setSuppressed(true)}
      onPointerLeave={() => setSuppressed(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setSuppressed(true);
          (e.target as HTMLElement).blur();
        }
      }}
    >
      {children}
    </li>
  );
}
