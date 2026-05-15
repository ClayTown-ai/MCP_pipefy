import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_EXPORT_ORGANIZATION_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerExportOrganizationReport(server: McpServer) {
  server.tool(
    "export_organization_report",
    "Start an export of an organization report. Use get_organization_report_export to poll.",
    {
      id: z.string().describe("Organization Report ID"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ exportOrganizationReport: any }>(M_EXPORT_ORGANIZATION_REPORT, {
          input: { id: input.id, ...input.extra_input },
        });
        return jsonResult({ started: true, ...data.exportOrganizationReport });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
