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

test("home shows the headline and intro", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("i like 2 build stuff :D");
  await expect(page.getByText(/national championship/i).first()).toBeVisible();
});

test("home lists all fifteen entries newest first", async ({ page }) => {
  await page.goto("/");
  const rows = page.getByTestId("entry-row");
  await expect(rows).toHaveCount(15);
  await expect(rows.first()).toContainText("JPMorgan Chase");
  await expect(rows.last()).toContainText("Oculosophy");
});

test("filter updates the URL and the list, and survives reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "hackathons", exact: true }).click();
  await expect(page).toHaveURL(/\?filter=hackathons$/);
  const rows = page.getByTestId("entry-row");
  await expect(rows).toHaveCount(4);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-type", "hackathons");
  }
  await page.reload();
  await expect(page.getByTestId("entry-row")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "hackathons", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "all", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("entry-row")).toHaveCount(15);
});
