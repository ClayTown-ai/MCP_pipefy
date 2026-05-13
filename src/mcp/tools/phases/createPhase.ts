import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PHASE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreatePhase(server: McpServer) {
  server.tool(
    "create_phase",
    "Create a new phase in a pipe",
    {
      pipe_id: z.string().describe("Pipe ID"),
      name: z.string().describe("Phase name"),
      done: z.boolean().optional().describe("Mark as done/final phase"),
      description: z.string().optional(),
      lateness_time: z.number().optional().describe("Lateness time in seconds"),
      can_receive_card_directly_from_draft: z.boolean().optional(),
      only_admin_can_move_to_previous: z.boolean().optional(),
      index: z.string().optional().describe("Position index"),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_PHASE, { input });
        return jsonResult({ success: true, name: input.name });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
