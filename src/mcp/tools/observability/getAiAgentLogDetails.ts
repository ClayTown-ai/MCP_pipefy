import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AGENT_LOG_DETAILS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAgentLogDetails(server: McpServer) {
  server.tool(
    "get_ai_agent_log_details",
    "Get detailed AI agent log with tracingNodes for a specific execution.",
    {
      id: z.string().describe("Log ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAgentLog: any }>(Q_AI_AGENT_LOG_DETAILS, { id: input.id });
        return jsonResult(data.aiAgentLog);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
