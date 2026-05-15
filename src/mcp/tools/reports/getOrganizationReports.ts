import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATION_REPORTS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetOrganizationReports(server: McpServer) {
  server.tool(
    "get_organization_reports",
    "List organization reports with pagination.",
    {
      organization_id: z.string().describe("Organization ID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ organizationReports: any }>(Q_ORGANIZATION_REPORTS, {
          organizationId: input.organization_id,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        return jsonResult(unwrapConnection(data.organizationReports));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
