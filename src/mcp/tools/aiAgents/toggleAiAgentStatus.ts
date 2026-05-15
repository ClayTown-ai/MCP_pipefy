import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_TOGGLE_AI_AGENT_STATUS } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerToggleAiAgentStatus(server: McpServer) {
  server.tool(
    "toggle_ai_agent_status",
    "Activate or deactivate an AI agent without resending its full configuration.",
    {
      uuid: z.string().describe("Agent UUID"),
      active: z.boolean().describe("Whether the agent should be active"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ updateAiAgentStatus: { aiAgent: any } }>(M_TOGGLE_AI_AGENT_STATUS, {
          uuid: input.uuid,
          active: input.active,
        });
        return jsonResult(data.updateAiAgentStatus.aiAgent);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
