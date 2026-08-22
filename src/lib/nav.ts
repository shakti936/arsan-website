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
  /**
   * Photograph for the feature card. refs/dirA-meganav-all-panels.png puts one
   * on Results and Insights and leaves the other three on their icon; a panel
   * with an `image` reads its alt from `nav.<key>.feature.imageAlt`.
   */
  image?: string;
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
        icon: "building",
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
        icon: "briefcase",
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
      { key: "resources", href: "/insights", icon: "book" },
    ],
    feature: {
      icon: "shieldLock",
      href: "/for-candidates/submit-profile",
      cta: "link",
    },
  },
  {
    key: "results",
    href: "/results",
    children: [
      { key: "caseStudies", href: "/results", icon: "search" },
      { key: "outcomes", href: "/results", icon: "chart" },
      { key: "testimonials", href: "/results#testimonials", icon: "chat" },
    ],
    feature: {
      icon: "factory",
      href: "/results",
      cta: "link",
      image: "/images/hero-plant-floor.jpg",
    },
  },
  {
    key: "insights",
    href: "/insights",
    children: [
      { key: "latest", href: "/insights", icon: "lightbulb" },
      { key: "manufacturing", href: "/insights", icon: "factory" },
      { key: "mexico", href: "/insights", icon: "globe" },
      { key: "reports", href: "/insights", icon: "document" },
    ],
    feature: {
      icon: "chart",
      href: "/insights",
      cta: "link",
      image: "/images/nav-automation.jpg",
    },
  },
  {
    key: "whyArsan",
    href: "/why-arsan",
    children: [
      { key: "ourDifference", href: "/why-arsan#difference", icon: "award" },
      { key: "ourPeople", href: "/why-arsan#people", icon: "users" },
      { key: "howWeWork", href: "/why-arsan#how-we-work", icon: "handshake" },
    ],
    feature: { icon: "chat", href: "/why-arsan#people", cta: "link" },
  },
];
