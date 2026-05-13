import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../pipefy/client.js", () => ({
  pipefyRequest: vi.fn(),
}));

import { pipefyRequest } from "../pipefy/client.js";
import { resolveFieldId, resolvePhaseId, invalidateSchema } from "../pipefy/schema-resolver.js";

const mockRequest = vi.mocked(pipefyRequest);

beforeEach(() => {
  vi.clearAllMocks();
  invalidateSchema("pipe1", "pipe");
  invalidateSchema("table1", "table");
});

describe("resolveFieldId (pipe)", () => {
  it("resolves field label to ID", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: {
        phases: [
          {
            id: "phase1",
            name: "Start",
            fields: [
              { id: "field_1", label: "Email", type: "email" },
              { id: "field_2", label: "Name", type: "short_text" },
            ],
          },
        ],
        start_form_fields: [],
      },
    });

    const id = await resolveFieldId("pipe1", "Email", "pipe");
    expect(id).toBe("field_1");
  });

  it("is case-insensitive for labels", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: {
        phases: [{ id: "p1", name: "S", fields: [{ id: "f1", label: "Priority", type: "select" }] }],
        start_form_fields: [],
      },
    });

    const id = await resolveFieldId("pipe1", "priority", "pipe");
    expect(id).toBe("f1");
  });

  it("returns raw ID if already an ID", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: {
        phases: [{ id: "p1", name: "S", fields: [{ id: "field_99", label: "X", type: "text" }] }],
        start_form_fields: [],
      },
    });

    const id = await resolveFieldId("pipe1", "field_99", "pipe");
    expect(id).toBe("field_99");
  });

  it("falls back to input if not found", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: { phases: [], start_form_fields: [] },
    });

    const id = await resolveFieldId("pipe1", "unknown_field", "pipe");
    expect(id).toBe("unknown_field");
  });

  it("uses cache on second call", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: {
        phases: [{ id: "p1", name: "S", fields: [{ id: "f1", label: "A", type: "text" }] }],
        start_form_fields: [],
      },
    });

    await resolveFieldId("pipe1", "A", "pipe");
    await resolveFieldId("pipe1", "A", "pipe");
    expect(mockRequest).toHaveBeenCalledOnce();
  });
});

describe("resolveFieldId (table)", () => {
  it("resolves table field label to ID", async () => {
    mockRequest.mockResolvedValueOnce({
      table: {
        table_fields: [
          { id: "tf_1", label: "Status", type: "select" },
        ],
      },
    });

    const id = await resolveFieldId("table1", "Status", "table");
    expect(id).toBe("tf_1");
  });
});

describe("resolvePhaseId", () => {
  it("resolves phase name to ID", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: {
        phases: [
          { id: "phase_10", name: "In Progress", fields: [] },
          { id: "phase_20", name: "Done", fields: [] },
        ],
        start_form_fields: [],
      },
    });

    const id = await resolvePhaseId("pipe1", "In Progress");
    expect(id).toBe("phase_10");
  });

  it("returns raw ID for unknown name", async () => {
    mockRequest.mockResolvedValueOnce({
      pipe: { phases: [{ id: "p1", name: "Start", fields: [] }], start_form_fields: [] },
    });

    const id = await resolvePhaseId("pipe1", "phase_999");
    expect(id).toBe("phase_999");
  });
});

describe("invalidateSchema", () => {
  it("forces re-fetch after invalidation", async () => {
    mockRequest
      .mockResolvedValueOnce({
        pipe: { phases: [{ id: "p1", name: "S", fields: [{ id: "f1", label: "A", type: "text" }] }], start_form_fields: [] },
      })
      .mockResolvedValueOnce({
        pipe: { phases: [{ id: "p1", name: "S", fields: [{ id: "f2", label: "A", type: "text" }] }], start_form_fields: [] },
      });

    const id1 = await resolveFieldId("pipe1", "A", "pipe");
    expect(id1).toBe("f1");

    invalidateSchema("pipe1", "pipe");

    const id2 = await resolveFieldId("pipe1", "A", "pipe");
    expect(id2).toBe("f2");
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });
});
