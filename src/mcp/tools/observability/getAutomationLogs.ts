import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_LOGS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationLogs(server: McpServer) {
  server.tool(
    "get_automation_logs",
    "Get execution logs for a specific automation.",
    {
      automation_id: z.string().describe("Automation ID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automationLogs: any }>(Q_AUTOMATION_LOGS, {
          automationId: input.automation_id,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        return jsonResult(unwrapConnection(data.automationLogs));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
