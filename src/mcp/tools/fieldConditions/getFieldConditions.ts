import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_FIELD_CONDITIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetFieldConditions(server: McpServer) {
  server.tool(
    "get_field_conditions",
    "List all field conditions (conditional visibility rules) for a phase. Returns each condition's expressions and actions.",
    {
      phase_id: z.string().describe("Phase ID to list field conditions for"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ phase: { id: string; name: string; fieldConditions: any[] } }>(
          Q_FIELD_CONDITIONS,
          { phaseId: input.phase_id },
        );
        if (!data.phase) return errorResult("NOT_FOUND", `Phase ${input.phase_id} not found`);
        return jsonResult({
          phase_id: data.phase.id,
          phase_name: data.phase.name,
          field_conditions: data.phase.fieldConditions ?? [],
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
