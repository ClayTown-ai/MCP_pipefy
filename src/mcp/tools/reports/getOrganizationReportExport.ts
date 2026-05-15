import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATION_REPORT_EXPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetOrganizationReportExport(server: McpServer) {
  server.tool(
    "get_organization_report_export",
    "Poll the status of an organization report export.",
    {
      id: z.string().describe("Export ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ organizationReportExport: any }>(Q_ORGANIZATION_REPORT_EXPORT, { id: input.id });
        return jsonResult(data.organizationReportExport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
