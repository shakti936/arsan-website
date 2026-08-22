import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

/**
 * Leadership row, from refs/dirA-home-v2.png: a 4:5 portrait beside the name,
 * three across, hairline rules between them.
 *
 * **The portraits are generated placeholders and are named as such.** A
 * synthetic face under a real partner's name is something a prospective client
 * would act on — they think they are seeing the person who would run their
 * search. So the filenames say what they are, `scripts/launch-gate.mjs` fails
 * while any of them is still referenced, and swapping in real headshots is a
 * three-line change (SOP Q-21).
 *
 * The photographs carry `alt=""`. The name is the heading immediately beside
 * them, so naming the image too makes a screen reader say it twice — and an
 * `alt` asserting whose face it is would be the one claim these files can't make.
 */
const PORTRAITS = [
  "placeholder-portrait-managing-partner",
  "placeholder-portrait-mexico-partner",
  "placeholder-portrait-partner",
] as const;

export function TeamRow({
  /** The home page links out to the leadership section; that page IS it. */
  withViewAll,
}: {
  withViewAll?: boolean;
}) {
  const t = useTranslations("team");

  return (
    <section className="bg-white-warm section-y">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading>{t("heading")}</SectionHeading>
          {withViewAll && (
            <ArrowLink href="/why-arsan#people">{t("viewAll")}</ArrowLink>
          )}
        </div>

        {/* Three across only from `lg`. The container caps at 72rem, so a
            column is ~325px however wide the window gets — at `md` that is
            ~200px, and "Partner, Mexico Practice" plus a portrait does not go
            into 200px without breaking the bio to two words a line. The
            negative margin lets every column carry equal padding while the
            first one still lines up with the heading above it. */}
        <div className="mt-10 grid gap-10 lg:-mx-6 lg:grid-cols-3 lg:gap-0">
          {PORTRAITS.map((photo, i) => (
            <Reveal key={photo} delay={i * 0.08} className="h-full">
              <article
                className={cn(
                  "flex h-full gap-5 lg:px-6",
                  i > 0 && "lg:border-l lg:border-cream-100",
                )}
              >
                {/* larger while the rows are stacked and have the width to
                    spare; back to compact once three share a container */}
                <div className="relative aspect-4/5 w-28 shrink-0 overflow-hidden bg-cream-100 sm:w-32 lg:w-28">
                  <Image
                    src={`/images/${photo}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 112px, (min-width: 640px) 128px, 112px"
                    className="object-cover"
                  />
                </div>
                <div className="max-w-[38ch] lg:max-w-none">
                  <h3 className="font-display text-display-sm font-semibold leading-snug text-navy-900">
                    {t(`members.${i}.name`)}
                  </h3>
                  {/* Two lines of room once the columns are narrow enough
                      that "Partner, Mexico Practice" wraps, so its bio doesn't
                      start a line below the other two. Stacked, nothing wraps
                      and the reserve would just be a gap. */}
                  <p className="mt-0.5 text-sm text-navy-700 lg:min-h-[2lh]">
                    {t(`members.${i}.title`)}
                  </p>
                  <p className="mt-3 text-sm text-navy-800">
                    {t(`members.${i}.bio`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
