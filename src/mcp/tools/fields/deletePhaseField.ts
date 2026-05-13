import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_PHASE_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeletePhaseField(server: McpServer) {
  server.tool(
    "delete_phase_field",
    "DESTRUCTIVE: Delete a phase field. WARNING: May break automations referencing this field.",
    {
      id: z.string().describe("Field ID"),
      pipeUuid: z.string().optional().describe("Pipe UUID (required by some API versions)"),
    },
    async ({ id, pipeUuid }) => {
      try {
        await pipefyRequest(M_DELETE_PHASE_FIELD, {
          input: { id, ...(pipeUuid && { pipeUuid }) },
        });
        return jsonResult({ success: true, deleted_field_id: id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
