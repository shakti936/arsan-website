import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";

/**
 * PLACEHOLDER wordmarks — fictional names. Real client logos require
 * documented permission (Q-06; AIOS threat model forbids leaking client
 * identity). Swap via messages + real SVGs when Armida clears them.
 */
const PLACEHOLDER_MARKS = [
  "Vantrell Industrial",
  "Coyahua Automotive",
  "Steelhaven",
  "Nordal Aerospace",
  "Provanta Foods",
  "Merrow Plastics",
  "Aldana Médica",
] as const;

export function LogoWall() {
  const t = useTranslations("home.logoWall");

  return (
    <section className="border-b border-cream-100 bg-cream-50 py-10">
      <p className="eyebrow px-6 text-center text-navy-700">{t("eyebrow")}</p>
      <div className="mx-auto mt-7 max-w-6xl px-6 sm:px-10">
        <Marquee duration={40} pauseOnHover>
          {PLACEHOLDER_MARKS.map((mark) => (
            <span
              key={mark}
              className="font-display text-display-sm font-semibold uppercase tracking-[0.12em] text-navy-700/60"
            >
              {mark}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
