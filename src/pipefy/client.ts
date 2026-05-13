import { config } from "../infra/config.js";
import { logger } from "../infra/logger.js";
import { PipefyApiError, formatGraphQLErrors } from "../core/errors.js";
import type { GraphQLResponse } from "../core/types.js";

export async function pipefyRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { endpoint, token, timeoutMs, maxRetries, retryBaseMs } = config.pipefy;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.status === 429) {
        const wait = retryBaseMs * 2 ** attempt;
        logger.warn({ attempt, wait }, "Rate limited, retrying");
        await sleep(wait);
        continue;
      }

      if (!res.ok) {
        throw new PipefyApiError(
          "PIPEFY_ERROR",
          `HTTP ${res.status}: ${res.statusText}`,
        );
      }

      const json = (await res.json()) as GraphQLResponse<T>;

      // Pipefy returns errors with HTTP 200
      if (json.errors?.length) {
        const msg = formatGraphQLErrors(json.errors);
        logger.error({ errors: json.errors }, "GraphQL errors");
        throw new PipefyApiError("PIPEFY_ERROR", msg);
      }

      if (!json.data) {
        throw new PipefyApiError("PIPEFY_ERROR", "Empty response data");
      }

      return json.data;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof PipefyApiError) throw err;

      const error = err as Error;
      if (error.name === "AbortError") {
        throw new PipefyApiError("TIMEOUT", `Request timed out after ${timeoutMs}ms`);
      }

      lastError = error;
      if (attempt < maxRetries) {
        const wait = retryBaseMs * 2 ** attempt;
        logger.warn({ attempt, error: error.message, wait }, "Request failed, retrying");
        await sleep(wait);
      }
    }
  }

  throw new PipefyApiError(
    "PIPEFY_ERROR",
    `All ${maxRetries + 1} attempts failed: ${lastError?.message}`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
