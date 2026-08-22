import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { NavSection } from "@/lib/nav";

/**
 * Full-width mega-menu panel matching refs/dirA-meganav-all-panels.png:
 * left column = icon + title + description rows separated by rules,
 * right column = featured card. Results and Insights carry a photograph beside
 * the text in the reference; the other three keep their icon.
 * Whether it is open is decided by NavMenu, not by `:hover` on this subtree —
 * see that file for why two panels used to stack on every traverse. This
 * renders the panel and reads `data-open` off the item above it.
 */
export function MegaPanel({ section }: { section: NavSection }) {
  const t = useTranslations("nav");
  const base = `${section.key}.children`;
  const FeatureIcon = section.feature ? Icons[section.feature.icon] : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full z-40 hidden xl:block">
      {/* Three deliberate choices, all of them about the traverse:
          - `visibility` is never transitioned. It is not interpolatable, so
            animating it holds a closing panel on screen for the full duration
            and stacks it under the opening one.
          - opening from closed gets the 200ms rise; closing is immediate.
          - `data-swap` on the header (item to item, both open) zeroes the
            duration, so the menu reads as one surface changing its contents
            instead of blinking through 200ms of nothing. */}
      <div className="invisible translate-y-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-data-[open]:pointer-events-auto group-data-[open]:visible group-data-[open]:translate-y-0 group-data-[open]:opacity-100 group-data-[swap]/nav:duration-0 motion-reduce:transition-none">
        {/* covers the strip of header padding between the item and the panel,
            so the pointer can travel down without crossing dead space */}
        <span aria-hidden="true" className="absolute inset-x-0 -top-6 h-6" />
        <div className="border-t-2 border-brass-500 bg-white-warm shadow-xl shadow-navy-950/25">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-9 sm:px-10 lg:grid-cols-[1.15fr_1fr]">
            {/* Left: item list */}
            <div className="flex flex-col">
              <ul className="divide-y divide-cream-100">
                {section.children.map((child) => {
                  const Icon = Icons[child.icon];
                  return (
                    <li key={child.key}>
                      <Link
                        href={child.href}
                        className="group/item -mx-3 flex items-start gap-4 px-3 py-4 transition-colors hover:bg-cream-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-500"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-900 text-cream-50">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-base font-semibold text-navy-900 group-hover/item:text-brass-600">
                            {t(`${base}.${child.key}.label`)}
                          </span>
                          <span className="mt-0.5 block text-sm leading-snug text-navy-700">
                            {t(`${base}.${child.key}.description`)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5">
                <ArrowLink href={section.href}>
                  {t(`${section.key}.exploreAll`)}
                </ArrowLink>
              </div>
            </div>

            {/* Right: featured card */}
            {section.feature && FeatureIcon && (
              <div
                className={cn(
                  "bg-cream-50",
                  section.feature.image
                    ? "grid items-center gap-5 p-6 sm:grid-cols-[3fr_5fr]"
                    : "flex flex-col justify-center p-8",
                )}
              >
                {section.feature.image ? (
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={section.feature.image}
                      alt={t(`${section.key}.feature.imageAlt`)}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <FeatureIcon className="h-10 w-10 text-brass-500" />
                )}
                <div>
                  <p
                    className={cn(
                      "font-display font-semibold text-navy-900 text-balance",
                      section.feature.image
                        ? "text-display-sm"
                        : "mt-5 text-display-md",
                    )}
                  >
                    {t(`${section.key}.feature.title`)}
                  </p>
                  <p
                    className={cn(
                      "mt-3 max-w-[38ch] text-navy-800",
                      section.feature.image ? "text-sm" : "text-base",
                    )}
                  >
                    {t(`${section.key}.feature.body`)}
                  </p>
                  <div className="mt-6">
                    {section.feature.cta === "button" ? (
                      <Link
                        href={section.feature.href}
                        className="eyebrow inline-flex bg-brass-500 px-6 py-3.5 text-navy-950 transition-colors hover:bg-brass-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                      >
                        {t(`${section.key}.feature.cta`)}
                      </Link>
                    ) : (
                      <ArrowLink href={section.feature.href}>
                        {t(`${section.key}.feature.cta`)}
                      </ArrowLink>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
