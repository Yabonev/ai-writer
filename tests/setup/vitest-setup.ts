import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

// Mock environment variables for T3 env validation
// This prevents env validation errors during testing
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/testdb");
vi.stubEnv("SKIP_ENV_VALIDATION", "true");

// Mock the T3 env module to prevent runtime errors
// T3 Stack's env validation can interfere with testing
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://test:test@localhost:5432/testdb",
  },
}));

// Mock Next.js navigation hooks that components might use
// This prevents "useRouter must be used within RouterContext" errors
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock Next.js Image component for testing
vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return React.createElement("img", { src, alt, ...props });
  },
}));

// Cleanup DOM after each test to prevent test pollution
beforeEach(() => {
  cleanup();
});
