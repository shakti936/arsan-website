import { useTranslations } from "next-intl";
import { CircleIcon, type IconName } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const FUNCTION_ICONS: IconName[] = [
  "person",
  "gear",
  "compass",
  "star",
  "truck",
  "chart",
  "users",
  "scale",
];

/** "We help you hire leaders across functions" — 8-cell grid */
export function FunctionGrid() {
  const t = useTranslations("functionGrid");

  return (
    <section className="bg-cream-50 py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <h2 className="text-center font-display text-display-md font-semibold text-navy-900 text-balance">
          {t("heading")}
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-0.5 w-10 bg-brass-500"
        />
        <div className="mt-12 grid gap-px overflow-hidden border border-cream-100 bg-cream-100 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCTION_ICONS.map((icon, i) => (
            <Reveal key={icon} delay={(i % 4) * 0.05} className="h-full">
              <div className="flex h-full flex-col gap-3 bg-white-warm p-7">
                <CircleIcon
                  name={icon}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-900 text-cream-50"
                />
                <h3 className="text-sm font-semibold text-navy-900">
                  {t(`items.${i}.title`)}
                </h3>
                <p className="text-sm text-navy-800">{t(`items.${i}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
