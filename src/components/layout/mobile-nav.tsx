"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/nav";

/**
 * Mobile navigation: full-screen overlay with a single-open accordion.
 *
 * The desktop mega menu shows every section's children at once because there's
 * room. On a phone that same content is ~20 links stacked — a wall. One section
 * open at a time keeps the five top-level choices scannable, and each opened
 * section mirrors the mega panel's icon + label + description language so the
 * two navigations feel like one system.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Open the section you're currently in, so the menu reflects where you are.
  useEffect(() => {
    if (!open) return;
    setExpanded(NAV_SECTIONS.find((s) => isActive(s.href))?.key ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll lock, Escape to close, and focus moved into the overlay.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables.item(0);
      const last = focusables.item(focusables.length - 1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
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
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("ariaMain")}
          className="fixed inset-0 z-100 flex h-dvh flex-col bg-navy-900"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-navy-800 px-6 py-4">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
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
            className="flex-1 overflow-y-auto overscroll-contain px-6"
          >
            <ul className="divide-y divide-navy-800">
              {NAV_SECTIONS.map((section) => {
                const isOpen = expanded === section.key;
                const current = isActive(section.href);
                return (
                  <li key={section.key}>
                    <h2>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`nav-panel-${section.key}`}
                        onClick={() => setExpanded(isOpen ? null : section.key)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-300"
                      >
                        <span
                          className={cn(
                            "font-display text-display-sm font-medium transition-colors",
                            current ? "text-brass-300" : "text-white-warm",
                          )}
                        >
                          {t(`${section.key}.label`)}
                        </span>
                        <span className="flex items-center gap-3">
                          {current && (
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-brass-500"
                            />
                          )}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className={cn(
                              "h-4 w-4 shrink-0 text-brass-400 transition-transform duration-200 motion-reduce:transition-none",
                              isOpen && "rotate-180",
                            )}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="m3 6 5 5 5-5" strokeLinecap="square" />
                          </svg>
                        </span>
                      </button>
                    </h2>

                    <div
                      id={`nav-panel-${section.key}`}
                      hidden={!isOpen}
                      className="pb-4"
                    >
                      <ul className="flex flex-col gap-1">
                        <li>
                          <Link
                            href={section.href}
                            onClick={close}
                            className="eyebrow inline-flex min-h-11 items-center text-brass-400 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
                          >
                            {t(`${section.key}.exploreAll`)}
                          </Link>
                        </li>
                        {section.children.map((child) => {
                          const Icon = Icons[child.icon];
                          return (
                            <li key={child.key}>
                              <Link
                                href={child.href}
                                onClick={close}
                                className="group flex min-h-14 items-start gap-3.5 rounded-sm py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass-300"
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-800 text-cream-50">
                                  <Icon className="h-4.5 w-4.5" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-base font-semibold text-white-warm group-hover:text-brass-300">
                                    {t(
                                      `${section.key}.children.${child.key}.label`,
                                    )}
                                  </span>
                                  <span className="mt-0.5 block text-sm leading-snug text-cream-100/70">
                                    {t(
                                      `${section.key}.children.${child.key}.description`,
                                    )}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-navy-800 bg-navy-950 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <Link
              href="/contact"
              onClick={close}
              className="eyebrow flex min-h-12 w-full items-center justify-center bg-brass-500 px-6 text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              {t("cta")}
            </Link>
            <div className="mt-4 flex items-center justify-center gap-2">
              {routing.locales.map((target, i) => (
                <span key={target} className="flex items-center gap-2">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="h-3 w-px bg-cream-100/25"
                    />
                  )}
                  <Link
                    href={pathname}
                    locale={target}
                    onClick={close}
                    aria-current={target === locale ? "true" : undefined}
                    className={cn(
                      "eyebrow inline-flex min-h-11 items-center px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300",
                      target === locale
                        ? "text-brass-400"
                        : "text-cream-100/70 hover:text-cream-50",
                    )}
                  >
                    {target.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
