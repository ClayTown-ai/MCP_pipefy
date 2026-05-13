import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

vi.mock("../pipefy/client.js", () => ({
  pipefyRequest: vi.fn(),
}));

import { pipefyRequest } from "../pipefy/client.js";
import { registerGetCard } from "../mcp/tools/cards/getCard.js";
import { registerCreateCard } from "../mcp/tools/cards/createCard.js";
import { registerUpdateCardField } from "../mcp/tools/cards/updateCardField.js";
import { registerDeleteCard } from "../mcp/tools/cards/deleteCard.js";
import { registerMoveCard } from "../mcp/tools/cards/moveCard.js";
import { registerListCards } from "../mcp/tools/cards/listCards.js";
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

describe("get_card tool", () => {
  it("returns normalized card data", async () => {
    const server = createTestServer();
    registerGetCard(server);

    mockRequest.mockResolvedValueOnce({
      card: {
        id: "1", title: "Test Card", url: "https://...", done: false,
        due_date: null, createdAt: "2024-01-01", updated_at: "2024-01-02",
        expired: false, late: false, overdue: false,
        current_phase: { id: "p1", name: "Start" },
        fields: [{ name: "Email", value: "test@test.com" }],
        assignees: [{ id: "u1", name: "User" }],
        labels: [],
        comments_count: 0, attachments_count: 0,
      },
    });

    const handler = handlers.get("get_card")!;
    const result = await handler({ id: "1" });
    const data = JSON.parse(result.content[0].text);
    expect(data.id).toBe("1");
    expect(data.title).toBe("Test Card");
    expect(data.fields.Email).toBe("test@test.com");
    expect(result.isError).toBe(false);
  });

  it("returns error on PipefyApiError", async () => {
    const server = createTestServer();
    registerGetCard(server);

    mockRequest.mockRejectedValueOnce(new PipefyApiError("NOT_FOUND", "Card not found"));

    const handler = handlers.get("get_card")!;
    const result = await handler({ id: "999" });
    expect(result.isError).toBe(true);
    const data = JSON.parse(result.content[0].text);
    expect(data.type).toBe("NOT_FOUND");
  });
});

describe("create_card tool", () => {
  it("passes fields_attributes correctly as array", async () => {
    const server = createTestServer();
    registerCreateCard(server);

    mockRequest.mockResolvedValueOnce({
      createCard: {
        card: {
          id: "42", title: "New Card", url: "https://...",
          current_phase: { id: "p1", name: "Start" },
          fields: [{ name: "Priority", value: "High" }],
        },
      },
    });

    const handler = handlers.get("create_card")!;
    const result = await handler({
      pipe_id: "100",
      title: "New Card",
      fields_attributes: [
        { field_id: "f1", field_value: ["High"] },
        { field_id: "f2", field_value: ["2024-01-01"] },
      ],
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.id).toBe("42");

    const vars = mockRequest.mock.calls[0]![1] as any;
    expect(vars.input.pipe_id).toBe("100");
    expect(vars.input.fields_attributes[0].field_value).toEqual(["High"]);
  });
});

describe("update_card_field tool", () => {
  it("sends new_value as array", async () => {
    const server = createTestServer();
    registerUpdateCardField(server);

    mockRequest.mockResolvedValueOnce({ updateCardField: { clientMutationId: "x", success: true } });

    const handler = handlers.get("update_card_field")!;
    const result = await handler({ card_id: "1", field_id: "f1", new_value: ["updated"] });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);

    const vars = (mockRequest.mock.calls[0]![1] as any).input;
    expect(vars.new_value).toEqual(["updated"]);
  });
});

describe("delete_card tool", () => {
  it("performs pre-read check before deletion", async () => {
    const server = createTestServer();
    registerDeleteCard(server);

    mockRequest
      .mockResolvedValueOnce({ card: { id: "1", title: "Doomed Card" } })
      .mockResolvedValueOnce({ deleteCard: { clientMutationId: "x", success: true } });

    const handler = handlers.get("delete_card")!;
    const result = await handler({ id: "1" });

    expect(mockRequest).toHaveBeenCalledTimes(2);
    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.deleted_title).toBe("Doomed Card");
  });

  it("returns NOT_FOUND when card doesn't exist", async () => {
    const server = createTestServer();
    registerDeleteCard(server);

    mockRequest.mockResolvedValueOnce({ card: null });

    const handler = handlers.get("delete_card")!;
    const result = await handler({ id: "999" });
    expect(result.isError).toBe(true);
    const data = JSON.parse(result.content[0].text);
    expect(data.type).toBe("NOT_FOUND");
  });
});

describe("move_card tool", () => {
  it("detects REQUIRED_FIELDS_MISSING", async () => {
    const server = createTestServer();
    registerMoveCard(server);

    mockRequest.mockRejectedValueOnce(
      new PipefyApiError("PIPEFY_ERROR", "The following required fields are missing values: Email"),
    );

    const handler = handlers.get("move_card")!;
    const result = await handler({ card_id: "1", destination_phase_id: "p2" });
    const data = JSON.parse(result.content[0].text);
    expect(data.type).toBe("REQUIRED_FIELDS_MISSING");
  });
});

describe("list_cards tool", () => {
  it("unwraps Relay connection and normalizes fields", async () => {
    const server = createTestServer();
    registerListCards(server);

    mockRequest.mockResolvedValueOnce({
      cards: {
        edges: [
          { node: { id: "1", title: "A", fields: [{ name: "Status", value: "Open" }] }, cursor: "c1" },
          { node: { id: "2", title: "B", fields: [{ name: "Status", value: "Closed" }] }, cursor: "c2" },
        ],
        pageInfo: { hasNextPage: true, endCursor: "c2" },
        totalCount: 50,
      },
    });

    const handler = handlers.get("list_cards")!;
    const result = await handler({ pipe_id: "100", first: 2 });
    const data = JSON.parse(result.content[0].text);

    expect(data.cards).toHaveLength(2);
    expect(data.cards[0].fields.Status).toBe("Open");
    expect(data.hasNextPage).toBe(true);
    expect(data.endCursor).toBe("c2");
    expect(data.totalCount).toBe(50);
  });
});
