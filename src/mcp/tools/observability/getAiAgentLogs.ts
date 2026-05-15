import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AGENT_LOGS_BY_REPO } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAgentLogs(server: McpServer) {
  server.tool(
    "get_ai_agent_logs",
    "Get AI agent execution logs for a pipe (by repo UUID) with pagination.",
    {
      repo_uuid: z.string().describe("Pipe repo UUID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAgentLogsByRepo: any }>(Q_AI_AGENT_LOGS_BY_REPO, {
          repoUuid: input.repo_uuid,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        return jsonResult(unwrapConnection(data.aiAgentLogsByRepo));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
