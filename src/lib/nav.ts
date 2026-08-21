import type { IconName } from "@/components/ui/icons";

/**
 * Navigation model. All labels/descriptions resolve through the "nav"
 * message namespace by key — no user-facing strings here.
 *
 * Every href resolves to a page that exists. The candidate-portal items
 * (opportunities, profile, talent network) ship as real routes ahead of the
 * job board (D-040) — opportunities carries an honest empty state rather
 * than invented listings.
 */
export type NavChild = { key: string; href: string; icon: IconName };

export type NavFeature = {
  icon: IconName;
  href: string;
  /** "button" renders a solid brass CTA, "link" an arrow link */
  cta: "button" | "link";
};

export type NavSection = {
  key: string;
  href: string;
  children: NavChild[];
  feature?: NavFeature;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "forClients",
    href: "/for-clients",
    children: [
      {
        key: "executiveSearch",
        href: "/for-clients/executive-search",
        icon: "person",
      },
      {
        key: "mexicoAdvisory",
        href: "/for-clients/mexico-advisory",
        icon: "globe",
      },
      {
        key: "leadershipSolutions",
        href: "/for-clients/leadership-solutions",
        icon: "factory",
      },
    ],
    feature: { icon: "globe", href: "/contact", cta: "button" },
  },
  {
    key: "forCandidates",
    href: "/for-candidates",
    children: [
      {
        key: "opportunities",
        href: "/for-candidates/opportunities",
        icon: "compass",
      },
      {
        key: "submitProfile",
        href: "/for-candidates/submit-profile",
        icon: "person",
      },
      { key: "experience", href: "/for-candidates#experience", icon: "star" },
      {
        key: "talentNetwork",
        href: "/for-candidates/talent-network",
        icon: "users",
      },
      { key: "resources", href: "/insights", icon: "document" },
    ],
    feature: {
      icon: "shield",
      href: "/for-candidates/submit-profile",
      cta: "link",
    },
  },
  {
    key: "results",
    href: "/results",
    children: [
      { key: "caseStudies", href: "/results", icon: "document" },
      { key: "outcomes", href: "/results", icon: "chart" },
      { key: "testimonials", href: "/results#testimonials", icon: "chat" },
    ],
    feature: { icon: "factory", href: "/results", cta: "link" },
  },
  {
    key: "insights",
    href: "/insights",
    children: [
      { key: "latest", href: "/insights", icon: "compass" },
      { key: "manufacturing", href: "/insights", icon: "factory" },
      { key: "mexico", href: "/insights", icon: "map" },
      { key: "reports", href: "/insights", icon: "document" },
    ],
    feature: { icon: "chart", href: "/insights", cta: "link" },
  },
  {
    key: "whyArsan",
    href: "/why-arsan",
    children: [
      { key: "ourDifference", href: "/why-arsan#difference", icon: "target" },
      { key: "ourPeople", href: "/why-arsan#people", icon: "users" },
      { key: "howWeWork", href: "/why-arsan#how-we-work", icon: "handshake" },
    ],
    feature: { icon: "chat", href: "/why-arsan#people", cta: "link" },
  },
];
