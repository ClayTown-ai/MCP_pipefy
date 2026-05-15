import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AGENT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAgent(server: McpServer) {
  server.tool(
    "get_ai_agent",
    "Get an AI agent by UUID with instruction and behaviors.",
    {
      uuid: z.string().describe("Agent UUID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAgent: any }>(Q_AI_AGENT, { uuid: input.uuid });
        return jsonResult(data.aiAgent);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
