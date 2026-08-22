import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Link } from "@/i18n/navigation";
import { NAV_SECTIONS } from "@/lib/nav";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  return (
    <footer className="bg-navy-950 text-cream-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo width={200} withSubtitle={false} />
            <p className="eyebrow mt-5 text-cream-100/70">{tf("regions")}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.key}>
                <Link
                  href={section.href}
                  className="inline-flex min-h-9 items-center text-sm font-semibold text-white-warm hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
                >
                  {t(`${section.key}.label`)}
                </Link>
                {section.children.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {section.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.href}
                          className="inline-flex min-h-9 items-center text-sm text-cream-100/80 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300"
                        >
                          {t(`${section.key}.children.${child.key}.label`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-navy-800 pt-6 text-sm text-cream-100/60 sm:flex-row">
          <p>{tf("copyright", { year: new Date().getFullYear() })}</p>
          <p>{tf("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
