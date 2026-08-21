import { useTranslations } from "next-intl";

/** Thin letterspaced strip under a hero */
export function TrustStrip({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <div className="border-b border-cream-100 bg-cream-50">
      <ul className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-5 sm:px-10">
        {[0, 1, 2, 3].map((i) => (
          <li
            key={t(`items.${i}`)}
            className="eyebrow flex items-center gap-8 text-navy-700"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-brass-500"
              />
            )}
            {t(`items.${i}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
