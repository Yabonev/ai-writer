import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { WritingStudio } from "~/components/WritingStudio";

describe("WritingStudio Component", () => {
  beforeEach(() => {
    // Reset DOM before each test
  });

  it("renders the main editor interface", () => {
    render(<WritingStudio />);

    // Check that main editor elements are present
    expect(screen.getByTestId("editor-container")).toBeInTheDocument();
    expect(screen.getByTestId("editor-input")).toBeInTheDocument();
    expect(screen.getByTestId("editor-placeholder")).toBeInTheDocument();

    // Check that control buttons are present
    expect(screen.getByTestId("insert-sample-btn")).toBeInTheDocument();
    expect(screen.getByTestId("clear-editor-btn")).toBeInTheDocument();
  });

  it("displays placeholder text correctly", () => {
    render(<WritingStudio />);

    const placeholder = screen.getByTestId("editor-placeholder");
    expect(placeholder).toHaveTextContent("Once upon a time...");
  });

  it("inserts sample text when Sample button is clicked", async () => {
    const user = userEvent.setup();
    render(<WritingStudio />);

    const sampleButton = screen.getByTestId("insert-sample-btn");
    await user.click(sampleButton);

    // Should hide placeholder and show content
    expect(screen.queryByTestId("editor-placeholder")).not.toBeInTheDocument();

    const editor = screen.getByTestId("editor-input");
    expect(editor.textContent).toContain("The old castle stood majestically");
  });

  it("clears editor content when Clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<WritingStudio />);

    // First add some sample text
    const sampleButton = screen.getByTestId("insert-sample-btn");
    await user.click(sampleButton);

    // Verify content exists
    const editor = screen.getByTestId("editor-input");
    expect(editor.textContent).toContain("The old castle");

    // Now clear it
    const clearButton = screen.getByTestId("clear-editor-btn");
    await user.click(clearButton);

    // Should show placeholder again
    await waitFor(() => {
      expect(screen.getByTestId("editor-placeholder")).toBeInTheDocument();
    });
  });

  it("updates word and character count as user types", async () => {
    const user = userEvent.setup();
    render(<WritingStudio />);

    // Click the stats toggle button first to show stats
    const statsButton = screen.getByLabelText(/show writing statistics/i);
    await user.click(statsButton);

    // Now stats panel should be visible
    await waitFor(() => {
      expect(screen.getByTestId("word-count")).toBeInTheDocument();
      expect(screen.getByTestId("char-count")).toBeInTheDocument();
    });

    // Initial counts should be 0
    expect(screen.getByTestId("word-count")).toHaveTextContent("0");
    expect(screen.getByTestId("char-count")).toHaveTextContent("0");

    // Type some text
    const editor = screen.getByTestId("editor-input");
    await user.click(editor);
    await user.type(editor, "Hello world test");

    // Check that counts update
    await waitFor(() => {
      expect(screen.getByTestId("word-count")).toHaveTextContent("3");
      expect(screen.getByTestId("char-count")).toHaveTextContent("16");
    });
  });

  it("toggles statistics panel when stats button is clicked", async () => {
    const user = userEvent.setup();
    render(<WritingStudio />);

    const statsButton = screen.getByLabelText(/show writing statistics/i);

    // Stats should be hidden initially
    expect(screen.queryByTestId("word-count")).not.toBeInTheDocument();

    // Click to show stats
    await user.click(statsButton);

    await waitFor(() => {
      expect(screen.getByTestId("word-count")).toBeInTheDocument();
      expect(screen.getByTestId("char-count")).toBeInTheDocument();
      expect(screen.getByTestId("cursor-position")).toBeInTheDocument();
    });

    // Click again to hide stats
    await user.click(statsButton);

    await waitFor(() => {
      expect(screen.queryByTestId("word-count")).not.toBeInTheDocument();
    });
  });

  it("shows keyboard shortcuts when content exists", async () => {
    const user = userEvent.setup();
    render(<WritingStudio />);

    // Initially no shortcuts should be visible (no content)
    expect(screen.queryByText(/keyboard shortcuts/i)).not.toBeInTheDocument();

    // Add sample text
    const sampleButton = screen.getByTestId("insert-sample-btn");
    await user.click(sampleButton);

    // Now shortcuts should be visible
    await waitFor(() => {
      expect(
        screen.getByLabelText(/available keyboard shortcuts/i),
      ).toBeInTheDocument();
    });

    // Should show keyboard shortcut hints
    expect(screen.getByText("Word")).toBeInTheDocument();
    expect(screen.getByText("Para ↑")).toBeInTheDocument();
  });

  it("has proper ARIA labels and accessibility", () => {
    render(<WritingStudio />);

    // Check main sections have proper labels
    expect(screen.getByLabelText("Text Editor")).toBeInTheDocument();
    expect(screen.getByLabelText("Editor Controls")).toBeInTheDocument();
    expect(screen.getByLabelText("Statistics Controls")).toBeInTheDocument();

    // Check buttons have proper labels
    expect(
      screen.getByLabelText("Insert sample text into the editor"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Clear all text from the editor"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/writing statistics/i)).toBeInTheDocument();

    // Check editor has proper accessibility attributes
    const editor = screen.getByTestId("editor-input");
    expect(editor).toHaveAttribute("role", "textbox");
    expect(editor).toHaveAttribute("aria-label", "Text editor");
    expect(editor).toHaveAttribute("aria-multiline", "true");
  });

  it("maintains responsive layout structure", () => {
    render(<WritingStudio />);

    // Check that main container takes full screen
    const mainContainer = screen.getByTestId("editor-container").closest("div");
    expect(mainContainer).toHaveClass("h-screen", "w-screen");

    // Check that editor is properly centered with constrained width
    const editorSection = screen.getByLabelText("Text Editor");
    expect(editorSection).toHaveClass("flex", "justify-center");
  });
});
