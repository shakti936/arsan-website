import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
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
 */
test("every hero renders the same headline and intro type", async ({
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
