import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CARDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListCards(server: McpServer) {
  server.tool(
    "list_cards",
    "List cards in a pipe with simple filters (title, assignees, labels). Uses Relay pagination.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      first: z.number().int().positive().max(50).optional().describe("Page size (max 50)"),
      after: z.string().optional().describe("Cursor for next page"),
      title: z.string().optional().describe("Filter by title"),
      assignee_ids: z.array(z.string()).optional().describe("Filter by assignee IDs"),
      label_ids: z.array(z.string()).optional().describe("Filter by label IDs"),
      include_done: z.boolean().optional().describe("Include done cards"),
    },
    async ({ pipe_id, first, after, title, assignee_ids, label_ids, include_done }) => {
      try {
        const search: Record<string, unknown> = {};
        if (title) search.title = title;
        if (assignee_ids) search.assignee_ids = assignee_ids;
        if (label_ids) search.label_ids = label_ids;
        if (include_done !== undefined) search.include_done = include_done;

        const data = await pipefyRequest<{ cards: any }>(Q_CARDS, {
          pipe_id,
          first: first ?? 30,
          after,
          search: Object.keys(search).length ? search : undefined,
        });

        const result = unwrapConnection(data.cards);
        return jsonResult({
          cards: result.items.map((c: any) => ({
            ...c,
            fields: normalizeFields(c.fields),
          })),
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
