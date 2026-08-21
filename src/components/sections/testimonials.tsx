import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

/**
 * Adapted from a 21st.dev testimonials section (docs/sop/06-prompts.md):
 * its InfiniteSlider dependency wasn't provided, so columns run on our
 * Marquee (vertical); joke demo data replaced with mock quotes from the
 * message catalogs; avatars are monogram initials — no external images,
 * no radix dependency. MOCK CONTENT until AIOS gate D-018 (testimonial
 * consent) is satisfied and real quotes exist.
 */
const COLUMNS: { indexes: number[]; duration: number; className?: string }[] = [
  { indexes: [0, 1], duration: 46 },
  { indexes: [2, 3], duration: 62, className: "hidden md:flex" },
  { indexes: [4, 5], duration: 52, className: "hidden lg:flex" },
];

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section id="testimonials" className="scroll-mt-24 bg-cream-50 py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <SectionHeading>{t("heading")}</SectionHeading>
        <div className="mt-10 flex h-105 justify-center gap-6 overflow-hidden">
          {COLUMNS.map((column) => (
            <Marquee
              key={column.indexes.join()}
              direction="up"
              duration={column.duration}
              pauseOnHover
              fadeAmount={14}
              copyClassName="gap-6 pb-6"
              className={cn("min-w-0 flex-1", column.className)}
            >
              {column.indexes.map((i) => (
                <TestimonialCard
                  key={i}
                  quote={t(`items.${i}.quote`)}
                  name={t(`items.${i}.name`)}
                  role={t(`items.${i}.role`)}
                />
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="w-full border border-cream-100 bg-white-warm p-7 shadow-sm shadow-navy-950/5">
      <blockquote className="text-base text-navy-800">{quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold tracking-wide text-cream-50"
        >
          {initials}
        </span>
        <span className="flex flex-col">
          <cite className="text-sm font-semibold not-italic text-navy-900">
            {name}
          </cite>
          <span className="text-xs text-navy-700">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
