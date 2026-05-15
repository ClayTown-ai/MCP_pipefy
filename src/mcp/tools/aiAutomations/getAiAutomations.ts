import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AUTOMATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAutomations(server: McpServer) {
  server.tool(
    "get_ai_automations",
    "List AI automations (generate_with_ai) for a pipe.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAutomations: any[] }>(Q_AI_AUTOMATIONS, { pipeId: input.pipe_id });
        return jsonResult(data.aiAutomations);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
