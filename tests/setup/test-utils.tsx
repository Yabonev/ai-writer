import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";

// Create a test query client with disabled retries for faster, predictable tests
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // No retries in tests for speed
        gcTime: 0, // Disable caching for predictable tests
      },
      mutations: {
        retry: false, // Predictable test behavior
      },
    },
  });
}

type CustomRenderOptions = Omit<RenderOptions, "wrapper">;

// Custom render function that wraps components with necessary providers
// This is essential for testing T3 Stack components that use tRPC
export function renderWithTRPC(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export testing library utilities for convenience
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
