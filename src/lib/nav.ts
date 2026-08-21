import type { IconName } from "@/components/ui/icons";

/**
 * Navigation model. All labels/descriptions resolve through the "nav"
 * message namespace by key — no user-facing strings here.
 *
 * D-023: no candidate-portal surfaces (job listings, profile submission,
 * talent network). Every href below resolves to a page that exists.
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
      { key: "whyWork", href: "/for-candidates", icon: "star" },
      {
        key: "experience",
        href: "/for-candidates#experience",
        icon: "compass",
      },
      { key: "resources", href: "/insights", icon: "document" },
      {
        key: "conversation",
        href: "/for-candidates#conversation",
        icon: "chat",
      },
    ],
    feature: {
      icon: "shield",
      href: "/for-candidates#conversation",
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
