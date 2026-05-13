import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_SUMMARY_ATTRIBUTES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetSummaryAttributes(server: McpServer) {
  server.tool("set_summary_attributes", "Set which fields appear in card/record summaries",
    { pipe_id: z.string().optional(), table_id: z.string().optional(), summary_attributes: z.array(z.string()) },
    async (input) => {
      try { await pipefyRequest(M_SET_SUMMARY_ATTRIBUTES, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
