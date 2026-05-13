import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PHASE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPhase(server: McpServer) {
  server.tool(
    "get_phase",
    "Get phase details including fields, card counts, late/expired counts, and navigation info",
    { id: z.string().describe("Phase ID") },
    async ({ id }) => {
      try {
        const data = await pipefyRequest<{ phase: any }>(Q_PHASE, { id });
        if (!data.phase) return errorResult("NOT_FOUND", `Phase ${id} not found`);
        return jsonResult(data.phase);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
