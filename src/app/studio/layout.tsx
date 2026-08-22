/**
 * The Studio's own root layout.
 *
 * Every other route on this site lives under `[locale]` and inherits its
 * `<html>`/`<body>` from there. The Studio is not a localised page — it is an
 * application, it ships its own reset and its own chrome, and it must not be
 * wrapped in the site header, the fonts or the locale provider. Next allows a
 * second root layout in a sibling segment, which is exactly this case.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Browser extensions (ColorZilla, Grammarly, password managers) add
          attributes to <body> before React hydrates, which reads as a
          mismatch. This suppresses the element's OWN attributes only —
          mismatches inside the tree are still reported. */}
      <body suppressHydrationWarning style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
