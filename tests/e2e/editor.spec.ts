import { test, expect } from "@playwright/test";

test.describe("Editor Functionality E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should load and display the editor correctly", async ({ page }) => {
    // Verify page loads with editor
    await expect(page.getByTestId("editor-container")).toBeVisible();
    await expect(page.getByTestId("editor-input")).toBeVisible();
    await expect(page.getByTestId("editor-placeholder")).toBeVisible();

    // Check placeholder text
    await expect(page.getByTestId("editor-placeholder")).toContainText(
      "Once upon a time...",
    );

    // Check that editor has proper accessibility attributes
    const editor = page.getByTestId("editor-input");
    await expect(editor).toHaveAttribute("role", "textbox");
    await expect(editor).toHaveAttribute("aria-label", "Text editor");
    await expect(editor).toHaveAttribute("aria-multiline", "true");
  });

  test("should allow typing text in the editor", async ({ page }) => {
    const editor = page.getByTestId("editor-input");

    // Click to focus editor
    await editor.click();

    // Type some text using keyboard.type for more realistic input
    await page.keyboard.type("Hello, this is a test!");

    // Verify text appears in editor
    await expect(editor).toContainText("Hello, this is a test!");

    // Placeholder should be hidden
    await expect(page.getByTestId("editor-placeholder")).not.toBeVisible();
  });

  test("should handle sample text insertion", async ({ page }) => {
    const sampleButton = page.getByTestId("insert-sample-btn");
    const editor = page.getByTestId("editor-input");

    // Initially placeholder should be visible
    await expect(page.getByTestId("editor-placeholder")).toBeVisible();

    // Click sample button
    await sampleButton.click();

    // Verify sample text is inserted
    await expect(editor).toContainText("The old castle stood majestically");

    // Should also contain the rest of the sample text
    await expect(editor).toContainText("This is a sample text to demonstrate");

    // Placeholder should be hidden
    await expect(page.getByTestId("editor-placeholder")).not.toBeVisible();

    // Keyboard shortcuts should appear when content exists
    await expect(
      page.locator('[aria-label="Available keyboard shortcuts"]'),
    ).toBeVisible();
  });

  test("should clear editor content", async ({ page }) => {
    const sampleButton = page.getByTestId("insert-sample-btn");
    const clearButton = page.getByTestId("clear-editor-btn");
    const editor = page.getByTestId("editor-input");

    // First insert sample text
    await sampleButton.click();
    await expect(editor).toContainText("The old castle");

    // Then clear it
    await clearButton.click();

    // Editor should be empty and placeholder visible
    await expect(page.getByTestId("editor-placeholder")).toBeVisible();
    await expect(editor).toHaveText("");
  });

  test("should toggle statistics panel", async ({ page }) => {
    const statsButton = page.locator('[aria-label*="writing statistics"]');

    // Initially stats should not be visible
    await expect(page.getByTestId("word-count")).not.toBeVisible();

    // Click to show stats
    await statsButton.click();

    // Stats should now be visible
    await expect(page.getByTestId("word-count")).toBeVisible();
    await expect(page.getByTestId("char-count")).toBeVisible();
    await expect(page.getByTestId("cursor-position")).toBeVisible();

    // Click again to hide stats
    await statsButton.click();

    // Stats should be hidden again
    await expect(page.getByTestId("word-count")).not.toBeVisible();
  });

  test("should update word and character count correctly", async ({ page }) => {
    const editor = page.getByTestId("editor-input");
    const statsButton = page.locator('[aria-label*="writing statistics"]');

    // Show stats panel
    await statsButton.click();

    // Initially should show 0 counts
    await expect(page.getByTestId("word-count")).toContainText("0");
    await expect(page.getByTestId("char-count")).toContainText("0");
    await expect(page.getByTestId("cursor-position")).toContainText("—");

    // Type some text using keyboard.type for realistic input
    await editor.click();
    await page.keyboard.type("Hello world test");

    // Wait for counts to update correctly
    await expect(page.getByTestId("word-count")).toContainText("3");
    await expect(page.getByTestId("char-count")).toContainText("16");

    // Cursor position should also update
    await expect(page.getByTestId("cursor-position")).toContainText("16");
  });

  test("should show keyboard shortcuts when content exists", async ({
    page,
  }) => {
    const editor = page.getByTestId("editor-input");

    // Initially no shortcuts should be visible
    await expect(
      page.locator('[aria-label="Available keyboard shortcuts"]'),
    ).not.toBeVisible();

    // Type some text
    await editor.click();
    await page.keyboard.type("Some content");

    // Shortcuts should now be visible
    await expect(
      page.locator('[aria-label="Available keyboard shortcuts"]'),
    ).toBeVisible();

    // Should contain keyboard shortcut info
    await expect(page.locator("text=Word")).toBeVisible();
    await expect(page.locator("text=Para ↑")).toBeVisible();
  });

  test("should handle Enter key for line breaks", async ({ page }) => {
    const editor = page.getByTestId("editor-input");

    await editor.click();
    await page.keyboard.type("Line 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Line 2");

    // Should contain both lines with line break
    const content = await editor.textContent();
    expect(content).toContain("Line 1\nLine 2");
  });

  test("should handle keyboard navigation shortcuts", async ({ page }) => {
    const editor = page.getByTestId("editor-input");

    // Insert sample text for navigation testing
    await page.getByTestId("insert-sample-btn").click();
    await editor.click();

    // Test Ctrl+Home (move to beginning)
    await page.keyboard.press("Control+Home");

    // Test Ctrl+End (move to end)
    await page.keyboard.press("Control+End");

    // Test Ctrl+Arrow keys (word navigation)
    await page.keyboard.press("Control+ArrowLeft");
    await page.keyboard.press("Control+ArrowRight");

    // These should not cause errors and editor should still be functional
    await expect(editor).toBeFocused();
  });

  test("should maintain focus and cursor position", async ({ page }) => {
    const editor = page.getByTestId("editor-input");

    await editor.click();
    await page.keyboard.type("Hello world");

    // Editor should maintain focus
    await expect(editor).toBeFocused();

    // Should be able to continue typing
    await page.keyboard.type(" more text");
    await expect(editor).toContainText("Hello world more text");
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId("editor-container")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByTestId("editor-container")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByTestId("editor-container")).toBeVisible();

    // Controls should always be accessible
    await expect(page.getByTestId("insert-sample-btn")).toBeVisible();
    await expect(page.getByTestId("clear-editor-btn")).toBeVisible();
  });

  test("should not have console errors during normal usage", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleMessages.push(msg.text());
      }
    });

    // Perform typical user interactions
    const editor = page.getByTestId("editor-input");
    await editor.click();
    await page.keyboard.type("Test content");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Second line");

    // Use controls
    await page.getByTestId("insert-sample-btn").click();
    await page.getByTestId("clear-editor-btn").click();

    // Should have no console errors
    expect(consoleMessages).toEqual([]);
  });

  test("should handle editor statistics state correctly after clear", async ({
    page,
  }) => {
    const editor = page.getByTestId("editor-input");
    const statsButton = page.locator('[aria-label*="writing statistics"]');
    const sampleButton = page.getByTestId("insert-sample-btn");
    const clearButton = page.getByTestId("clear-editor-btn");

    // Show stats panel and add content
    await statsButton.click();
    await sampleButton.click();

    // Stats should update to show content
    await expect(page.getByTestId("word-count")).not.toContainText("0");
    await expect(page.getByTestId("char-count")).not.toContainText("0");

    // Clear content
    await clearButton.click();

    // Click in editor to trigger stats update and type something
    await editor.click();
    await page.keyboard.type("x");

    // Should show updated stats
    await expect(page.getByTestId("word-count")).toContainText("1");
    await expect(page.getByTestId("char-count")).toContainText("1");
  });

  test("should handle keyboard navigation shortcuts comprehensively", async ({
    page,
  }) => {
    const editor = page.getByTestId("editor-input");

    // Insert sample text for navigation testing
    await page.getByTestId("insert-sample-btn").click();
    await editor.click();

    // Test various keyboard shortcuts
    await page.keyboard.press("Control+Home");
    await page.keyboard.press("Control+End");
    await page.keyboard.press("Control+ArrowLeft");
    await page.keyboard.press("Control+ArrowRight");
    await page.keyboard.press("Control+ArrowUp");
    await page.keyboard.press("Control+ArrowDown");

    // Editor should still be functional and focused
    await expect(editor).toBeFocused();

    // Should be able to continue typing
    await page.keyboard.type(" additional text");
    await expect(editor).toContainText("additional text");
  });

  test("should handle accessibility features correctly", async ({ page }) => {
    // Check sections have proper ARIA labels
    await expect(page.locator('[aria-label="Text Editor"]')).toBeVisible();
    await expect(page.locator('[aria-label="Editor Controls"]')).toBeVisible();
    await expect(
      page.locator('[aria-label="Statistics Controls"]'),
    ).toBeVisible();

    // Check buttons have proper labels
    await expect(
      page.locator('[aria-label="Insert sample text into the editor"]'),
    ).toBeVisible();
    await expect(
      page.locator('[aria-label="Clear all text from the editor"]'),
    ).toBeVisible();

    // Editor should have proper accessibility attributes
    const editor = page.getByTestId("editor-input");
    await expect(editor).toHaveAttribute("role", "textbox");
    await expect(editor).toHaveAttribute("aria-label", "Text editor");
    await expect(editor).toHaveAttribute("aria-multiline", "true");
  });

  test("should maintain proper focus management", async ({ page }) => {
    const editor = page.getByTestId("editor-input");

    // Editor should be auto-focused on load
    await expect(editor).toBeFocused();

    // After clicking buttons, should be able to return focus to editor
    await page.getByTestId("insert-sample-btn").click();
    await editor.click();
    await expect(editor).toBeFocused();

    // Should maintain focus while typing
    await page.keyboard.type("test");
    await expect(editor).toBeFocused();
  });
});
