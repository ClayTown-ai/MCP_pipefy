import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { pipefyRequest } from "../pipefy/client.js";
import { PipefyApiError } from "../core/errors.js";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
  };
}

describe("pipefyRequest", () => {
  it("sends correct headers and body", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: { me: { id: "1" } } }));

    await pipefyRequest("query { me { id } }", {});

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.pipefy.com/graphql");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.headers.Authorization).toMatch(/^Bearer /);
    const body = JSON.parse(opts.body);
    expect(body.query).toBe("query { me { id } }");
  });

  it("returns data on success", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: { pipe: { id: "42" } } }));
    const result = await pipefyRequest<{ pipe: { id: string } }>("query pipe", {});
    expect(result.pipe.id).toBe("42");
  });

  it("throws PipefyApiError on GraphQL errors (HTTP 200)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: null,
        errors: [{ message: "Pipe not found" }],
      }),
    );

    await expect(pipefyRequest("query pipe", {})).rejects.toThrow(PipefyApiError);
    try {
      await pipefyRequest("query pipe", {});
    } catch (e) {
      // already thrown above
    }
  });

  it("throws PipefyApiError on empty data", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: null }));
    await expect(pipefyRequest("query", {})).rejects.toThrow("Empty response data");
  });

  it("throws PipefyApiError on HTTP error status", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}, 500));
    await expect(pipefyRequest("query", {})).rejects.toThrow("HTTP 500");
  });

  it("retries on HTTP 429 and eventually succeeds", async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({}, 429))
      .mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    const result = await pipefyRequest<{ ok: boolean }>("query", {});
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws after all retries exhausted on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network failure"));
    await expect(pipefyRequest("query", {})).rejects.toThrow("All 4 attempts failed");
  });
});
