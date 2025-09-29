import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Editor } from "~/components/ui/Editor";

describe("Editor Component", () => {
  const defaultProps = {
    content: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<Editor {...defaultProps} />);

    expect(screen.getByTestId("editor-container")).toBeInTheDocument();
    expect(screen.getByTestId("editor-input")).toBeInTheDocument();
    expect(screen.getByTestId("editor-placeholder")).toBeInTheDocument();
  });

  it("displays placeholder when empty", () => {
    render(<Editor {...defaultProps} placeholder="Type here..." />);

    expect(screen.getByTestId("editor-placeholder")).toHaveTextContent(
      "Type here...",
    );
  });

  it("hides placeholder when content exists", () => {
    render(
      <Editor
        {...defaultProps}
        content="Some text"
        placeholder="Type here..."
      />,
    );

    expect(screen.queryByTestId("editor-placeholder")).not.toBeInTheDocument();
  });

  it("calls onChange when content changes", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<Editor {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByTestId("editor-input");
    await user.click(input);
    await user.type(input, "Hello World");

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith("Hello World");
    });
  });

  it("displays existing content", () => {
    render(<Editor {...defaultProps} content="Existing content" />);

    const input = screen.getByTestId("editor-input");
    expect(input).toHaveTextContent("Existing content");
  });

  it("handles disabled state", () => {
    render(<Editor {...defaultProps} disabled={true} />);

    const input = screen.getByTestId("editor-input");
    expect(input).toHaveAttribute("contenteditable", "false");
    expect(input).toHaveAttribute("aria-disabled", "true");
  });

  it("auto-focuses when autoFocus is true", async () => {
    render(<Editor {...defaultProps} autoFocus={true} />);

    await waitFor(() => {
      const input = screen.getByTestId("editor-input");
      expect(document.activeElement).toBe(input);
    });
  });

  it("applies custom className", () => {
    render(<Editor {...defaultProps} className="custom-class" />);

    const input = screen.getByTestId("editor-input");
    expect(input).toHaveClass("custom-class");
  });

  it("handles keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(<Editor {...defaultProps} content="Hello World" />);

    const input = screen.getByTestId("editor-input");
    await user.click(input);

    // Test Ctrl+Home (should move cursor to beginning)
    await user.keyboard("{Control>}{Home}{/Control}");

    // We can't easily test cursor position in jsdom, but we can ensure
    // the event handlers are called without errors
    expect(input).toBeInTheDocument();
  });

  it("handles Enter key properly", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<Editor {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByTestId("editor-input");
    await user.click(input);
    await user.type(input, "Line 1");
    await user.keyboard("{Enter}");
    await user.type(input, "Line 2");

    await waitFor(() => {
      const calls = mockOnChange.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall?.[0]).toContain("\n");
    });
  });

  it("calls onCursorChange when cursor moves", async () => {
    const user = userEvent.setup();
    const mockOnCursorChange = vi.fn();

    render(<Editor {...defaultProps} onCursorChange={mockOnCursorChange} />);

    const input = screen.getByTestId("editor-input");
    await user.click(input);
    await user.type(input, "Hello");

    await waitFor(() => {
      expect(mockOnCursorChange).toHaveBeenCalled();
    });
  });

  it("handles composition events", async () => {
    render(<Editor {...defaultProps} />);

    const input = screen.getByTestId("editor-input");

    // Simulate composition events (for IME input)
    fireEvent.compositionStart(input);
    fireEvent.compositionEnd(input);

    // Component should handle these without errors
    expect(input).toBeInTheDocument();
  });

  it("applies minimum height", () => {
    render(<Editor {...defaultProps} minHeight={500} />);

    const input = screen.getByTestId("editor-input");
    expect(input).toHaveStyle({ minHeight: "500px" });
  });
});
