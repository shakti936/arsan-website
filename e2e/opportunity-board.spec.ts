import { expect, test } from "@playwright/test";

/**
 * The board filters, sorts and paginates in the browser over a list the
 * server hands it. When that moves behind the ATS query these assertions are
 * what says the behaviour survived the move — they are written against what a
 * candidate sees, not against the implementation.
 */
test.describe("opportunities board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/for-candidates/opportunities");
  });

  const count = (page: import("@playwright/test").Page) =>
    page.getByRole("listitem").filter({ hasText: "View details" });

  test("opens filtered to full-time, and the count agrees with the facet", async ({
    page,
  }) => {
    const fullTime = page.getByRole("checkbox", { name: /^Full-time/ });
    await expect(fullTime).toBeChecked();

    // "Full-time (25)" and "Showing 25 opportunities" have to be the same 25
    const label = await fullTime.evaluate(
      (node) => node.closest("label")?.textContent ?? "",
    );
    const facet = label.match(/\((\d+)\)/)?.[1];
    await expect(page.getByText(/Showing \d+ opportunit/)).toHaveText(
      `Showing ${facet} opportunities`,
    );
  });

  test("a facet narrows the list and clearing restores it", async ({
    page,
  }) => {
    expect(await count(page).count()).toBeGreaterThan(0);

    await page.getByRole("checkbox", { name: /^Mexico/ }).check();
    await expect(count(page)).not.toHaveCount(0);
    for (const card of await count(page).all()) {
      await expect(card).toContainText("Mexico");
    }

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(
      page.getByRole("checkbox", { name: /^Mexico/ }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: /^Full-time/ }),
    ).not.toBeChecked();
  });

  test("search matches title, company and location", async ({ page }) => {
    await page
      .getByRole("searchbox", { name: "Search jobs" })
      .fill("Monterrey");
    const cards = count(page);
    await expect(cards).not.toHaveCount(0);
    for (const card of await cards.all()) {
      await expect(card).toContainText("Monterrey");
    }
  });

  test("a search with no matches explains itself rather than showing nothing", async ({
    page,
  }) => {
    await page
      .getByRole("searchbox", { name: "Search jobs" })
      .fill("zzzz-no-such-role");
    await expect(count(page)).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /No opportunities match/ }),
    ).toBeVisible();
  });

  test("pagination moves through the results", async ({ page }) => {
    const first = await count(page).first().textContent();
    await page.getByRole("button", { name: "Go to page 2" }).click();
    await expect(
      page.getByRole("button", { name: "Go to page 2" }),
    ).toHaveAttribute("aria-current", "page");
    expect(await count(page).first().textContent()).not.toBe(first);
  });

  test("every listing opens a page that exists", async ({ page }) => {
    // the board is generated from a list; a card that links nowhere is the
    // failure mode that would otherwise ship silently across all of them
    const title = await count(page).first().getByRole("link").textContent();
    await count(page).first().getByRole("link").click();
    await expect(
      page.getByRole("heading", { level: 1, name: title ?? "" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "All opportunities" }),
    ).toBeVisible();
  });

  test("filtering resets to page one", async ({ page }) => {
    await page.getByRole("button", { name: "Go to page 2" }).click();
    await page.getByRole("checkbox", { name: /^Mexico/ }).check();
    await expect(
      page.getByRole("button", { name: "Go to page 1" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
