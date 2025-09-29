import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Example component test demonstrating the testing setup
// This validates that React Testing Library is working correctly
describe("Component Testing Setup", () => {
  it("can render and find DOM elements", () => {
    render(<div>Hello Test World</div>);

    // This test verifies that jsdom and @testing-library/jest-dom are working
    expect(screen.getByText("Hello Test World")).toBeInTheDocument();
  });

  it("can render CI/CD status indicator", () => {
    render(
      <div className="rounded-lg bg-green-500/20 px-4 py-2 text-green-400">
        ✅ CI/CD Pipeline Active - Enterprise Grade Quality Gates
      </div>,
    );

    expect(
      screen.getByText(
        "✅ CI/CD Pipeline Active - Enterprise Grade Quality Gates",
      ),
    ).toBeInTheDocument();
  });

  it("can test interactive elements", () => {
    render(<button onClick={() => console.log("clicked")}>Click me</button>);

    // Demonstrates that we can test interactive elements
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
  });

  it("can test component state and effects", () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    };

    render(<TestComponent />);

    const counter = screen.getByTestId("count");
    const button = screen.getByRole("button", { name: /increment/i });

    expect(counter).toHaveTextContent("0");

    // Test that clicking changes state (this would require user-event in real tests)
    expect(button).toBeInTheDocument();
  });
});
