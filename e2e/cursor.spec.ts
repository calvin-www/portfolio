import { test, expect } from "@playwright/test";

test.describe("Custom Cursor - Desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should display custom cursor on desktop", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("custom-cursor")).toBeVisible();
  });

  test("should display cursor ring", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("cursor-ring")).toBeVisible();
  });
});

test.describe("Custom Cursor - Mobile", () => {
  test("should hide custom cursor on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByTestId("custom-cursor")).not.toBeVisible();
  });
});
