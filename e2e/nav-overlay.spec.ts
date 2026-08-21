import { expect, test } from "@playwright/test";

/**
 * Regression guard for SOP D-045: the mega-menu wrapper was always mounted,
 * spanned the full viewport width, and — because `visibility: hidden` children
 * still occupy layout space — hung an invisible ~450px curtain across the top
 * of every page. It swallowed hovers (opening menus at random) and, worse,
 * swallowed clicks on the hero CTA.
 */
test.describe("mega-menu must not overlay the page when closed", () => {
  test("the hero CTA is the element under its own centre point", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page
      .locator("main a", { hasText: /Discuss a Search/i })
      .first();
    const box = await cta.boundingBox();
    if (!box) throw new Error("hero CTA has no bounding box");

    const hit = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return el?.closest("header")
          ? "covered-by-header-element"
          : "reachable";
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );

    expect(hit).toBe("reachable");
  });

  test("hovering well below the header opens no panel", async ({ page }) => {
    await page.goto("/");
    const headerBottom = await page.evaluate(() => {
      const header = document.querySelector("header");
      if (!header) throw new Error("header not found");
      return header.getBoundingClientRect().bottom;
    });

    await page.mouse.move(720, headerBottom + 200);
    await page.waitForTimeout(350);

    const visiblePanels = await page.evaluate(
      () =>
        [...document.querySelectorAll("header nav li > div")].filter(
          (panel) => {
            const inner = panel.firstElementChild ?? panel;
            const s = getComputedStyle(inner);
            return s.visibility !== "hidden" && Number(s.opacity) > 0;
          },
        ).length,
    );

    expect(visiblePanels).toBe(0);
  });

  test("hovering a nav item still opens its panel", async ({ page }) => {
    await page.goto("/");
    await page.hover("header nav li:first-child a");
    await expect(
      page
        .getByRole("link", { name: /Executive & Professional Search/i })
        .first(),
    ).toBeVisible();
  });
});

/**
 * SOP D-051: the header carries `position: sticky` from a component-layer
 * class. A Tailwind `relative` utility on the same element silently won out
 * (utilities layer wins) and the header scrolled away while still condensing,
 * which looked like the feature working.
 */
test.describe("sticky header", () => {
  test("stays pinned and condenses once scrolled", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    const atTop = await header.boundingBox();

    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(400);
    const scrolled = await header.boundingBox();

    if (!atTop || !scrolled) throw new Error("header has no bounding box");
    expect(scrolled.y).toBe(0);
    expect(scrolled.height).toBeLessThan(atTop.height);
  });
});
