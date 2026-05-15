import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_LOGS_BY_REPO } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationLogsByRepo(server: McpServer) {
  server.tool(
    "get_automation_logs_by_repo",
    "Get automation execution logs for all automations in a pipe.",
    {
      repo_id: z.string().describe("Pipe/repo ID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automationLogsByRepo: any }>(Q_AUTOMATION_LOGS_BY_REPO, {
          repoId: input.repo_id,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        return jsonResult(unwrapConnection(data.automationLogsByRepo));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
