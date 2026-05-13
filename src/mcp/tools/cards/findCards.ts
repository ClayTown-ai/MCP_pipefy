import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_FIND_CARDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerFindCards(server: McpServer) {
  server.tool(
    "find_cards",
    "Find cards in a pipe by a specific field value (fieldId + fieldValue)",
    {
      pipeId: z.string().describe("Pipe ID"),
      fieldId: z.string().describe("Field ID to search"),
      fieldValue: z.string().describe("Value to match"),
      first: z.number().int().positive().max(50).optional(),
      after: z.string().optional(),
    },
    async ({ pipeId, fieldId, fieldValue, first, after }) => {
      try {
        const data = await pipefyRequest<{ findCards: any }>(Q_FIND_CARDS, {
          pipeId,
          first: first ?? 30,
          after,
          search: { fieldId, fieldValue },
        });
        const result = unwrapConnection(data.findCards);
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
