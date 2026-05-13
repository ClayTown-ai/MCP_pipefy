import { describe, it, expect } from "vitest";
import { mcpError, formatGraphQLErrors, PipefyApiError } from "../core/errors.js";

describe("mcpError", () => {
  it("creates error object with type and message", () => {
    const err = mcpError("VALIDATION_ERROR", "ID is required");
    expect(err.error).toBe(true);
    expect(err.type).toBe("VALIDATION_ERROR");
    expect(err.message).toBe("ID is required");
  });
});

describe("formatGraphQLErrors", () => {
  it("joins multiple error messages with semicolons", () => {
    const msg = formatGraphQLErrors([
      { message: "Field not found" },
      { message: "Access denied" },
    ]);
    expect(msg).toBe("Field not found; Access denied");
  });

  it("handles single error", () => {
    const msg = formatGraphQLErrors([{ message: "Something wrong" }]);
    expect(msg).toBe("Something wrong");
  });

  it("handles empty array", () => {
    const msg = formatGraphQLErrors([]);
    expect(msg).toBe("");
  });
});

describe("PipefyApiError", () => {
  it("extends Error with type property", () => {
    const err = new PipefyApiError("RATE_LIMIT", "Too many requests");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("PipefyApiError");
    expect(err.type).toBe("RATE_LIMIT");
    expect(err.message).toBe("Too many requests");
  });
});
