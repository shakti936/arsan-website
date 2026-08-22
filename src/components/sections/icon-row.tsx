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
  /**
   * `above` centres the heading over the row. `beside` puts it in its own
   * column to the left with a rule and a line of body copy, which is how
   * refs/dirA-for-candidates-landing.png sets "You deserve to know where you
   * stand." Requires a `body` key in the namespace.
   */
  headingLayout?: "above" | "beside";
  /**
   * Columns in the item grid at `lg`. Four beside a heading column leaves each
   * item about 150px, which is fine for one-word titles ("Respect") and wraps
   * a phrase to three lines. Pass 2 when the titles are sentences.
   */
  columns?: 2 | 4;
  id?: string;
};

/** Direction A icon row: outline icons, thin vertical dividers */
export function IconRow({
  namespace,
  icons,
  tone = "light",
  withHeading,
  headingLayout = "above",
  columns = 4,
  id,
}: IconRowProps) {
  const t = useTranslations(namespace);
  const dark = tone === "dark";
  const beside = withHeading && headingLayout === "beside";

  return (
    <section
      id={id}
      className={cn(
        dark ? "bg-teal-900" : "bg-cream-50",
        "scroll-mt-24 section-y",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-page px-6 sm:px-10",
          beside && "grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14",
        )}
      >
        {withHeading &&
          (beside ? (
            <div>
              <h2
                className={cn(
                  "font-display text-heading font-semibold text-balance",
                  dark ? "text-white-warm" : "text-navy-900",
                )}
              >
                {t("heading")}
              </h2>
              <div aria-hidden="true" className="mt-4 h-0.5 w-10 bg-teal-900" />
              <p
                className={cn(
                  "mt-6 max-w-[42ch] text-sm",
                  dark ? "text-cream-100/85" : "text-navy-800",
                )}
              >
                {t("body")}
              </p>
            </div>
          ) : (
            <h2
              className={cn(
                "text-center font-display text-heading font-semibold text-balance",
                dark ? "text-white-warm" : "text-navy-900",
              )}
            >
              {t("heading")}
            </h2>
          ))}
        <div
          className={cn(
            "grid gap-8 sm:grid-cols-2",
            withHeading && !beside && "mt-12",
            icons.length !== 4
              ? "lg:grid-cols-5"
              : columns === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-4",
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
                      beside ? "h-9 w-9" : "h-7 w-7",
                      dark ? "text-brass-300" : "text-teal-900",
                    )}
                  />
                  <h3
                    className={cn(
                      beside
                        ? "font-display text-subheading font-semibold leading-snug"
                        : "text-sm font-semibold",
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
