import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Link } from "@/i18n/navigation";
import { NAV_SECTIONS } from "@/lib/nav";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

/**
 * Direction A header: navy bar, text nav, brass-outline CTA.
 * Dropdown panels open on hover and on keyboard focus (focus-within) — no JS.
 */
export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 bg-navy-900">
      <a
        href="#main"
        className="eyebrow absolute left-4 top-2 z-50 -translate-y-16 bg-brass-500 px-4 py-2 text-navy-950 transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-brass-300 motion-reduce:transition-none"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <Logo />

        <nav aria-label={t("ariaMain")} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_SECTIONS.map((section) => (
              <li key={section.key} className="group relative">
                <Link
                  href={section.href}
                  className="inline-flex items-center py-2 text-sm text-cream-50 transition-colors hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
                >
                  {t(`${section.key}.label`)}
                </Link>
                {section.children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
                    <ul className="w-72 border-t-2 border-brass-500 bg-white-warm py-3 shadow-lg shadow-navy-950/20">
                      {section.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            className="block px-5 py-2.5 text-sm text-navy-900 transition-colors hover:bg-cream-50 hover:text-brass-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-500"
                          >
                            <span className="font-medium">
                              {t(`${section.key}.children.${child.key}.label`)}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-navy-700">
                              {t(
                                `${section.key}.children.${child.key}.description`,
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="eyebrow hidden border border-brass-500 px-5 py-3 text-brass-400 transition-colors hover:border-brass-300 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300 sm:inline-flex"
          >
            {t("cta")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
