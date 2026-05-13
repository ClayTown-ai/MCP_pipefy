import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("uses default values when env vars are not set", async () => {
    process.env.PIPEFY_TOKEN = "test-token";
    const { config } = await import("../infra/config.js");
    expect(config.pipefy.endpoint).toBe("https://api.pipefy.com/graphql");
    expect(config.pipefy.timeoutMs).toBe(30_000);
    expect(config.pipefy.maxRetries).toBe(3);
    expect(config.cache.ttlMs).toBe(300_000);
  });

  it("validateConfig throws when PIPEFY_TOKEN is missing", async () => {
    delete process.env.PIPEFY_TOKEN;
    const { validateConfig } = await import("../infra/config.js");
    expect(() => validateConfig()).toThrow("PIPEFY_TOKEN");
  });
});
