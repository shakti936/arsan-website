import { expect, test } from "@playwright/test";

/**
 * Link previews are invisible to a build and to the browser — nothing on the
 * page changes when they break. These caught two real defects: every page was
 * emitting the *site* title as `og:title` (a child's `openGraph` replaces the
 * parent's wholesale, and only the root layout set one), and the auto-detected
 * image URL used the `/en/` prefix, which 307s under `localePrefix:
 * "as-needed"` and mangles its own cache-busting query on the way.
 */
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

const meta = (html: string, prop: string) =>
  html.match(new RegExp(`${prop}" content="(.*?)"`))?.[1];

for (const locale of ["", "/es"]) {
  test(`og cards are correct for every route (${locale || "en"})`, async ({
    page,
    request,
  }) => {
    const titles = new Set<string>();

    for (const route of ROUTES) {
      const path = `${locale}${route}`.replace("//", "/") || "/";
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
      const html = await page.content();

      const title = meta(html, "og:title");
      const image = meta(html, "og:image");
      expect(title, `og:title missing on ${path}`).toBeTruthy();
      expect(image, `og:image missing on ${path}`).toBeTruthy();
      titles.add(title as string);

      // canonical, unprefixed, no cache-busting query to be mangled
      expect(
        image,
        `og:image should not use the /en prefix on ${path}`,
      ).not.toContain("/en/");
      expect(image, `og:image should carry no query on ${path}`).not.toContain(
        "?",
      );

      // and the image is actually served, without a redirect
      const url = (image as string).replace(
        "https://www.arsancg.com",
        "http://localhost:3000",
      );
      const img = await request.get(url, { maxRedirects: 0 });
      expect(img.status(), `og:image did not resolve for ${path}`).toBe(200);
      expect(img.headers()["content-type"]).toContain("image/png");
    }

    // every route needs its own card, not the site-level one repeated
    expect(titles.size, "og:title is not distinct per route").toBe(
      ROUTES.length,
    );
  });
}
