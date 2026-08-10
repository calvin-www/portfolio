import { test, expect, type Page } from "@playwright/test";

/**
 * /v3 "Scroll World" — the flight itself is the feature, so these tests sample
 * it at intervals and assert on what a visitor would actually see: that copy is
 * readable for most of the scroll, that scenes never double-expose at a seam,
 * and that the chrome agrees with the timeline.
 */

const SAMPLES = 24;

async function scrollTo(page: Page, fraction: number) {
  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(max * fraction));
  // Let the rAF smoothing settle onto the target before sampling.
  await page.waitForTimeout(350);
}

function opacities(page: Page, selector: string) {
  return page.$$eval(selector, (els) =>
    els.map((el) => Number(getComputedStyle(el).opacity))
  );
}

test.describe("scroll world", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/v3");
    await page.waitForSelector(".sw-stage");
  });

  test("greets on landing without requiring a scroll", async ({ page }) => {
    // The opening scene's copy must be up before the first scroll, otherwise
    // the landing screen is a blank world.
    await page.waitForTimeout(400);
    const copy = await opacities(page, ".sw-copy");
    expect(copy[0]).toBeGreaterThan(0.9);
    await expect(page.locator(".sw-copy").first()).toContainText("Calvin Wong");
  });

  test("copy is readable across most of the flight", async ({ page }) => {
    let readable = 0;
    for (let i = 0; i <= SAMPLES; i++) {
      await scrollTo(page, i / SAMPLES);
      const copy = await opacities(page, ".sw-copy");
      if (Math.max(...copy) > 0.85) readable++;
    }
    // Guards against pacing where dives and connectors crowd out the lingers
    // and the page reads as mostly empty.
    expect(readable / (SAMPLES + 1)).toBeGreaterThan(0.5);
  });

  test("never double-exposes two scenes at a seam", async ({ page }) => {
    for (let i = 0; i <= SAMPLES; i++) {
      await scrollTo(page, i / SAMPLES);
      const scenes = await opacities(page, ".sw-scene");
      const strong = scenes.filter((o) => o > 0.5).length;
      expect(strong, `two scenes both strongly visible at p=${i / SAMPLES}`).toBeLessThan(2);
    }
  });

  test("advances through every scene and keeps the chrome in sync", async ({ page }) => {
    const seen = new Set<number>();
    for (let i = 0; i <= SAMPLES; i++) {
      await scrollTo(page, i / SAMPLES);
      const { rail, nav } = await page.evaluate(() => ({
        rail: [...document.querySelectorAll(".sw-rail__dot")].findIndex((d) =>
          d.classList.contains("is-active")
        ),
        nav: [...document.querySelectorAll(".sw-topnav button")].findIndex((b) =>
          b.classList.contains("is-active")
        ),
      }));
      expect(rail, "rail and top nav disagree on the active scene").toBe(nav);
      seen.add(rail);
    }
    const total = await page.locator(".sw-rail__dot").count();
    expect(seen.size).toBe(total);
  });

  test("route rail jumps to a scene", async ({ page }) => {
    await page.locator(".sw-rail__dot").nth(4).click();
    await expect(page.locator(".sw-rail__dot").nth(4)).toHaveClass(/is-active/);
    // The jump is a smooth scroll feeding a smoothed camera, so poll for the
    // arrival rather than guessing how long both take to settle.
    await expect
      .poll(async () => (await opacities(page, ".sw-copy"))[4], { timeout: 8000 })
      .toBeGreaterThan(0.85);
  });

  test("content comes from resume.json", async ({ page }) => {
    await scrollTo(page, 1);
    const contact = page.locator(".sw-copy").last();
    await expect(contact).toContainText("calvintwong25@gmail.com");
    await expect(contact.locator("a.sw-cta--primary")).toHaveAttribute(
      "href",
      /^mailto:/
    );
  });

  test("reduced motion degrades to a static document", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/v3");
    await expect(page.locator(".sw-static")).toBeVisible();
    // No fixed stage means no scroll-driven camera at all.
    await expect(page.locator(".sw-stage")).toHaveCount(0);
    await expect(page.locator(".sw-static__scene")).toHaveCount(7);
    await expect(page.locator(".sw-static a")).not.toHaveCount(0);
    await context.close();
  });
});

test.describe("scroll world on a phone", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only expectations");

  test("fits the viewport and keeps its calls to action reachable", async ({ page }) => {
    await page.goto("/v3");
    await page.waitForSelector(".sw-stage");
    await scrollTo(page, 1);

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflows, "page scrolls horizontally").toBe(false);

    const cta = page.locator(".sw-copy").last().locator("a.sw-cta--primary");
    await expect(cta).toBeInViewport();

    // Rail buttons must stay tappable at the platform minimum.
    const box = await page.locator(".sw-rail__dot").first().boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});
