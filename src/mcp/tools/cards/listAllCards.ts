import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ALL_CARDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListAllCards(server: McpServer) {
  server.tool(
    "list_all_cards",
    "Advanced card listing with AND/OR composite filters (AdvancedSearch). Use for complex queries combining multiple field conditions.",
    {
      pipeId: z.string().describe("Pipe ID"),
      first: z.number().int().positive().max(50).optional().describe("Page size (max 50)"),
      after: z.string().optional().describe("Cursor for next page"),
      filter: z.record(z.unknown()).optional().describe("AdvancedSearch filter with AND/OR/field/operator/value"),
    },
    async ({ pipeId, first, after, filter }) => {
      try {
        const data = await pipefyRequest<{ allCards: any }>(Q_ALL_CARDS, {
          pipeId,
          first: first ?? 30,
          after,
          filter,
        });
        const result = unwrapConnection(data.allCards);
        return jsonResult({
          cards: result.items.map((c: any) => ({ ...c, fields: normalizeFields(c.fields) })),
          hasNextPage: result.hasNextPage,
          endCursor: result.endCursor,
          totalCount: result.totalCount,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
