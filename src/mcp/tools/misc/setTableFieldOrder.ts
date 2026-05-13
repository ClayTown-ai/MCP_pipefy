import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_TABLE_FIELD_ORDER } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetTableFieldOrder(server: McpServer) {
  server.tool("set_table_field_order", "Set the display order of fields in a table",
    { table_id: z.string(), field_ids: z.array(z.string()).min(1) },
    async (input) => {
      try { await pipefyRequest(M_SET_TABLE_FIELD_ORDER, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
