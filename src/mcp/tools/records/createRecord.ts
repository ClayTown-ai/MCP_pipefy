import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_TABLE_RECORD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateRecord(server: McpServer) {
  server.tool(
    "create_record",
    "Create a new record in a database table. fields_attributes uses [{field_id, field_value: string[]}].",
    {
      table_id: z.string().describe("Table ID"),
      title: z.string().optional(),
      fields_attributes: z.array(z.object({
        field_id: z.string(),
        field_value: z.array(z.string()),
      })).optional(),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      due_date: z.string().optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_TABLE_RECORD, { input });
        return jsonResult({ success: true, table_id: input.table_id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
