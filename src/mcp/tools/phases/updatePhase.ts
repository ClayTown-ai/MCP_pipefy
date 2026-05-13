import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_PHASE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdatePhase(server: McpServer) {
  server.tool(
    "update_phase",
    "Update phase properties (name, color, done status, lateness, permissions)",
    {
      id: z.string().describe("Phase ID"),
      name: z.string().optional(),
      done: z.boolean().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      lateness_time: z.number().optional(),
      can_receive_card_directly_from_draft: z.boolean().optional(),
      only_admin_can_move_to_previous: z.boolean().optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_PHASE, { input });
        return jsonResult({ success: true, phase_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
