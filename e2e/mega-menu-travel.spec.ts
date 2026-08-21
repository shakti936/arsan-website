import { expect, test } from "@playwright/test";

/**
 * The pointer has to be able to travel from a nav item down into its panel.
 * The panel is anchored to the header's bottom edge, but the `li` that owns
 * the hover ends at the link — leaving a strip of header padding that belongs
 * to neither. Crossing it dropped `group-hover` and closed the panel before
 * the pointer arrived.
 */
test.describe("mega panel is reachable with the mouse", () => {
  for (const section of ["For Clients", "Results", "Insights"]) {
    test(`${section}: the panel survives the trip from the item to the panel`, async ({
      page,
    }) => {
      await page.goto("/");
      const link = page
        .getByRole("link", { name: section, exact: true })
        .first();
      // top-level items only — the panels contain their own <li>s, and one of
      // them ("Career Resources: Insights and guidance…") matches "Insights"
      const li = page
        .locator("header nav[aria-label] > ul > li")
        .filter({
          has: page.getByRole("link", { name: section, exact: true }),
        })
        .first();
      const panel = li.locator("div.absolute").first();

      await link.hover();
      await expect(panel).toBeVisible();

      const l = await link.boundingBox();
      const p = await panel.boundingBox();
      expect(l).not.toBeNull();
      expect(p).not.toBeNull();
      const x = (l?.x ?? 0) + (l?.width ?? 0) / 2;

      // walk down through the gap the way a hand does, a few px at a time
      for (
        let y = (l?.y ?? 0) + (l?.height ?? 0) - 2;
        y <= (p?.y ?? 0) + 30;
        y += 3
      ) {
        await page.mouse.move(x, y);
        await expect(
          panel,
          `panel closed while the pointer was at y=${y.toFixed(0)}`,
        ).toBeVisible();
      }

      // and a link inside the panel is now actually clickable
      const first = panel.getByRole("link").first();
      const fb = await first.boundingBox();
      expect(fb).not.toBeNull();
      await page.mouse.move(
        (fb?.x ?? 0) + (fb?.width ?? 0) / 2,
        (fb?.y ?? 0) + (fb?.height ?? 0) / 2,
      );
      await expect(first).toBeVisible();
      const hit = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("a") !== null,
        {
          x: (fb?.x ?? 0) + (fb?.width ?? 0) / 2,
          y: (fb?.y ?? 0) + (fb?.height ?? 0) / 2,
        },
      );
      expect(hit).toBe(true);
    });
  }
});

test("clicking a nav item does not leave its panel open over the new page", async ({
  page,
}) => {
  await page.goto("/");
  const li = page
    .locator("header nav[aria-label] > ul > li")
    .filter({ has: page.getByRole("link", { name: "Results", exact: true }) })
    .first();
  const panel = li.locator("div.absolute").first();

  await page
    .getByRole("link", { name: "Results", exact: true })
    .first()
    .hover();
  await expect(panel).toBeVisible();

  // click through — the pointer stays exactly where it was
  await page
    .getByRole("link", { name: "Results", exact: true })
    .first()
    .click();
  await page.waitForURL("**/results");
  await expect(panel).toBeHidden();

  // moving off the item and back restores normal hover behaviour
  await page.mouse.move(20, 400);
  await page
    .getByRole("link", { name: "Results", exact: true })
    .first()
    .hover();
  await expect(panel).toBeVisible();
});
