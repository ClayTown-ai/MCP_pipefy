import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_ACTIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationActions(server: McpServer) {
  server.tool(
    "get_automation_actions",
    "Get the catalog of available automation action types for a pipe.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automationActions: any[] }>(Q_AUTOMATION_ACTIONS, { pipeId: input.pipe_id });
        return jsonResult(data.automationActions);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
