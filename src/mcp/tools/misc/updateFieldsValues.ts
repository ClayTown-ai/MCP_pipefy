import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_FIELDS_VALUES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateFieldsValues(server: McpServer) {
  server.tool("update_fields_values", "Batch update multiple field values on a card/record at once",
    {
      nodeId: z.string().describe("Card or record ID"),
      values: z.array(z.object({
        fieldId: z.string(),
        value: z.array(z.string()),
        operation: z.string().optional(),
      })),
    },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_FIELDS_VALUES, { input }); return jsonResult({ success: true, nodeId: input.nodeId }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
