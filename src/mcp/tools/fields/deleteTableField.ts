import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_TABLE_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteTableField(server: McpServer) {
  server.tool(
    "delete_table_field",
    "DESTRUCTIVE: Delete a table field. WARNING: May break automations.",
    {
      id: z.string().describe("Field ID"),
      table_id: z.string().describe("Table ID"),
    },
    async ({ id, table_id }) => {
      try {
        await pipefyRequest(M_DELETE_TABLE_FIELD, { input: { id, table_id } });
        return jsonResult({ success: true, deleted_field_id: id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
