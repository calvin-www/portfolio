import { test, expect } from "@playwright/test";

test.describe("Depth Gauge", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should display depth gauge", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("depth-gauge")).toBeVisible();
  });

  test("should show 0m at top", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    await expect(page.getByTestId("depth-value")).toContainText("0000");
    await expect(page.getByTestId("depth-zone")).toContainText("EPIPELAGIC");
  });

  test("should update depth on scroll", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    const depthValue = await page.getByTestId("depth-value").textContent();
    expect(parseInt(depthValue || "0")).toBeGreaterThan(1000);
  });

  test("should show ABYSSOPELAGIC at bottom", async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await expect(page.getByTestId("depth-value")).toContainText("4000");
    await expect(page.getByTestId("depth-zone")).toContainText("ABYSSOPELAGIC");
  });
});
