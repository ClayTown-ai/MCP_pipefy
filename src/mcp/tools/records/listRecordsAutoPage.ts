import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Q_TABLE_RECORDS } from "../../../pipefy/queries.js";
import { paginateAll, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListRecordsAutoPage(server: McpServer) {
  server.tool(
    "list_records_all_pages",
    "Fetch ALL records from a table (auto-paginating through all pages, max 1000). Use when you need a complete list.",
    {
      table_id: z.string().describe("Table ID"),
      title: z.string().optional(),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      include_done: z.boolean().optional(),
      orderDirection: z.string().optional().describe("asc or desc"),
      orderField: z.string().optional(),
    },
    async ({ table_id, ...search }) => {
      try {
        const searchObj: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(search)) { if (v !== undefined) searchObj[k] = v; }

        const { items, totalCount, pagesFetched } = await paginateAll<any>(
          Q_TABLE_RECORDS,
          { table_id, search: Object.keys(searchObj).length ? searchObj : undefined },
          "table_records",
        );

        return jsonResult({
          records: items.map((r: any) => ({
            ...r,
            fields: normalizeFields(r.record_fields),
            record_fields: undefined,
          })),
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
