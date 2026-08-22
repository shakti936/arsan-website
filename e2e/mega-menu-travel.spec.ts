import { expect, type Page, test } from "@playwright/test";

/**
 * The mega menu, from the pointer's point of view.
 *
 * State lives in one place (src/components/layout/nav-menu.tsx): the header
 * holds a single `openKey`, so "two panels open" is unrepresentable rather
 * than merely unlikely. These tests hold that guarantee to the DOM — the
 * animated wrapper is the element that carries `visibility`, so it is what
 * Playwright's visible/hidden checks have to look at.
 */
const item = (page: Page, key: string) =>
  page.locator(`header [data-nav-key="${key}"]`);
const panel = (page: Page, key: string) =>
  item(page, key).locator("div.absolute > div").first();
const trigger = (page: Page, key: string) =>
  item(page, key).locator("> a").first();

/** Every panel the browser is currently painting, by nav key. */
const openPanels = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("header [data-nav-key]")]
      .filter((li) => {
        const wrapper = li.querySelector("div.absolute > div");
        return wrapper
          ? getComputedStyle(wrapper).visibility !== "hidden"
          : false;
      })
      .map((li) => li.getAttribute("data-nav-key")),
  );

test.describe("mega panel is reachable with the mouse", () => {
  for (const key of ["forClients", "results", "insights"]) {
    test(`${key}: the panel survives the trip from the item to the panel`, async ({
      page,
    }) => {
      await page.goto("/");
      const link = trigger(page, key);
      const p = panel(page, key);

      await link.hover();
      await expect(p).toBeVisible();

      const l = await link.boundingBox();
      const box = await p.boundingBox();
      if (!l || !box) throw new Error("no bounding box");
      const x = l.x + l.width / 2;

      // walk down through the gap the way a hand does, a few px at a time
      for (let y = l.y + l.height - 2; y <= box.y + 30; y += 3) {
        await page.mouse.move(x, y);
        await expect(
          p,
          `panel closed while the pointer was at y=${y.toFixed(0)}`,
        ).toBeVisible();
      }

      // and a link inside the panel is now actually clickable
      const first = p.getByRole("link").first();
      const fb = await first.boundingBox();
      if (!fb) throw new Error("panel link has no bounding box");
      const at = { x: fb.x + fb.width / 2, y: fb.y + fb.height / 2 };
      await page.mouse.move(at.x, at.y);
      const hit = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("a") !== null,
        at,
      );
      expect(hit).toBe(true);
    });
  }
});

/**
 * The bug Drew reported: traversing the nav painted two full-width panels on
 * top of each other. `visibility` was inside a 200ms transition and is not
 * interpolatable, so the outgoing panel stayed on screen for the whole
 * duration while the incoming one was already up. Sampling matters here — the
 * overlap was invisible at t=0 and gone by t≈210ms.
 */
test("never two panels at once, sampled across the traverse", async ({
  page,
}) => {
  await page.goto("/");
  const order = [
    "whyArsan",
    "forClients",
    "results",
    "insights",
    "forClients",
  ] as const;

  await trigger(page, order[0]).hover();
  await expect.poll(() => openPanels(page)).toEqual([order[0]]);

  for (const key of order.slice(1)) {
    const box = await trigger(page, key).boundingBox();
    if (!box) throw new Error(`no bounding box for ${key}`);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    // the old overlap opened at ~40ms and cleared at ~210ms, so a single
    // sample at either end would have called it clean
    for (let elapsed = 0; elapsed <= 240; elapsed += 30) {
      const open = await openPanels(page);
      expect(
        open.length,
        `${open.join(",")} open ~${elapsed}ms into ${key}`,
      ).toBeLessThan(2);
      await page.waitForTimeout(30);
    }
    await expect.poll(() => openPanels(page)).toEqual([key]);
  }
});

/**
 * Sliding off a nav item onto the logo, the locale switcher or the CTA left
 * the panel hanging open with the pointer nowhere near it: per-item
 * `pointerenter` had nothing to say about the rest of the header row.
 */
for (const [what, locator] of [
  // the header row itself, not the /contact links inside the panels
  ["the logo", 'header > div > a[href="/"]'],
  ["the CTA", 'header > div > div > a[href="/contact"]'],
] as const) {
  test(`moving from a nav item onto ${what} closes the panel`, async ({
    page,
  }) => {
    await page.goto("/");
    await trigger(page, "results").hover();
    await expect(panel(page, "results")).toBeVisible();

    await page.locator(locator).first().hover();
    await expect(panel(page, "results")).toBeHidden();
  });
}

test("clicking a nav item does not leave its panel open over the new page", async ({
  page,
}) => {
  await page.goto("/");
  await trigger(page, "results").hover();
  await expect(panel(page, "results")).toBeVisible();

  // click through — the pointer stays exactly where it was
  await trigger(page, "results").click();
  await page.waitForURL("**/results");
  await expect(panel(page, "results")).toBeHidden();
  await page.waitForTimeout(300);
  await expect(panel(page, "results")).toBeHidden();

  // moving off the item and back restores normal hover behaviour
  await page.mouse.move(20, 400);
  await trigger(page, "results").hover();
  await expect(panel(page, "results")).toBeVisible();
});

test("clicking a link inside the panel closes it too", async ({ page }) => {
  await page.goto("/");
  await trigger(page, "results").hover();
  await expect(panel(page, "results")).toBeVisible();

  await panel(page, "results")
    .getByRole("link", { name: "Case Studies" })
    .first()
    .click();
  await page.waitForURL(/results/);
  // hiding the panel yanks it out from under the pointer, which fires
  // pointerleave on the header — the panel must not come back because of it
  await expect(panel(page, "results")).toBeHidden();
  await page.waitForTimeout(400);
  await expect(panel(page, "results")).toBeHidden();
});

test.describe("keyboard", () => {
  test("focus opens the panel, and Escape closes it without stranding focus", async ({
    page,
  }) => {
    await page.goto("/");
    await trigger(page, "forClients").focus();
    await expect(panel(page, "forClients")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel(page, "forClients")).toBeHidden();
    await expect(trigger(page, "forClients")).toBeFocused();

    // and the menu is not left permanently suppressed for a keyboard user
    await trigger(page, "results").focus();
    await expect(panel(page, "results")).toBeVisible();
  });

  test("tabbing out of the nav closes the panel", async ({ page }) => {
    await page.goto("/");
    await trigger(page, "insights").focus();
    await expect(panel(page, "insights")).toBeVisible();

    await page.locator('header > div > div > a[href="/contact"]').focus();
    await expect(panel(page, "insights")).toBeHidden();
  });
});
