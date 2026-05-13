import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../pipefy/client.js", () => ({
  pipefyRequest: vi.fn(),
}));

import { pipefyRequest } from "../pipefy/client.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult, paginateAll } from "../pipefy/mapper.js";

const mockRequest = vi.mocked(pipefyRequest);

describe("unwrapConnection", () => {
  it("returns empty result for null", () => {
    const r = unwrapConnection(null);
    expect(r.items).toEqual([]);
    expect(r.hasNextPage).toBe(false);
    expect(r.endCursor).toBeNull();
  });

  it("returns empty result for undefined", () => {
    const r = unwrapConnection(undefined);
    expect(r.items).toEqual([]);
  });

  it("unwraps edges/nodes correctly", () => {
    const r = unwrapConnection({
      edges: [
        { node: { id: "1", title: "A" }, cursor: "c1" },
        { node: { id: "2", title: "B" }, cursor: "c2" },
      ],
      pageInfo: { hasNextPage: true, endCursor: "c2" },
      totalCount: 10,
    });
    expect(r.items).toHaveLength(2);
    expect(r.items[0]).toEqual({ id: "1", title: "A" });
    expect(r.hasNextPage).toBe(true);
    expect(r.endCursor).toBe("c2");
    expect(r.totalCount).toBe(10);
  });

  it("prefers totalCount over matchCount", () => {
    const r = unwrapConnection({ edges: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 5, matchCount: 3 });
    expect(r.totalCount).toBe(5);
  });

  it("falls back to matchCount when totalCount is absent", () => {
    const r = unwrapConnection({ edges: [], pageInfo: { hasNextPage: false, endCursor: null }, matchCount: 7 });
    expect(r.totalCount).toBe(7);
  });

  it("handles connection with no edges", () => {
    const r = unwrapConnection({ pageInfo: { hasNextPage: false, endCursor: null } });
    expect(r.items).toEqual([]);
  });
});

describe("normalizeFields", () => {
  it("returns empty object for null", () => {
    expect(normalizeFields(null)).toEqual({});
  });

  it("returns empty object for undefined", () => {
    expect(normalizeFields(undefined)).toEqual({});
  });

  it("converts array of {name, value} to object", () => {
    const result = normalizeFields([
      { name: "Email", value: "test@example.com" },
      { name: "Status", value: "Active" },
    ]);
    expect(result).toEqual({ Email: "test@example.com", Status: "Active" });
  });

  it("handles null values as empty string", () => {
    const result = normalizeFields([{ name: "Notes", value: null }]);
    expect(result).toEqual({ Notes: "" });
  });
});

describe("jsonResult", () => {
  it("wraps data in MCP text content", () => {
    const r = jsonResult({ id: "123" });
    expect(r.content).toHaveLength(1);
    expect(r.content[0].type).toBe("text");
    expect(JSON.parse(r.content[0].text)).toEqual({ id: "123" });
    expect(r.isError).toBe(false);
  });
});

describe("errorResult", () => {
  it("creates error response with type and message", () => {
    const r = errorResult("NOT_FOUND", "Card not found");
    expect(r.isError).toBe(true);
    const parsed = JSON.parse(r.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.type).toBe("NOT_FOUND");
    expect(parsed.message).toBe("Card not found");
  });
});

describe("paginateAll", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it("fetches all pages until hasNextPage is false", async () => {
    mockRequest
      .mockResolvedValueOnce({
        cards: {
          edges: [
            { node: { id: "1" }, cursor: "c1" },
            { node: { id: "2" }, cursor: "c2" },
          ],
          pageInfo: { hasNextPage: true, endCursor: "c2" },
          totalCount: 4,
        },
      })
      .mockResolvedValueOnce({
        cards: {
          edges: [
            { node: { id: "3" }, cursor: "c3" },
            { node: { id: "4" }, cursor: "c4" },
          ],
          pageInfo: { hasNextPage: false, endCursor: "c4" },
          totalCount: 4,
        },
      });

    const result = await paginateAll(
      "query { cards { ... } }",
      { pipe_id: "123" },
      "cards",
      2,
    );

    expect(result.items).toHaveLength(4);
    expect(result.pagesFetched).toBe(2);
    expect(result.totalCount).toBe(4);
  });

  it("stops at single page when hasNextPage is false", async () => {
    mockRequest.mockResolvedValueOnce({
      cards: {
        edges: [{ node: { id: "1" }, cursor: "c1" }],
        pageInfo: { hasNextPage: false, endCursor: "c1" },
        totalCount: 1,
      },
    });

    const result = await paginateAll("q", { pipe_id: "1" }, "cards", 50);
    expect(result.items).toHaveLength(1);
    expect(result.pagesFetched).toBe(1);
    expect(mockRequest).toHaveBeenCalledOnce();
  });
});
