import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const MEMBER_COUNT = 3;

/**
 * MOCK team data (names/titles from Direction A mockups, unverified —
 * SOP Q-06). Portrait slots take real photography later; monogram
 * placeholders until then.
 */
export function TeamRow() {
  const t = useTranslations("team");

  return (
    <section className="bg-white-warm py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading>{t("heading")}</SectionHeading>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {Array.from({ length: MEMBER_COUNT }, (_, i) => {
            const name = t(`members.${i}.name`);
            const initials = name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("");
            return (
              <Reveal key={name} delay={i * 0.08}>
                <article className="flex gap-5">
                  {/* Photo slot — /gen-images or real portraits later */}
                  <div
                    aria-hidden="true"
                    className="flex h-24 w-24 shrink-0 items-center justify-center bg-navy-900 font-display text-2xl font-medium text-cream-50"
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-navy-900">
                      {name}
                    </h3>
                    <p className="eyebrow mt-1 text-brass-600">
                      {t(`members.${i}.title`)}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-navy-800">
                      {t(`members.${i}.bio`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
