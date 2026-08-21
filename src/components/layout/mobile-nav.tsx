"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/nav";

/**
 * Full-screen overlay rather than a panel offset below the header: the header
 * height changes with the type scale, and hard-coding that offset drifts every
 * time (SOP D-046). The overlay owns its own top bar, so it can't misalign.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Lock the page behind the overlay, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
      >
        <span className="sr-only">{t("openMenu")}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 6.5h18M3 12h18M3 17.5h18" strokeLinecap="square" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-100 flex h-dvh flex-col overscroll-contain bg-navy-900"
        >
          <div className="flex shrink-0 items-center justify-between px-6 py-4">
            <Logo />
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              <span className="sr-only">{t("close")}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 5l14 14M19 5 5 19" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          <nav
            aria-label={t("ariaMain")}
            className="flex-1 overflow-y-auto px-6 pb-10"
          >
            <ul className="flex flex-col divide-y divide-navy-800">
              {NAV_SECTIONS.map((section) => (
                <li key={section.key} className="py-4">
                  <Link
                    href={section.href}
                    onClick={close}
                    aria-current={isActive(section.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center font-display text-display-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300",
                      isActive(section.href)
                        ? "border-l-2 border-brass-500 pl-3 text-brass-300"
                        : "text-white-warm",
                    )}
                  >
                    {t(`${section.key}.label`)}
                  </Link>
                  {section.children.length > 0 && (
                    <ul className="mt-1 flex flex-col">
                      {section.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="inline-flex min-h-11 items-center text-sm text-cream-100/85 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
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
              className="eyebrow mt-8 inline-flex min-h-12 w-full items-center justify-center bg-brass-500 px-6 py-3.5 text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              {t("cta")}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
