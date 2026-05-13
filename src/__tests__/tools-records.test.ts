import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

vi.mock("../pipefy/client.js", () => ({
  pipefyRequest: vi.fn(),
}));

import { pipefyRequest } from "../pipefy/client.js";
import { registerGetRecord } from "../mcp/tools/records/getRecord.js";
import { registerCreateRecord } from "../mcp/tools/records/createRecord.js";
import { registerSetRecordField } from "../mcp/tools/records/setRecordField.js";
import { registerListRecords } from "../mcp/tools/records/listRecords.js";

const mockRequest = vi.mocked(pipefyRequest);

type ToolHandler = (args: any) => Promise<any>;
const handlers = new Map<string, ToolHandler>();

function createTestServer(): McpServer {
  const server = new McpServer({ name: "test", version: "0.0.1" });
  const origTool = server.tool.bind(server);
  server.tool = function (name: string, desc: string, schema: any, handler: any) {
    handlers.set(name, handler);
    return origTool(name, desc, schema, handler);
  } as any;
  return server;
}

beforeEach(() => {
  vi.clearAllMocks();
  handlers.clear();
});

describe("get_record tool", () => {
  it("returns record with normalized fields", async () => {
    const server = createTestServer();
    registerGetRecord(server);

    mockRequest.mockResolvedValueOnce({
      table_record: {
        id: "rec1", title: "Record A", url: "https://...",
        done: false, due_date: null, created_at: "2024-01-01", updated_at: "2024-01-02",
        record_fields: [
          { name: "Status", value: "Active" },
          { name: "Amount", value: "1500" },
        ],
        assignees: [],
      },
    });

    const handler = handlers.get("get_record")!;
    const result = await handler({ id: "rec1" });
    const data = JSON.parse(result.content[0].text);
    expect(data.id).toBe("rec1");
    expect(data.fields.Status).toBe("Active");
    expect(data.fields.Amount).toBe("1500");
  });
});

describe("create_record tool", () => {
  it("passes fields_attributes with string[] values", async () => {
    const server = createTestServer();
    registerCreateRecord(server);

    mockRequest.mockResolvedValueOnce({ createTableRecord: { clientMutationId: "x" } });

    const handler = handlers.get("create_record")!;
    await handler({
      table_id: "t1",
      title: "New Record",
      fields_attributes: [
        { field_id: "f1", field_value: ["Active"] },
        { field_id: "f2", field_value: ["100", "200"] },
      ],
    });

    const vars = mockRequest.mock.calls[0]![1] as any;
    expect(vars.input.table_id).toBe("t1");
    expect(vars.input.fields_attributes[0].field_value).toEqual(["Active"]);
  });
});

describe("set_record_field tool", () => {
  it("sends value as array", async () => {
    const server = createTestServer();
    registerSetRecordField(server);

    mockRequest.mockResolvedValueOnce({ setTableRecordFieldValue: { clientMutationId: "x" } });

    const handler = handlers.get("set_record_field")!;
    const result = await handler({ table_record_id: "rec1", field_id: "f1", value: ["new_val"] });
    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);

    const vars = (mockRequest.mock.calls[0]![1] as any).input;
    expect(vars.value).toEqual(["new_val"]);
  });
});

describe("list_records tool", () => {
  it("unwraps Relay connection for records", async () => {
    const server = createTestServer();
    registerListRecords(server);

    mockRequest.mockResolvedValueOnce({
      table_records: {
        edges: [
          { node: { id: "r1", title: "A", record_fields: [{ name: "X", value: "1" }] }, cursor: "c1" },
        ],
        pageInfo: { hasNextPage: false, endCursor: "c1" },
        totalCount: 1,
      },
    });

    const handler = handlers.get("list_records")!;
    const result = await handler({ table_id: "t1" });
    const data = JSON.parse(result.content[0].text);

    expect(data.records).toHaveLength(1);
    expect(data.records[0].fields.X).toBe("1");
    expect(data.records[0].record_fields).toBeUndefined();
    expect(data.hasNextPage).toBe(false);
  });
});
