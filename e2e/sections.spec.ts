import { test, expect } from "@playwright/test";

test.describe("Hero Section", () => {
  test("should display hero content", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /CALVIN/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /WONG/i })).toBeVisible();
    await expect(page.getByText(/CREATIVE FRONTEND ENGINEER/i)).toBeVisible();
    await expect(page.getByText(/immersive web experiences/i)).toBeVisible();
  });

  test("should display radar decoration", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("radar-decoration")).toBeVisible();
  });

  test("should hide CTA on scroll", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByText(/INITIALIZE DIVE/i);
    await expect(cta).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    await expect(cta).not.toBeVisible();
  });
});

test.describe("About Section", () => {
  test("should display about content", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "ABOUT" }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(/DIGITAL ALCHEMIST/i)).toBeVisible();
    await expect(page.getByText(/BIO-DATA ANALYSIS/i)).toBeVisible();
    await expect(page.getByRole("img", { name: /Calvin/i })).toBeVisible();
  });

  test("should display stats", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="about-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await expect(page.getByText(/YEARS EXP/i)).toBeVisible();
    await expect(page.getByText(/PROJECTS DEPLOYED/i)).toBeVisible();
  });
});

test.describe("Work Section", () => {
  test("should display work section title", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "WORK" }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText("EXPERIENCE")).toBeVisible();
    await expect(page.getByText(/CAREER DATA LOG/i)).toBeVisible();
  });

  test("should display work cards", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="work-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await expect(page.getByText(/JPMorgan Chase/i)).toBeVisible();
  });
});

test.describe("Projects Section", () => {
  test("should display projects section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "PROJECTS" }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(/BIOLUMINESCENCE/i)).toBeVisible();
    await expect(page.getByText(/MockOwl/i)).toBeVisible();
  });

  test("should display tech tags", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="projects-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await expect(page.getByText(/Next.js/i).first()).toBeVisible();
  });
});

test.describe("Skills Section", () => {
  test("should display skills section", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="skills-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await expect(page.getByText(/SKILL ECOSYSTEM/i)).toBeVisible();
    await expect(page.getByTestId("fish-canvas")).toBeVisible();
  });
});

test.describe("Contact Section", () => {
  test("should display contact section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "CONTACT" }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText(/SAY/i)).toBeVisible();
    await expect(page.getByText(/HELLO/i)).toBeVisible();
    await expect(page.getByText(/UPLINK ACTIVE/i)).toBeVisible();
  });

  test("should display contact cards", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="contact-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await expect(page.getByTestId("contact-card-github")).toBeVisible();
    await expect(page.getByTestId("contact-card-linkedin")).toBeVisible();
    await expect(page.getByTestId("contact-card-email")).toBeVisible();
  });

  test("should show CONNECT text on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector('[data-testid="contact-section"]')?.scrollIntoView()
    );
    await page.waitForTimeout(500);

    await page.getByTestId("contact-card-github").hover();
    await page.waitForTimeout(300);
    await expect(page.getByText(/CONNECT/i)).toBeVisible();
  });
});
