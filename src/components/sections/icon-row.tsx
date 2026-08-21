import { useTranslations } from "next-intl";
import { type IconName, Icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

type IconRowProps = {
  /** Message namespace holding heading? + items.N.{title,body} */
  namespace: string;
  icons: IconName[];
  tone?: "light" | "dark";
  withHeading?: boolean;
  id?: string;
};

/** Direction A icon row: outline icons, thin vertical dividers */
export function IconRow({
  namespace,
  icons,
  tone = "light",
  withHeading,
  id,
}: IconRowProps) {
  const t = useTranslations(namespace);
  const dark = tone === "dark";

  return (
    <section
      id={id}
      className={cn(dark ? "bg-teal-900" : "bg-cream-50", "scroll-mt-24 py-16")}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        {withHeading && (
          <h2
            className={cn(
              "text-center font-display text-display-md font-semibold text-balance",
              dark ? "text-white-warm" : "text-navy-900",
            )}
          >
            {t("heading")}
          </h2>
        )}
        <div
          className={cn(
            "grid gap-8 sm:grid-cols-2",
            withHeading && "mt-12",
            icons.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5",
          )}
        >
          {icons.map((icon, i) => {
            const Icon = Icons[icon];
            return (
              <Reveal key={icon} delay={i * 0.06}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-3 border-t pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0",
                    dark ? "border-cream-50/20" : "border-brass-500/40",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-7 w-7",
                      dark ? "text-brass-300" : "text-teal-900",
                    )}
                  />
                  <h3
                    className={cn(
                      "text-sm font-semibold",
                      dark ? "text-white-warm" : "text-navy-900",
                    )}
                  >
                    {t(`items.${i}.title`)}
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      dark ? "text-cream-100/85" : "text-navy-800",
                    )}
                  >
                    {t(`items.${i}.body`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
