import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

export function QuoteBand({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <section className="bg-navy-900 py-16">
      <Reveal className="mx-auto w-full max-w-4xl px-6 sm:px-10">
        <figure className="border-l-2 border-brass-500 pl-6 sm:pl-10">
          <blockquote className="font-display text-display-md font-medium leading-snug text-white-warm text-balance">
            {t("lead")} <em className="text-brass-400">{t("emphasis")}</em>
            {t("tail")}
          </blockquote>
        </figure>
      </Reveal>
    </section>
  );
}
