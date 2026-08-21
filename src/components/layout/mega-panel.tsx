import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Icons } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { NavSection } from "@/lib/nav";

/**
 * Full-width mega-menu panel matching refs/dirA-meganav-all-panels.png:
 * left column = icon + title + description rows separated by rules,
 * right column = featured card with illustration, heading, body, CTA.
 * Opens on hover and on keyboard focus (focus-within) — no JS.
 */
export function MegaPanel({ section }: { section: NavSection }) {
  const t = useTranslations("nav");
  const base = `${section.key}.children`;
  const FeatureIcon = section.feature ? Icons[section.feature.icon] : null;

  return (
    <div className="absolute inset-x-0 top-full z-40 hidden pt-0 lg:block">
      <div className="invisible translate-y-1 opacity-0 transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none">
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
                        className="group/item flex items-start gap-4 py-4 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-500"
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
              <div className="flex flex-col justify-center bg-cream-50 p-8">
                <FeatureIcon className="h-10 w-10 text-brass-500" />
                <p className="mt-5 font-display text-display-md font-semibold text-navy-900 text-balance">
                  {t(`${section.key}.feature.title`)}
                </p>
                <p className="mt-3 max-w-[38ch] text-base leading-relaxed text-navy-800">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
