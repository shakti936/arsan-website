import { PortableText, type PortableTextComponents } from "next-sanity";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { ArticleBlock } from "@/lib/articles";

/**
 * Renders an article body written in the Studio.
 *
 * Every mapping here is a ROLE, never a size: `h2` becomes `text-heading`,
 * `h3` becomes `text-subheading`, a paragraph becomes body. There is no
 * branch an editor can take that produces a size, a colour or a font — the
 * whitelist in `localizedArticleBody` only offers these three block styles and
 * two decorators, so this component is the complete set of outcomes.
 *
 * The numbered list draws the spine the article comps use — a navy circle
 * carrying the number — and the bulleted list draws the circled check. Those
 * were bespoke `steps` and `checks` shapes in the old content modules; they
 * are ordinary Portable Text lists now, so an editor can write one without
 * anyone adding a field for it.
 */
const LINK_STYLE =
  "text-navy-900 underline decoration-brass-500 decoration-2 underline-offset-4 transition-colors hover:text-brass-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-500";

type Step = { title?: string; body?: string };

const components: PortableTextComponents = {
  types: {
    /**
     * The numbered spine. Each step keeps a real serif subheading over its
     * prose — a numbered list with the title run in bold instead was measurably
     * worse side by side, which is why this is a block type and not a
     * convention (D-092).
     */
    steps: ({ value }) => {
      const items = (value as { items?: Step[] } | undefined)?.items ?? [];
      if (!items.length) return null;
      return (
        <ol className="mt-7 flex flex-col gap-7">
          {items.map((step, i) => (
            <li key={step.title ?? i} className="flex gap-5">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-base font-semibold text-cream-50"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-subheading font-semibold leading-snug text-navy-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-navy-800">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-base text-navy-800 first:mt-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-11 font-display text-heading font-semibold text-navy-900 text-balance">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-subheading font-semibold leading-snug text-navy-900">
        {children}
      </h3>
    ),
  },
  list: {
    number: ({ children }) => (
      <ol className="mt-7 flex flex-col gap-7">{children}</ol>
    ),
    bullet: ({ children }) => (
      <ul className="mt-6 flex flex-col gap-4">{children}</ul>
    ),
  },
  listItem: {
    number: ({ children, index }) => (
      <li className="flex gap-5">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-base font-semibold text-cream-50"
        >
          {index + 1}
        </span>
        <p className="text-base text-navy-800">{children}</p>
      </li>
    ),
    bullet: ({ children }) => (
      <li className="flex gap-3">
        <Icons.check
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-navy-900"
        />
        <p className="text-base text-navy-800">{children}</p>
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    internalLink: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href;
      // GROQ resolves every destination shape to an href before it gets here,
      // so a missing one means the referenced document was deleted — render
      // the words rather than a link to nowhere
      if (!href) return <>{children}</>;
      if (/^https?:|^mailto:|^tel:/.test(href)) {
        return (
          <a
            href={href}
            className={LINK_STYLE}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        );
      }
      return (
        // the typed router wants a known route literal; this one is resolved
        // from content at build time and validated by e2e/links.spec.ts
        <Link
          href={href as Parameters<typeof Link>[0]["href"]}
          className={LINK_STYLE}
        >
          {children}
        </Link>
      );
    },
  },
};

export function ArticleProse({ blocks }: { blocks: ArticleBlock[] }) {
  return <PortableText value={blocks} components={components} />;
}
