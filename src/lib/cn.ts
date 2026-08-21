import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's BUILT-IN font-size scale. Our custom
 * `text-display-*` tokens were being classified as text-COLOR classes, so
 * cn("text-display-md", "text-navy-900") silently dropped the size and every
 * section heading rendered at inherited body size (SOP D-043).
 * Registering them as font sizes fixes it everywhere at once.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-xl", "display-lg", "display-md", "display-sm"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
