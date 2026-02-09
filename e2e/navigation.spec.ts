import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should display navigation bar with all links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: "ABOUT" })).toBeVisible();
    await expect(page.getByRole("link", { name: "WORK" })).toBeVisible();
    await expect(page.getByRole("link", { name: "PROJECTS" })).toBeVisible();
    await expect(page.getByRole("link", { name: "CONTACT" })).toBeVisible();
  });

  test("should display HUD elements", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    await expect(page.getByText(/SECTOR/)).toBeVisible();
    await expect(page.getByText(/SYS.STATUS/)).toBeVisible();
  });

  test("should scroll to sections on nav click", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "ABOUT" }).click();
    await page.waitForTimeout(1500);
    await expect(page.getByTestId("about-section")).toBeInViewport();
  });
});

test.describe("Theme Toggle", () => {
  test("should toggle between light and dark mode", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("should persist theme on reload", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should show flashlight overlay only in dark mode", async ({ page }) => {
    await page.goto("/");

    const flashlight = page.getByTestId("flashlight-overlay");
    await expect(flashlight).not.toBeVisible();

    await page.getByTestId("theme-toggle").click();
    await expect(flashlight).toBeVisible();
  });
});
