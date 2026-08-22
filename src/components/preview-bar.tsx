"use client";

import { VisualEditing } from "next-sanity/visual-editing";
import { useEffect, useState } from "react";

/**
 * Preview-mode affordances, and where they are allowed to appear.
 *
 * Draft mode is a cookie. Once an editor opens the Presentation tool, every
 * later visit to the site in that browser is a preview — including typing the
 * plain URL — and there is nothing on the page to say so. That produced two
 * confusing symptoms at once: copy that looked stale (it was the draft), and a
 * page covered in blue rectangles.
 *
 * So the overlays are drawn ONLY inside the Presentation iframe, where they
 * are the feature. On the site itself, preview mode announces itself with one
 * small badge that turns it off again.
 */
export function PreviewBar() {
  const [inPresentation, setInPresentation] = useState<boolean | null>(null);

  useEffect(() => {
    // `window.top` throws on cross-origin; being unable to see out is itself
    // proof of being framed
    try {
      setInPresentation(window.self !== window.top);
    } catch {
      setInPresentation(true);
    }
  }, []);

  if (inPresentation === null) return null;
  if (inPresentation) return <VisualEditing />;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm text-white-warm shadow-lg ring-1 ring-white-warm/20 transition hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-brass-400 motion-safe:animate-pulse"
      />
      Preview mode — showing unpublished edits.
      <span className="underline underline-offset-2">Exit</span>
    </a>
  );
}
