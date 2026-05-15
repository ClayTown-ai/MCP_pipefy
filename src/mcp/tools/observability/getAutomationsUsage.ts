import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATIONS_USAGE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationsUsage(server: McpServer) {
  server.tool(
    "get_automations_usage",
    "Get automations usage details (executions) for an organization.",
    {
      organization_id: z.string().describe("Organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automationsUsageDetails: any }>(Q_AUTOMATIONS_USAGE, { organizationId: input.organization_id });
        return jsonResult(data.automationsUsageDetails);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
