import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_TABLE_RECORD } from "../../../pipefy/queries.js";
import { M_DELETE_TABLE_RECORD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteRecord(server: McpServer) {
  server.tool(
    "delete_record",
    "DESTRUCTIVE: Permanently delete a table record. Reads first to confirm.",
    { id: z.string().describe("Record ID to delete") },
    async ({ id }) => {
      try {
        const check = await pipefyRequest<{ table_record: { id: string; title: string } }>(
          Q_TABLE_RECORD, { id },
        );
        if (!check.table_record) return errorResult("NOT_FOUND", `Record ${id} not found`);

        await pipefyRequest(M_DELETE_TABLE_RECORD, { input: { id } });
        return jsonResult({ success: true, deleted_id: id, deleted_title: check.table_record.title });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
