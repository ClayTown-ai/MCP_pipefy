import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_FIELD_CONDITION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateFieldCondition(server: McpServer) {
  server.tool("create_field_condition", "Create a field condition (conditional logic) for a phase",
    {
      phaseId: z.string(), name: z.string(), index: z.string().optional(),
      condition: z.record(z.unknown()).describe("Condition with expressions and expressions_structure"),
      actions: z.record(z.unknown()).describe("Actions with actionId, phaseFieldId, whenEvaluator"),
    },
    async (input) => {
      try { await pipefyRequest(M_CREATE_FIELD_CONDITION, { input }); return jsonResult({ success: true, name: input.name }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
