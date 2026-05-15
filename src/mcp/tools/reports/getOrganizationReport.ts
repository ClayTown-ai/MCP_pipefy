import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATION_REPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetOrganizationReport(server: McpServer) {
  server.tool(
    "get_organization_report",
    "Get a single organization report by ID.",
    {
      id: z.string().describe("Organization Report ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ organizationReport: any }>(Q_ORGANIZATION_REPORT, { id: input.id });
        return jsonResult(data.organizationReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
