import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Link } from "@/i18n/navigation";
import { NAV_SECTIONS } from "@/lib/nav";
import { LocaleSwitcher } from "./locale-switcher";
import { MegaPanel } from "./mega-panel";
import { MobileNav } from "./mobile-nav";
import { NavItem } from "./nav-item";
import { NavLink } from "./nav-link";

/**
 * Direction A header. `relative` is load-bearing: mega panels are
 * absolutely positioned against it so they span the full viewport width
 * (refs/dirA-meganav-all-panels.png), not just the nav item.
 */
export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="site-header z-50 bg-navy-900">
      <a
        href="#main"
        className="eyebrow absolute left-4 top-2 z-50 -translate-y-16 bg-brass-500 px-4 py-2 text-navy-950 transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-brass-300 motion-reduce:transition-none"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-10 xl:gap-6">
        <Logo width={186} className="shrink-0" />

        <nav aria-label={t("ariaMain")} className="hidden xl:block">
          <ul className="flex items-center gap-5 xl:gap-6">
            {NAV_SECTIONS.map((section) => (
              <NavItem key={section.key}>
                <NavLink href={section.href}>
                  {t(`${section.key}.label`)}
                </NavLink>
                <MegaPanel section={section} />
              </NavItem>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="eyebrow hidden whitespace-nowrap border border-brass-500 px-4 py-3 text-brass-400 transition-colors hover:border-brass-300 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300 md:inline-flex"
          >
            {t("cta")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
