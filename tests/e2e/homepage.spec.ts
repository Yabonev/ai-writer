import { test, expect } from "@playwright/test";

// Comprehensive E2E tests for the homepage
test.describe("Homepage E2E Tests", () => {
  test("should load and display the homepage correctly", async ({ page }) => {
    await page.goto("/");

    // Verify page loads and has correct title
    await expect(page).toHaveTitle(/Create T3 App/);

    // Check that main heading is visible
    await expect(page.locator("h1")).toContainText("Create T3 App");

    // Verify page is fully loaded
    await page.waitForLoadState("networkidle");
  });

  test("should have no accessibility violations", async ({ page }) => {
    await page.goto("/");

    // Basic accessibility checks
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();

    // Should have at least one heading for screen readers
    expect(headingCount).toBeGreaterThan(0);

    // Check that images have alt text (if any exist)
    const images = page.locator("img");
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute("alt");
      }
    }
  });

  test("should handle navigation correctly", async ({ page }) => {
    await page.goto("/");

    // Test any navigation links that exist
    const navLinks = page.locator("nav a, header a");
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Get href of first link to test navigation
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute("href");

      if (href && !href.startsWith("http")) {
        // Only test internal links
        await firstLink.click();
        await page.waitForLoadState("networkidle");

        // Should successfully navigate
        expect(page.url()).toContain(href);
      }
    } else {
      // If no nav links, just verify page is interactive
      await expect(page.locator("main, body")).toBeVisible();
    }
  });

  test("should be responsive across different viewports", async ({ page }) => {
    // Test mobile viewport (iPhone-like)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();

    // Test tablet viewport (iPad-like)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
  });

  test("should not have console errors or warnings", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    // Listen for all console messages
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
        });
      }
    });

    await page.goto("/");

    // Wait for page to fully load and any async operations to complete
    await page.waitForLoadState("networkidle");

    // Filter out known false positives (you can customize this)
    const realErrors = consoleMessages.filter(
      (msg) =>
        !msg.text.includes("404") && // Ignore 404s for optional resources
        !msg.text.includes("favicon"), // Ignore favicon warnings
    );

    // Should not have any real console errors
    expect(realErrors).toHaveLength(0);
  });

  test("should have working forms (if any exist)", async ({ page }) => {
    await page.goto("/");

    // Look for forms on the page
    const forms = page.locator("form");
    const formCount = await forms.count();

    if (formCount > 0) {
      const firstForm = forms.first();

      // Check that form has required attributes
      const inputs = firstForm.locator("input, textarea, select");
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        // Test that inputs are focusable
        await inputs.first().focus();
        await expect(inputs.first()).toBeFocused();
      }
    }
  });

  test("should load within reasonable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (adjust as needed)
    expect(loadTime).toBeLessThan(5000);
  });
});
