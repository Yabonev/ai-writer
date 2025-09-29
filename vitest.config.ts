import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Enable path mapping from tsconfig.json (~/components, etc.)
    react(), // Enable React component testing with JSX support
  ],
  test: {
    environment: "jsdom", // DOM environment for React components
    globals: true, // Enable global test functions (describe, it, expect)
    setupFiles: ["./tests/setup/vitest-setup.ts"], // Test setup and mocks
    include: ["tests/unit/**/*.{test,spec}.{js,ts,tsx}"], // Test file patterns
    exclude: ["tests/e2e/**/*", "node_modules/**/*"], // Exclude E2E tests
    coverage: {
      provider: "v8", // V8 coverage provider (faster than c8)
      reporter: ["text", "json", "html"], // Multiple report formats
      exclude: [
        "node_modules/",
        "tests/", // Don't include test files in coverage
        "*.config.*", // Exclude config files
        ".next/", // Exclude Next.js build files
        "coverage/", // Exclude coverage directory itself
        "prisma/", // Exclude Prisma generated code
      ],
    },
  },
});
