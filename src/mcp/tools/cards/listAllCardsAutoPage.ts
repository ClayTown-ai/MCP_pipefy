import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Q_CARDS } from "../../../pipefy/queries.js";
import { paginateAll, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListCardsAutoPage(server: McpServer) {
  server.tool(
    "list_cards_all_pages",
    "Fetch ALL cards from a pipe (auto-paginating through all pages, max 1000). Use when you need a complete list.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      title: z.string().optional(),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      include_done: z.boolean().optional(),
    },
    async ({ pipe_id, title, assignee_ids, label_ids, include_done }) => {
      try {
        const search: Record<string, unknown> = {};
        if (title) search.title = title;
        if (assignee_ids) search.assignee_ids = assignee_ids;
        if (label_ids) search.label_ids = label_ids;
        if (include_done !== undefined) search.include_done = include_done;

        const { items, totalCount, pagesFetched } = await paginateAll<any>(
          Q_CARDS,
          { pipe_id, search: Object.keys(search).length ? search : undefined },
          "cards",
        );

        return jsonResult({
          cards: items.map((c: any) => ({ ...c, fields: normalizeFields(c.fields) })),
          totalCount,
          fetched: items.length,
          pagesFetched,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
