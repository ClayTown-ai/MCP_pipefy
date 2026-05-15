import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_AGENTS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiAgents(server: McpServer) {
  server.tool(
    "get_ai_agents",
    "List AI agents for a pipe (by repo UUID) with pagination.",
    {
      repo_uuid: z.string().describe("Pipe repo UUID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiAgents: any }>(Q_AI_AGENTS, {
          repoUuid: input.repo_uuid,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        const result = unwrapConnection(data.aiAgents);
        return jsonResult(result);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
