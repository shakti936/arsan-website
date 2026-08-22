import { expect, test } from "@playwright/test";

/**
 * Every clickable thing has to land somewhere real.
 *
 * This crawls rather than checking a list, because a list only covers the
 * pages someone remembered to add. Starting from both locale roots it follows
 * every internal link it finds — which reaches the article, case-study and
 * opening detail pages without naming a single slug — and checks three things
 * a green build cannot:
 *
 *   1. the URL resolves at all
 *   2. it is not the 404 page wearing a 200
 *   3. for `#anchor` links, the element it names exists on the page it lands on
 *
 * The third is the one that rots silently: renaming a section id breaks a
 * mega-nav row with no error anywhere, in either language.
 *
 * Query strings are part of a page's identity here, so `/insights` and
 * `/insights?category=trends` are crawled as two destinations — that is the
 * whole point of the category tabs being links.
 */

/** Entry points. The crawl expands from here; nothing below is a full list. */
const SEEDS = ["/", "/es"];

/** A runaway-crawl backstop, not a real bound — the site is ~120 URLs. */
const MAX_VISITS = 400;

test("every internal link resolves, and every anchor exists", async ({
  page,
}) => {
  test.setTimeout(180_000);

  const queue = [...SEEDS];
  const queued = new Set(queue);
  /** url → the pages that linked to it, for a legible failure message */
  const referrers = new Map<string, Set<string>>();
  /** path → the anchors other pages expect to find on it */
  const anchors = new Map<string, Map<string, Set<string>>>();
  const broken: string[] = [];

  const note = (map: Map<string, Set<string>>, key: string, from: string) => {
    const set = map.get(key) ?? new Set<string>();
    set.add(from);
    map.set(key, set);
  };

  let visits = 0;
  while (queue.length && visits < MAX_VISITS) {
    const from = queue.shift() as string;
    visits += 1;

    const response = await page.goto(from);
    const status = response?.status() ?? 0;
    const notFound = await page
      .getByRole("heading", { name: /404|not found|no encontrada/i })
      .count();

    if (status >= 400 || notFound > 0) {
      const cited = [...(referrers.get(from) ?? ["(seed)"])].join(", ");
      broken.push(`${from} → ${status || "404 page"} ← linked from ${cited}`);
      continue;
    }

    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href") ?? ""));

    for (const href of hrefs) {
      // external, mail:, tel: and same-page fragments are out of scope
      if (!href.startsWith("/")) continue;
      const [path = "/", hash = ""] = href.split("#");
      const url = path || from;
      if (hash) {
        const forPath = anchors.get(url) ?? new Map<string, Set<string>>();
        note(forPath, hash, from);
        anchors.set(url, forPath);
      }
      note(referrers, url, from);
      if (!queued.has(url)) {
        queued.add(url);
        queue.push(url);
      }
    }
  }

  expect(
    visits,
    "the crawl hit its backstop — is something generating URLs?",
  ).toBeLessThan(MAX_VISITS);
  expect(queued.size, "almost nothing was crawled").toBeGreaterThan(40);

  // a crawler that quietly stops one hop short still reports all-green, so
  // assert it actually descended into each family of detail page
  const reached = (re: RegExp) => [...queued].filter((u) => re.test(u)).length;
  expect(reached(/^\/insights\/[a-z-]+$/), "no article pages").toBeGreaterThan(
    2,
  );
  expect(
    reached(/^\/results\/[a-z-]+$/),
    "no case-study pages",
  ).toBeGreaterThan(0);
  expect(
    reached(/^\/for-candidates\/opportunities\/[a-z0-9-]+$/),
    "no opening pages",
  ).toBeGreaterThan(2);
  expect(
    reached(/^\/es\//),
    "the Spanish site was not crawled",
  ).toBeGreaterThan(10);

  // anchors last: a target may be discovered after its page was visited
  const missing: string[] = [];
  for (const [path, wanted] of anchors) {
    await page.goto(path);
    for (const [hash, from] of wanted) {
      // `CSS.escape` is a browser API — unavailable in the test runner
      const found = await page.evaluate(
        (id) => !!document.getElementById(id),
        hash,
      );
      if (!found) missing.push(`${path}#${hash} ← ${[...from].join(", ")}`);
    }
  }

  expect(broken, `dead links:\n${broken.join("\n")}`).toEqual([]);
  expect(
    missing,
    `links to anchors that do not exist:\n${missing.join("\n")}`,
  ).toEqual([]);
});

/**
 * A link that resolves is not the same as a link that goes somewhere. Four
 * rows of the Insights mega panel and three of the Results panel used to land
 * on the identical page; these assert the destinations stayed distinct.
 */
test("insights category links land filtered", async ({ page }) => {
  await page.goto("/insights");
  const all = await page.locator("article").count();
  expect(all).toBeGreaterThan(2);

  await page.goto("/insights?category=market");
  const filtered = await page.locator("article").count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered, "the category filter changed nothing").toBeLessThan(all);
  // scoped to the filter bar by its accessible name: the header marks Insights
  // as current here too (correctly), and the mega panel and footer both link
  // this same category — which is the point of retargeting them
  const bar = page.getByRole("navigation", {
    name: /filter insights by category/i,
  });
  await expect(bar.locator('a[aria-current="page"]')).toHaveAttribute(
    "href",
    "/insights?category=market",
  );

  // a category nobody asked for falls back to everything rather than to empty
  await page.goto("/insights?category=nonsense");
  expect(await page.locator("article").count()).toBe(all);
});
