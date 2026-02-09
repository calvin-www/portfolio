import { test, expect, devices } from "@playwright/test";

test.describe("Mobile Experience", () => {
  test.use({ ...devices["Pixel 5"] });

  test("should hide custom cursor on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("custom-cursor")).not.toBeVisible();
  });

  test("should hide shark on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("shark-canvas")).not.toBeVisible();
  });

  test("should hide depth gauge on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("depth-gauge")).not.toBeVisible();
  });

  test("should display all sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/CALVIN/i)).toBeVisible();

    await page.evaluate(() =>
      document.querySelector('[data-testid="about-section"]')?.scrollIntoView()
    );
    await expect(page.getByText(/DIGITAL ALCHEMIST/i)).toBeVisible();
  });

  test("should display navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation")).toBeVisible();
  });
});
