import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_PHASE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeletePhase(server: McpServer) {
  server.tool(
    "delete_phase",
    "DESTRUCTIVE: Delete a phase. WARNING: May break automations that reference this phase.",
    { id: z.string().describe("Phase ID to delete") },
    async ({ id }) => {
      try {
        const check = await pipefyRequest<{ phase: { id: string; name: string; cards_count: number } }>(
          `query ($id: ID!) { phase(id: $id) { id name cards_count } }`, { id },
        );
        if (!check.phase) return errorResult("NOT_FOUND", `Phase ${id} not found`);
        if (check.phase.cards_count > 0) {
          return errorResult("DESTRUCTIVE_BLOCKED",
            `Phase "${check.phase.name}" has ${check.phase.cards_count} cards. Move them first.`);
        }
        await pipefyRequest(M_DELETE_PHASE, { input: { id } });
        return jsonResult({ success: true, deleted_id: id, deleted_name: check.phase.name });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
