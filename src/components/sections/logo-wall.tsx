import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";

/**
 * Client wordmarks, supplied by Drew 2026-08-21 (D-067) — real names, not the
 * fictional stand-ins this carried before.
 *
 * Set as type, not logos. A wall of 23 sourced SVGs at 23 different optical
 * weights is a different job, and using a company's logo carries a trademark
 * question that its name in the site's own typeface does not.
 *
 * The order is deliberate: six of the twenty-three are Illinois Tool Works
 * business units, and run together they read as one client padded out. They
 * are spaced so no two are adjacent in the loop.
 */
const CLIENTS = [
  "Nidec",
  "ITW Automotive",
  "American Industries",
  "Terex",
  "ITW Appliance Components",
  "CentroMotion",
  "Genie",
  "ITW Air Flow Management",
  "Jabil",
  "Marelli",
  "Illinois Tool Works (ITW)",
  "Crane Co.",
  "BVI Medical",
  "ITW Thermal & Fluid Management",
  "Aletek",
  "Vishay",
  "ESAB",
  "ITW Construction Products",
  "Rapid",
  "TE Connectivity",
  "Baltimore Aircoil Company (BAC)",
  "Aptiv",
  "Align Technology",
] as const;

export function LogoWall() {
  const t = useTranslations("home.logoWall");

  return (
    <section className="border-b border-cream-100 bg-cream-50 py-10">
      <p className="eyebrow px-6 text-center text-navy-700">{t("eyebrow")}</p>
      <div className="mx-auto mt-7 max-w-page px-6 sm:px-10">
        {/* ~3.3x the copy the seven placeholders carried, so the loop runs
            ~3.3x longer to hold the same scroll speed */}
        <Marquee duration={130} pauseOnHover fadeAmount={16}>
          {CLIENTS.map((name) => (
            <span
              key={name}
              className="whitespace-nowrap font-display text-display-sm font-semibold uppercase tracking-[0.12em] text-navy-700/60"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
