import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AI_CREDIT_USAGE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAiCreditUsage(server: McpServer) {
  server.tool(
    "get_ai_credit_usage",
    "Get the AI credit usage dashboard for an organization.",
    {
      organization_id: z.string().describe("Organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ aiCreditUsageStats: any }>(Q_AI_CREDIT_USAGE, { organizationId: input.organization_id });
        return jsonResult(data.aiCreditUsageStats);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
