/**
 * Every static route on the site, as a value.
 *
 * This exists so a CTA destination can be CHOSEN rather than typed. An editor
 * picking from a list cannot ship a link to a page that does not exist, which
 * is the single most common way a CMS quietly breaks a site — and the exact
 * class of defect the link crawler in `e2e/links.spec.ts` was written to catch
 * after the fact. Choosing from this list catches it before the fact.
 *
 * Dynamic routes are deliberately absent: an article or a case study is linked
 * by REFERENCE in Sanity, not by pasting its slug, so renaming one cannot
 * strand a link.
 *
 * `e2e/links.spec.ts` asserts every entry here resolves, so the list cannot
 * drift from the app router.
 */
export const SITE_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/for-clients", label: "For Clients" },
  { path: "/for-clients/executive-search", label: "Executive Search" },
  { path: "/for-clients/mexico-advisory", label: "Mexico Advisory" },
  { path: "/for-clients/leadership-solutions", label: "Leadership Solutions" },
  { path: "/for-candidates", label: "For Candidates" },
  { path: "/for-candidates/opportunities", label: "Opportunities" },
  { path: "/for-candidates/submit-profile", label: "Submit Your Profile" },
  { path: "/for-candidates/talent-network", label: "Talent Network" },
  { path: "/results", label: "Results" },
  { path: "/insights", label: "Insights" },
  { path: "/why-arsan", label: "Why ARSAN" },
  { path: "/contact", label: "Contact" },
] as const;

export type SiteRoute = (typeof SITE_ROUTES)[number]["path"];

/** Shape the Sanity Studio wants for a dropdown. */
export const ROUTE_OPTIONS = SITE_ROUTES.map(({ path, label }) => ({
  title: `${label}  —  ${path}`,
  value: path,
}));
