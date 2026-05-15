import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PHASE_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPhaseFields(server: McpServer) {
  server.tool(
    "get_phase_fields",
    "Get the fields for a specific phase.",
    {
      phase_id: z.string().describe("Phase ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ phase: { id: string; name: string; fields: any[] } }>(Q_PHASE_FIELDS, { phaseId: input.phase_id });
        return jsonResult({ phase_id: data.phase.id, phase_name: data.phase.name, fields: data.phase.fields });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
