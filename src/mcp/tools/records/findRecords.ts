import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_FIND_RECORDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerFindRecords(server: McpServer) {
  server.tool(
    "find_records",
    "Find records in a table by a specific field value",
    {
      tableId: z.string().describe("Table ID"),
      fieldId: z.string().describe("Field ID to search"),
      fieldValue: z.string().describe("Value to match"),
      first: z.number().int().positive().max(50).optional(),
      after: z.string().optional(),
    },
    async ({ tableId, fieldId, fieldValue, first, after }) => {
      try {
        const data = await pipefyRequest<{ findRecords: any }>(Q_FIND_RECORDS, {
          tableId, first: first ?? 30, after,
          search: { fieldId, fieldValue },
        });
        const result = unwrapConnection(data.findRecords);
        return jsonResult({
          records: result.items.map((r: any) => ({ ...r, fields: normalizeFields(r.record_fields), record_fields: undefined })),
          hasNextPage: result.hasNextPage, endCursor: result.endCursor, totalCount: result.totalCount,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
