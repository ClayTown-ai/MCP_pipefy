import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AUTOMATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAutomation(server: McpServer) {
  server.tool(
    "get_ai_automation",
    "Get a single AI automation by ID with prompt, field IDs, and condition.",
    {
      id: z.string().describe("AI Automation ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAutomation: any }>(Q_AI_AUTOMATION, { id: input.id });
        return jsonResult(data.aiAutomation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
