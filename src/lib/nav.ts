import type { IconName } from "@/components/ui/icons";

/**
 * Navigation model. All labels/descriptions resolve through the "nav"
 * message namespace by key — no user-facing strings here.
 *
 * Every href resolves to a page that exists, and no two rows in a panel land
 * on the same view — a row that repeats its neighbour is a row that wastes a
 * click. `scripts/validate-messages.mjs` enforces that at build time. Where a
 * label has no page of its own yet (Reports & Guides), it points at the closest
 * real thing and is logged in Q-26.
 *
 * A feature card's href has to match what its CTA promises: "View the Case
 * Study" and "Read the Article" both used to land on an index, which is the
 * card describing one thing and delivering another.
 *
 * The candidate-portal items
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
      { key: "resources", href: "/insights?category=hiring", icon: "book" },
    ],
    feature: {
      icon: "shieldLock",
      href: "/for-candidates#experience",
      cta: "link",
    },
  },
  {
    key: "results",
    href: "/results",
    children: [
      { key: "caseStudies", href: "/results#case-studies", icon: "search" },
      { key: "outcomes", href: "/results#impact", icon: "chart" },
      { key: "testimonials", href: "/results#testimonials", icon: "chat" },
    ],
    feature: {
      icon: "factory",
      // the card's own copy is that case study — "View the Case Study" landing
      // on the index is the card describing one thing and delivering another
      href: "/results/mexico-plant-leadership",
      cta: "link",
      image: "/images/hero-plant-floor.jpg",
    },
  },
  {
    key: "insights",
    href: "/insights",
    children: [
      { key: "latest", href: "/insights", icon: "lightbulb" },
      {
        key: "manufacturing",
        href: "/insights?category=trends",
        icon: "factory",
      },
      { key: "mexico", href: "/insights?category=market", icon: "globe" },
      // "Research and resources for decision-makers" — the leadership pieces
      // are the closest thing the library holds until real reports exist (Q-26)
      {
        key: "reports",
        href: "/insights?category=leadership",
        icon: "document",
      },
    ],
    feature: {
      icon: "chart",
      href: "/insights/the-new-manufacturing-leader",
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
