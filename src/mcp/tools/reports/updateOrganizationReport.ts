import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_ORGANIZATION_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateOrganizationReport(server: McpServer) {
  server.tool(
    "update_organization_report",
    "Update an organization report.",
    {
      id: z.string().describe("Report ID"),
      name: z.string().optional().describe("New name"),
      pipe_ids: z.array(z.string()).optional().describe("Updated pipe IDs"),
      fields: z.array(z.string()).optional().describe("Updated fields"),
      filters: z.record(z.unknown()).optional().describe("Updated filters"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const { id, extra_input, ...fields } = input;
        const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
        const data = await pipefyRequest<{ updateOrganizationReport: { organizationReport: any } }>(M_UPDATE_ORGANIZATION_REPORT, {
          input: { id, ...cleanFields, ...extra_input },
        });
        return jsonResult(data.updateOrganizationReport.organizationReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
