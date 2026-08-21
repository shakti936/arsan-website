/**
 * Navigation model. Labels/descriptions come from the "nav" message namespace
 * keyed by `key` — no user-facing strings here.
 *
 * NOTE (D-023): candidate-portal routes (opportunities, profile) are NOT here.
 * They are gated on the AIOS scope change and must not be promised in nav.
 */
export type NavChild = { key: string; href: string };
export type NavSection = { key: string; href: string; children: NavChild[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "forClients",
    href: "/for-clients",
    children: [
      { key: "executiveSearch", href: "/for-clients/executive-search" },
      { key: "mexicoAdvisory", href: "/for-clients/mexico-advisory" },
      { key: "leadershipSolutions", href: "/for-clients/leadership-solutions" },
    ],
  },
  {
    key: "forCandidates",
    href: "/for-candidates",
    children: [],
  },
  {
    key: "results",
    href: "/results",
    children: [],
  },
  {
    key: "insights",
    href: "/insights",
    children: [],
  },
  {
    key: "whyArsan",
    href: "/why-arsan",
    children: [
      { key: "ourDifference", href: "/why-arsan#difference" },
      { key: "ourPeople", href: "/why-arsan#people" },
      { key: "howWeWork", href: "/why-arsan#how-we-work" },
    ],
  },
];
