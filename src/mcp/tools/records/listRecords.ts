import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_TABLE_RECORDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListRecords(server: McpServer) {
  server.tool(
    "list_records",
    "List records in a table with optional filters and sorting. Uses Relay pagination.",
    {
      table_id: z.string().describe("Table ID"),
      first: z.number().int().positive().max(50).optional(),
      after: z.string().optional(),
      title: z.string().optional(),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      include_done: z.boolean().optional(),
      orderDirection: z.string().optional().describe("asc or desc"),
      orderField: z.string().optional(),
    },
    async ({ table_id, first, after, ...search }) => {
      try {
        const searchObj: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(search)) { if (v !== undefined) searchObj[k] = v; }

        const data = await pipefyRequest<{ table_records: any }>(Q_TABLE_RECORDS, {
          table_id, first: first ?? 30, after,
          search: Object.keys(searchObj).length ? searchObj : undefined,
        });
        const result = unwrapConnection(data.table_records);
        return jsonResult({
          records: result.items.map((r: any) => ({ ...r, fields: normalizeFields(r.record_fields), record_fields: undefined })),
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
