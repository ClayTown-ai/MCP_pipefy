import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_TABLE_RECORD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateRecord(server: McpServer) {
  server.tool(
    "update_record",
    "Update record metadata (title, due_date, statusId). Use set_record_field for field values.",
    {
      id: z.string().describe("Record ID"),
      title: z.string().optional(),
      due_date: z.string().optional(),
      statusId: z.number().optional().describe("Status ID (numeric)"),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_TABLE_RECORD, { input });
        return jsonResult({ success: true, record_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
