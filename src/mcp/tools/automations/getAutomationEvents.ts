import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_EVENTS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationEvents(server: McpServer) {
  server.tool(
    "get_automation_events",
    "Get the global catalog of automation trigger events.",
    {},
    async () => {
      try {
        const data = await pipefyRequest<{ automationEvents: any[] }>(Q_AUTOMATION_EVENTS);
        return jsonResult(data.automationEvents);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
