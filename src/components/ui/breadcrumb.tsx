import { Link } from "@/i18n/navigation";

/**
 * The trail in refs/dirA-article-*.png — Home › Insights › Category.
 *
 * The last crumb is the page you are on, so it is plain text with
 * `aria-current`, not a link to itself. The separators are decorative and
 * hidden, otherwise a screen reader reads "greater than" between every crumb.
 */
export type Crumb = {
  label: string;
  href?: Parameters<typeof Link>[0]["href"];
};

export function Breadcrumb({
  items,
  label,
}: {
  items: Crumb[];
  /** Accessible name for the nav landmark. */
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-cream-100/75">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-cream-100/40">
                ›
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-cream-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
