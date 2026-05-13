import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_TABLE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteTable(server: McpServer) {
  server.tool(
    "delete_table",
    "DESTRUCTIVE: Permanently delete a table and all its records",
    { id: z.string().describe("Table ID to delete") },
    async ({ id }) => {
      try {
        const check = await pipefyRequest<{ table: { id: string; name: string; table_records_count: number } }>(
          `query ($id: ID!) { table(id: $id) { id name table_records_count } }`, { id },
        );
        if (!check.table) return errorResult("NOT_FOUND", `Table ${id} not found`);

        await pipefyRequest(M_DELETE_TABLE, { input: { id } });
        return jsonResult({
          success: true, deleted_id: id,
          deleted_name: check.table.name,
          records_deleted: check.table.table_records_count,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
