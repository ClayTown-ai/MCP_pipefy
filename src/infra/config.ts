export const config = {
  pipefy: {
    token: process.env.PIPEFY_TOKEN ?? "",
    endpoint: "https://api.pipefy.com/graphql",
    timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 30_000,
    maxRetries: 3,
    retryBaseMs: 1_000,
  },
  cache: {
    ttlMs: Number(process.env.CACHE_TTL_MS) || 300_000, // 5 min
  },
  log: {
    level: process.env.LOG_LEVEL ?? "info",
  },
} as const;

export function validateConfig(): void {
  if (!config.pipefy.token) {
    throw new Error("PIPEFY_TOKEN environment variable is required");
  }
}
