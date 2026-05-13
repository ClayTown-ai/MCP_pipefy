import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    testTimeout: 10_000,
    env: {
      PIPEFY_TOKEN: "test-token-for-unit-tests",
      LOG_LEVEL: "silent",
    },
  },
});
