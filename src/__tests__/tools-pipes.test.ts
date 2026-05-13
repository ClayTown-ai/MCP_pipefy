import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

vi.mock("../pipefy/client.js", () => ({
  pipefyRequest: vi.fn(),
}));

import { pipefyRequest } from "../pipefy/client.js";
import { registerGetPipe } from "../mcp/tools/pipes/getPipe.js";
import { registerCreatePipe } from "../mcp/tools/pipes/createPipe.js";
import { registerDeletePipe } from "../mcp/tools/pipes/deletePipe.js";
import { PipefyApiError } from "../core/errors.js";

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

describe("get_pipe tool", () => {
  it("returns pipe with phases and fields", async () => {
    const server = createTestServer();
    registerGetPipe(server);

    mockRequest.mockResolvedValueOnce({
      pipe: {
        id: "42", name: "Sales Pipeline", description: "Sales flow",
        phases: [{ id: "p1", name: "New Lead", fields: [{ id: "f1", label: "Email", type: "email" }] }],
        start_form_fields: [{ id: "f2", label: "Name", type: "short_text" }],
        labels: [{ id: "l1", name: "Hot", color: "#ff0000" }],
        members: [{ user: { id: "u1", name: "John" }, role_name: "admin" }],
      },
    });

    const handler = handlers.get("get_pipe")!;
    const result = await handler({ id: "42" });
    const data = JSON.parse(result.content[0].text);
    expect(data.id).toBe("42");
    expect(data.name).toBe("Sales Pipeline");
  });
});

describe("create_pipe tool", () => {
  it("creates a pipe with phases and labels", async () => {
    const server = createTestServer();
    registerCreatePipe(server);

    mockRequest.mockResolvedValueOnce({ createPipe: { clientMutationId: "x" } });

    const handler = handlers.get("create_pipe")!;
    const result = await handler({
      organization_id: "org1",
      name: "New Pipe",
      phases: [{ name: "Start" }, { name: "Done", done: true }],
      labels: [{ name: "Urgent", color: "#ff0000" }],
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);

    const vars = mockRequest.mock.calls[0][1] as any;
    expect(vars.input.organization_id).toBe("org1");
  });
});

describe("delete_pipe tool", () => {
  it("handles PipefyApiError gracefully", async () => {
    const server = createTestServer();
    registerDeletePipe(server);

    mockRequest.mockRejectedValueOnce(new PipefyApiError("PIPEFY_ERROR", "Access denied"));

    const handler = handlers.get("delete_pipe")!;
    const result = await handler({ id: "42" });
    expect(result.isError).toBe(true);
  });
});
