import { test, expect } from "@playwright/test";

test.describe("Reduced Motion", () => {
  test("should hide animated elements when reduced motion is preferred", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    await expect(page.getByTestId("shark-canvas")).not.toBeVisible();
    await expect(page.getByTestId("custom-cursor")).not.toBeVisible();
  });

  test("should still display content with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByText(/CALVIN/i)).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByTestId("theme-toggle")).toBeVisible();
  });

  test("should allow theme toggle with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Keyboard Navigation", () => {
  test("should allow keyboard navigation", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON"]).toContain(focused);
  });

  test("should activate theme toggle with Enter", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("theme-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
