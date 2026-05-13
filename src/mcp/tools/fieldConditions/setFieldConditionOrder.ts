import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_FIELD_CONDITION_ORDER } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetFieldConditionOrder(server: McpServer) {
  server.tool("set_field_condition_order", "Set the evaluation order of field conditions in a phase",
    { phaseId: z.string(), fieldConditionIds: z.array(z.string()).min(1) },
    async (input) => {
      try { await pipefyRequest(M_SET_FIELD_CONDITION_ORDER, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
