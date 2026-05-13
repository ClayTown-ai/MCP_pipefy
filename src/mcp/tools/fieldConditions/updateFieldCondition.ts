import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_FIELD_CONDITION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateFieldCondition(server: McpServer) {
  server.tool("update_field_condition", "Update a field condition's name, expressions, or actions",
    {
      id: z.string(), phase_id: z.string().optional(), name: z.string().optional(),
      condition: z.record(z.unknown()).optional(), actions: z.record(z.unknown()).optional(),
    },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_FIELD_CONDITION, { input }); return jsonResult({ success: true, id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
