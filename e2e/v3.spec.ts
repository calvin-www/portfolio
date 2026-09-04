import { test, expect } from "@playwright/test";

test("home renders the v3 shell with nav and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /calvin wong/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "about", exact: true })).toHaveAttribute("href", "/about");
  await expect(page.getByRole("link", { name: "v1", exact: true })).toHaveAttribute("href", "/v1");
  await expect(page.getByRole("link", { name: "v2", exact: true })).toHaveAttribute("href", "/v2");
  await expect(page.getByRole("link", { name: "resume", exact: true }).first()).toHaveAttribute("href", /drive\.google\.com/);
});
