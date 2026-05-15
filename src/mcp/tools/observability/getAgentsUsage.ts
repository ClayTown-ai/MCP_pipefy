import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AGENTS_USAGE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAgentsUsage(server: McpServer) {
  server.tool(
    "get_agents_usage",
    "Get AI agents usage details (credits) for an organization.",
    {
      organization_id: z.string().describe("Organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ agentsUsageDetails: any }>(Q_AGENTS_USAGE, { organizationId: input.organization_id });
        return jsonResult(data.agentsUsageDetails);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
