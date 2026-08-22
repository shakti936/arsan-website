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
      "hero-executives",
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
      const img = page
        .locator("header nav[aria-label] > ul > li")
        .filter({ has: page.getByRole("link", { name: section, exact: true }) })
        .locator("img")
        .first();
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

const SUBPAGES = [
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

test("every page hero carries a photograph, not just navy", async ({
  page,
}) => {
  const seen: string[] = [];
  for (const route of SUBPAGES) {
    await page.goto(route);
    const img = page.locator("main section img").first();
    await expect(img, `${route} has no hero image`).toBeVisible();
    // next/image serves through /_next/image?url=%2Fimages%2F… — decode before asserting
    const src = decodeURIComponent(
      await img.evaluate((i: HTMLImageElement) => i.currentSrc),
    );
    expect(src, `${route} hero image did not load`).toContain("/images/");
    seen.push(src);
    // the photograph spans the band rather than sitting in a column
    const s = await page.locator("main section").first().boundingBox();
    const i = await img.boundingBox();
    expect(i?.width, route).toBeGreaterThanOrEqual((s?.width ?? 0) - 1);
  }
  expect(seen).toHaveLength(SUBPAGES.length);
});

/**
 * The leadership portraits are 4:5 by design. They stopped being 4:5 without
 * anyone touching the aspect class: as a stretched flex child the line hands
 * the wrapper a definite height, and `aspect-ratio` never gets to set one, so
 * each portrait grew to whatever the bio beside it needed. Ratio is the thing
 * to assert — the class being present proves nothing.
 */
test.describe("leadership portraits keep their 4:5 crop", () => {
  for (const width of [1440, 1024, 834, 390]) {
    test(`at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");
      const ratios = await page
        .locator("section:has-text('Senior people') img")
        .evaluateAll((els) =>
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return r.width / r.height;
          }),
        );
      expect(ratios).toHaveLength(3);
      for (const ratio of ratios) expect(ratio).toBeCloseTo(0.8, 2);
    });
  }
});
