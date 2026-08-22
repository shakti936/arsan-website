import { expect, test } from "@playwright/test";

/**
 * Page-title heroes. "/" is deliberately absent — see below.
 */
const ROUTES = [
  "/for-clients",
  "/for-clients/executive-search",
  "/for-clients/mexico-advisory",
  "/for-clients/leadership-solutions",
  "/for-candidates",
  "/for-candidates/opportunities",
  "/for-candidates/submit-profile",
  "/for-candidates/talent-network",
  "/results",
  "/insights",
  "/why-arsan",
  "/contact",
];

/**
 * Drew: "make sure all heros have the same text sizes and format." Every hero
 * runs through one component, but a page can still pass a class or a wrapper
 * that changes the rendered size — which is how they drifted apart the first
 * time. This measures what the browser actually computed rather than trusting
 * that they share a component.
 *
 * The home hero is now excluded ON PURPOSE. It carries the *marketing
 * headline* role and every other hero carries the *page title* role — a
 * distinction Drew asked for explicitly (D-089), and one this test would
 * otherwise flatten back out. The exclusion is not a loosening: the second
 * test below pins the difference, so home cannot quietly drift either.
 */
test("every page-title hero renders the same headline and intro type", async ({
  page,
}) => {
  const sizes: Record<string, { h1: string; intro: string; accent: string }> =
    {};

  for (const route of ROUTES) {
    await page.goto(route);
    const read = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((node) => {
          const style = getComputedStyle(node);
          return `${style.fontSize}/${style.fontWeight}/${style.fontFamily.split(",")[0]}`;
        });

    sizes[route] = {
      h1: await read("main section h1"),
      intro: await read("main section h1 ~ p"),
      accent: await read("main section h1 em"),
    };
  }

  const [reference, ...rest] = Object.entries(sizes);
  if (!reference) throw new Error("no routes measured");
  for (const [route, measured] of rest) {
    expect(measured, `${route} differs from ${reference[0]}`).toEqual(
      reference[1],
    );
  }
});

/**
 * The one hero that is allowed to differ, pinned so it differs BY DESIGN.
 *
 * Without this, "exclude / from the uniformity check" would be indistinguishable
 * from "stop checking the home page".
 */
test("the home hero is the marketing headline, and it is larger", async ({
  page,
}) => {
  const size = async (route: string) => {
    await page.goto(route);
    return page
      .locator("main section h1")
      .first()
      .evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  const home = await size("/");
  const inner = await size("/for-clients");

  expect(
    home,
    "the home hero lost its marketing-headline role",
  ).toBeGreaterThan(inner);
});
