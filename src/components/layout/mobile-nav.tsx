"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_SECTIONS } from "@/lib/nav";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
      >
        <span className="sr-only">{open ? t("close") : t("openMenu")}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {open ? (
            <path d="M5 5l14 14M19 5 5 19" strokeLinecap="square" />
          ) : (
            <path d="M3 6.5h18M3 12h18M3 17.5h18" strokeLinecap="square" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={t("ariaMain")}
          className="fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-navy-900 px-6 pb-16 pt-6"
        >
          <ul className="flex flex-col divide-y divide-navy-800">
            {NAV_SECTIONS.map((section) => (
              <li key={section.key} className="py-4">
                <Link
                  href={section.href}
                  onClick={close}
                  aria-current={isActive(section.href) ? "page" : undefined}
                  className={`font-display text-2xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300 ${
                    isActive(section.href)
                      ? "border-l-2 border-brass-500 pl-3 text-brass-300"
                      : "text-white-warm"
                  }`}
                >
                  {t(`${section.key}.label`)}
                </Link>
                {section.children.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {section.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.href}
                          onClick={close}
                          className="text-sm text-cream-100 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
                        >
                          {t(`${section.key}.children.${child.key}.label`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={close}
            className="eyebrow mt-8 inline-flex bg-brass-500 px-6 py-3.5 text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
          >
            {t("cta")}
          </Link>
        </nav>
      )}
    </div>
  );
}
