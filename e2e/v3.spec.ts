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

test("home shows the headline and the statement", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("i like 2 build stuff :D");
  await expect(page.getByRole("region", { name: "in one line" })).toContainText(/compiler/);
});

test("the statement types out as you scroll and the nav catches the top", async ({ page }) => {
  await page.goto("/");
  const statement = page.getByRole("region", { name: "in one line" });
  const nav = page.locator("nav");
  const revealed = () =>
    statement.locator(".v3-ch").evaluateAll((els) => els.filter((el) => Number(getComputedStyle(el).opacity) > 0.5).length);
  expect(await revealed()).toBe(0);
  // Scroll past the end of the statement's runway: every character is revealed.
  const total = await statement.locator(".v3-ch").count();
  expect(total).toBeGreaterThan(20);
  await statement.evaluate((el) => window.scrollTo(0, el.offsetTop + el.offsetHeight));
  await expect.poll(revealed).toBe(total);
  // The page is hydrated by now (the reveal is client-driven) and the nav is still below the fold.
  await expect(nav).toHaveAttribute("data-stuck", "false");
  // Keep going: the nav is now stuck to the top of the viewport.
  await page.locator("#list").evaluate((el) => el.scrollIntoView());
  await expect(nav).toHaveAttribute("data-stuck", "true");
  expect(await nav.evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
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

test("modal opens from the URL and escape closes it", async ({ page }) => {
  await page.goto("/?item=mockowl");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "MockOwl" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /source/i })).toHaveAttribute("href", /github\.com/);
  // Wait for the panel's own auto-focus effect to land before sending a key event:
  // in `next dev` the SSR markup paints (and passes toBeVisible) before hydration
  // attaches the keydown listener, so pressing Escape immediately can race it.
  await expect(dialog).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("clicking a row opens its modal and keeps the filter", async ({ page }) => {
  await page.goto("/?filter=work");
  await page.getByTestId("entry-row").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/filter=work/);
  await expect(page).toHaveURL(/item=jpmorgan-chase/);
  await page.getByRole("button", { name: "close", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\?filter=work$/);
});

test("about page shows bio, education, and photo", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("about me");
  await expect(page.getByRole("link", { name: "Rice University" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Klein Collins" })).toBeVisible();
  await expect(page.getByRole("img", { name: /calvin/i })).toBeVisible();
});

test("clicking the backdrop closes the modal", async ({ page }) => {
  await page.goto("/?item=pantrypal");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await page.getByRole("button", { name: "close dialog" }).dispatchEvent("click");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("hero draws the shark and the nav carries it", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: /shark/i })).toBeVisible();
  await expect(page.locator("nav svg.shark")).toBeVisible();
});

test("the nav carries the contact links", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("nav");
  for (const name of ["github", "linkedin", "email", "resume"]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveCount(1);
  }
});

test("skills marquee: four rows, click selects and shows where it was used", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("skill-row")).toHaveCount(4);
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  const detail = page.getByTestId("skill-detail");
  await expect(detail).toHaveText("");
  const button = skills.locator('button[data-skill="typescript"]').first();
  await button.dispatchEvent("click");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(detail).toContainText(/TypeScript used .*MockOwl/);
  await expect(skills.locator('button[data-skill="react"]').first()).toHaveClass(/is-dimmed/);
  await button.dispatchEvent("click");
  await expect(detail).toHaveText("");
});

test("the shark roams once the hero is gone", async ({ page }) => {
  await page.goto("/");
  const shark = page.locator(".v3-roam > div");
  const at = async (y: number) => {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(150);
    return shark.evaluate((el) => ({ x: el.getBoundingClientRect().left, opacity: getComputedStyle(el).opacity }));
  };
  expect((await at(0)).opacity).toBe("0");
  const a = await at(1500);
  const b = await at(1750);
  expect(a.opacity).toBe("1");
  expect(Math.abs(a.x - b.x)).toBeGreaterThan(100);
});

test("hovering a row with a screenshot shows a floating thumbnail", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover previews are mouse-only");
  await page.goto("/");
  await expect(page.getByTestId("hover-preview")).toHaveCount(0);
  await page.getByTestId("entry-row").filter({ hasText: "MockOwl" }).hover();
  await expect(page.getByTestId("hover-preview")).toBeVisible();
  await page.getByTestId("entry-row").filter({ hasText: "JPMorgan Chase" }).hover();
  await expect(page.getByTestId("hover-preview")).toHaveCount(0);
});
