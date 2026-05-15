import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_ORGANIZATION_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateOrganizationReport(server: McpServer) {
  server.tool(
    "create_organization_report",
    "Create a multi-pipe organization report.",
    {
      organization_id: z.string().describe("Organization ID"),
      name: z.string().describe("Report name"),
      pipe_ids: z.array(z.string()).describe("Pipe IDs to include"),
      fields: z.array(z.string()).optional().describe("Field IDs"),
      filters: z.record(z.unknown()).optional().describe("Filter configuration"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createOrganizationReport: { organizationReport: any } }>(M_CREATE_ORGANIZATION_REPORT, {
          input: {
            organization_id: input.organization_id,
            name: input.name,
            pipe_ids: input.pipe_ids,
            ...(input.fields && { fields: input.fields }),
            ...(input.filters && { filters: input.filters }),
            ...input.extra_input,
          },
        });
        return jsonResult(data.createOrganizationReport.organizationReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
