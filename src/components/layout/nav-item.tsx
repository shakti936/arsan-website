"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One top-level nav item, and the only client component in the header.
 *
 * It exists for one behaviour CSS can't express: after you click through to a
 * page, the pointer is still sitting on the thing you clicked, so a pure
 * `:hover` panel stays open over the page you just asked for. Clicking
 * suppresses the panel until the pointer genuinely moves off the item.
 *
 * **Why not `onPointerLeave`.** Suppressing the panel yanks it out from under
 * the pointer, and that itself fires `pointerleave` on the item — so a
 * pointerleave reset cancels the suppression it was meant to outlive, the
 * panel reappears under the cursor, and hover latches it open again. The
 * sequence is visible in a MutationObserver: `data-suppressed=true`, `click`,
 * `pointerleave`, `data-suppressed=null`.
 *
 * The reset therefore watches for a pointer event over anything *outside* this
 * item. Hiding the panel raises one on whatever was underneath, which clears
 * the flag immediately — but by then the pointer really is outside the item,
 * so `:hover` is false and the panel stays shut. Click a top-level link and
 * the pointer is still on that link, the events stay inside the item, and the
 * suppression holds.
 */
export function NavItem({ children }: { children: React.ReactNode }) {
  const [suppressed, setSuppressed] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!suppressed) return;
    const release = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) setSuppressed(false);
    };
    document.addEventListener("pointermove", release);
    return () => document.removeEventListener("pointermove", release);
  }, [suppressed]);

  return (
    <li
      ref={ref}
      className="group"
      data-suppressed={suppressed ? "true" : undefined}
      onClickCapture={() => setSuppressed(true)}
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
