import { test, expect } from "@playwright/test";

test.describe("Horizontal Scroll", () => {
  test.describe("Work Section", () => {
    test("cards scroll horizontally on vertical scroll", async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() =>
        document.querySelector('[data-testid="work-section"]')?.scrollIntoView()
      );
      await page.waitForTimeout(500);

      const initialTransform = await page.evaluate(() => {
        const container = document.querySelector(
          '[data-testid="work-section"] .flex.gap-6'
        );
        return container ? window.getComputedStyle(container).transform : null;
      });

      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);

      const newTransform = await page.evaluate(() => {
        const container = document.querySelector(
          '[data-testid="work-section"] .flex.gap-6'
        );
        return container ? window.getComputedStyle(container).transform : null;
      });

      expect(newTransform).not.toBe(initialTransform);
    });

    test("section pins during horizontal scroll", async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() =>
        document.querySelector('[data-testid="work-section"]')?.scrollIntoView()
      );
      await page.waitForTimeout(500);

      const initialTop = await page.evaluate(() => {
        const section = document.querySelector('[data-testid="work-section"]');
        return section?.getBoundingClientRect().top ?? 0;
      });

      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(300);

      const pinnedTop = await page.evaluate(() => {
        const section = document.querySelector('[data-testid="work-section"]');
        return section?.getBoundingClientRect().top ?? 0;
      });

      expect(Math.abs(pinnedTop)).toBeLessThan(50);
    });
  });

  test.describe("Projects Section", () => {
    test("cards scroll horizontally on vertical scroll", async ({ page }) => {
      await page.goto("/");

      await page.evaluate(async () => {
        const work = document.querySelector('[data-testid="work-section"]');
        const workCards = work?.querySelector(".flex.gap-6");
        const workScrollWidth = workCards?.scrollWidth ?? 0;
        const workOffset = (work as HTMLElement)?.offsetTop ?? 0;

        window.scrollTo(0, workOffset + workScrollWidth + 200);
      });
      await page.waitForTimeout(1000);

      const initialTransform = await page.evaluate(() => {
        const container = document.querySelector(
          '[data-testid="projects-section"] .flex.gap-6'
        );
        return container ? window.getComputedStyle(container).transform : null;
      });

      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);

      const newTransform = await page.evaluate(() => {
        const container = document.querySelector(
          '[data-testid="projects-section"] .flex.gap-6'
        );
        return container ? window.getComputedStyle(container).transform : null;
      });

      expect(newTransform).not.toBe(initialTransform);
    });

    test("section pins during horizontal scroll", async ({ page }) => {
      await page.goto("/");

      await page.evaluate(async () => {
        const work = document.querySelector('[data-testid="work-section"]');
        const workCards = work?.querySelector(".flex.gap-6");
        const workScrollWidth = workCards?.scrollWidth ?? 0;
        const workOffset = (work as HTMLElement)?.offsetTop ?? 0;

        window.scrollTo(0, workOffset + workScrollWidth + 200);
      });
      await page.waitForTimeout(1000);

      const initialTop = await page.evaluate(() => {
        const section = document.querySelector(
          '[data-testid="projects-section"]'
        );
        return section?.getBoundingClientRect().top ?? 0;
      });

      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(300);

      const pinnedTop = await page.evaluate(() => {
        const section = document.querySelector(
          '[data-testid="projects-section"]'
        );
        return section?.getBoundingClientRect().top ?? 0;
      });

      expect(Math.abs(pinnedTop)).toBeLessThan(50);
    });
  });
});
