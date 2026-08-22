import { expect, test } from "@playwright/test";

/**
 * The type scale, asserted as behaviour rather than trusted as CSS.
 *
 * Three of these encode acceptance criteria that a green build cannot check:
 * headings that no longer blend into body text (a ratio, not an opinion), one
 * H1 per page, and a scale that actually responds. The fourth catches the
 * failure that has now shipped twice — a role token dropped by tailwind-merge,
 * which leaves the element rendering at inherited size in inherited colour
 * with no error anywhere (D-043, D-089).
 */
const PAGES = [
  "/",
  "/for-clients",
  "/for-clients/executive-search",
  "/for-candidates",
  "/for-candidates/opportunities",
  "/results",
  "/insights",
  "/insights/the-new-manufacturing-leader",
  "/results/mexico-plant-leadership",
  "/why-arsan",
  "/contact",
];

/** Body copy is 17px; a section heading must clear this multiple of it. */
const MIN_HEADING_RATIO = 2;

type Measured = { h1: number; h2: number | null; body: number; h1s: number };

async function measure(
  page: import("@playwright/test").Page,
): Promise<Measured> {
  return page.evaluate(() => {
    const px = (el: Element | null) =>
      el ? parseFloat(getComputedStyle(el).fontSize) : null;
    const h1s = document.querySelectorAll("h1");
    const body = parseFloat(getComputedStyle(document.body).fontSize);
    return {
      h1: px(h1s[0] ?? null) ?? 0,
      h2: px(document.querySelector("h2")),
      body,
      h1s: h1s.length,
    };
  });
}

test("every page has exactly one H1, sized as a role", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const wrong: string[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    const m = await measure(page);
    if (m.h1s !== 1) wrong.push(`${path}: ${m.h1s} <h1> elements`);
    // title is 48px and headline 56px at this width; anything at or below the
    // 25px subheading means the role class was dropped, not chosen
    if (m.h1 < 40) wrong.push(`${path}: h1 is ${m.h1}px — role class lost?`);
  }
  expect(wrong, wrong.join("\n")).toEqual([]);
});

test("section headings do not blend into body text", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const weak: string[] = [];
  let found = 0;

  for (const path of PAGES) {
    await page.goto(path);
    // by ROLE, not by tag. A filter-panel label is an h2 and is *correctly*
    // smaller than a section heading; measuring "the first h2" would call that
    // a failure and push a genuine hierarchy flat to satisfy a test.
    const sizes = await page.locator(".text-heading").evaluateAll((nodes) => ({
      body: parseFloat(getComputedStyle(document.body).fontSize),
      px: nodes.map((n) => parseFloat(getComputedStyle(n).fontSize)),
    }));
    found += sizes.px.length;
    for (const px of sizes.px) {
      const ratio = px / sizes.body;
      if (ratio < MIN_HEADING_RATIO) {
        weak.push(
          `${path}: heading ${px}px vs body ${sizes.body}px = ${ratio.toFixed(2)}× (need ${MIN_HEADING_RATIO}×)`,
        );
      }
    }
  }

  expect(
    found,
    "no .text-heading elements found — did the role get renamed?",
  ).toBeGreaterThan(10);
  expect(weak, weak.join("\n")).toEqual([]);
});

test("the scale responds, and stays in order at every width", async ({
  page,
}) => {
  const seen: Measured[] = [];
  for (const w of [390, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/");
    const m = await measure(page);
    seen.push(m);
    // hierarchy must hold at BOTH ends — a clamp that crosses over at some
    // width is worse than no clamp, because it only breaks on some screens
    expect(m.h1, `h1 <= h2 at ${w}px`).toBeGreaterThan(m.h2 ?? 0);
    expect(m.h2 ?? 0, `h2 <= body at ${w}px`).toBeGreaterThan(m.body);
  }
  const [small, large] = seen as [Measured, Measured];
  expect(large.h1, "h1 does not scale with viewport").toBeGreaterThan(small.h1);
  expect(large.h2 ?? 0, "h2 does not scale with viewport").toBeGreaterThan(
    small.h2 ?? 0,
  );
});

test("heroes did not get taller when the scale grew", async ({ page }) => {
  // measured before the rescale (D-089); the home hero is allowed the 10px it
  // gained carrying a 17% larger headline, nothing else may grow at all
  const CEILING: Record<string, number> = {
    "/": 605,
    "/for-clients": 622,
    "/for-candidates": 622,
    "/results": 663,
    "/insights": 647,
    "/why-arsan": 590,
    "/contact": 559,
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  const grew: string[] = [];
  for (const [path, max] of Object.entries(CEILING)) {
    await page.goto(path);
    const h = await page.evaluate(() => {
      const hero = document.querySelector("h1")?.closest("section");
      return hero ? Math.round(hero.getBoundingClientRect().height) : 0;
    });
    if (h > max) grew.push(`${path}: hero ${h}px > ${max}px`);
  }
  expect(grew, grew.join("\n")).toEqual([]);
});
