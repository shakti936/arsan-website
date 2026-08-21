import { expect, test } from "@playwright/test";

/**
 * Locks D-055: the hero is one full-bleed photograph (refs/dirA-home-v2.png),
 * the invented "Where we work" practice index is gone, and the Results and
 * Insights mega panels carry a photograph beside their feature text.
 *
 * A green build proved none of this — every one of these is runtime-only.
 */
test.describe("hero photograph", () => {
  test("renders full-bleed and covers the band", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("main section img").first();
    await expect(img).toBeVisible();
    expect(await img.evaluate((i: HTMLImageElement) => i.currentSrc)).toContain(
      "hero-wide",
    );

    const section = page.locator("main section").first();
    const s = await section.boundingBox();
    const i = await img.boundingBox();
    expect(s).not.toBeNull();
    expect(i).not.toBeNull();
    // the photograph spans the whole band, not a column of it
    expect(i?.width).toBeGreaterThanOrEqual((s?.width ?? 0) - 1);
  });

  test("the invented practice index is gone", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Where we work")).toHaveCount(0);
    await expect(page.getByText("Automotive & Mobility")).toHaveCount(0);
  });

  test("headline and both CTAs are still reachable over the photograph", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Critical talent decisions/,
      }),
    ).toBeVisible();
    // the element under each CTA's own centre point is the CTA itself
    for (const name of ["Discuss a Search", "Why ARSAN"]) {
      const cta = page
        .locator("main section")
        .first()
        .getByRole("link", { name });
      const b = await cta.boundingBox();
      expect(b).not.toBeNull();
      const hit = await page.evaluate(
        ({ x, y }) =>
          document.elementFromPoint(x, y)?.closest("a")?.textContent?.trim(),
        {
          x: (b?.x ?? 0) + (b?.width ?? 0) / 2,
          y: (b?.y ?? 0) + (b?.height ?? 0) / 2,
        },
      );
      expect(hit).toBe(name);
    }
  });
});

test.describe("mega panel photographs", () => {
  for (const section of ["Results", "Insights"]) {
    test(`${section} panel shows its photograph on hover`, async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("link", { name: section, exact: true })
        .first()
        .hover();
      const img = page.locator(`nav ul li:has-text("${section}") img`).first();
      await expect(img).toBeVisible();
      const box = await img.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(80);
    });
  }
});

test("no broken or oversized images on the home page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForLoadState("networkidle");
  const bad = await page.evaluate(() => {
    const shown = [...document.images].filter(
      (i) => i.getBoundingClientRect().width > 0,
    );
    return {
      broken: shown
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
      // a `sizes` that resolves to 0px makes the browser fetch the largest
      // candidate — this is what caught the 3840px request for a 150px slot
      oversized: shown
        .map((i) => {
          const u = new URL(i.currentSrc || i.src, location.href);
          return {
            fetched: Number(u.searchParams.get("w") ?? 0),
            css: Math.round(i.getBoundingClientRect().width),
            src: u.searchParams.get("url"),
          };
        })
        .filter((x) => x.fetched > Math.max(x.css * 2, 640) * 1.6),
    };
  });
  expect(bad.broken).toEqual([]);
  expect(bad.oversized).toEqual([]);
});
