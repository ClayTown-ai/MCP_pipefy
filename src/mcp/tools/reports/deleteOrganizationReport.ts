import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_ORGANIZATION_REPORT } from "../../../pipefy/mutations.js";
import { Q_ORGANIZATION_REPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteOrganizationReport(server: McpServer) {
  server.tool(
    "delete_organization_report",
    "Delete an organization report. Use confirm=false to preview, confirm=true to execute.",
    {
      id: z.string().describe("Report ID"),
      confirm: z.boolean().default(false).describe("Set to true to actually delete"),
    },
    async (input) => {
      try {
        if (!input.confirm) {
          const data = await pipefyRequest<{ organizationReport: any }>(Q_ORGANIZATION_REPORT, { id: input.id });
          return jsonResult({ preview: true, message: "Set confirm=true to delete", organizationReport: data.organizationReport });
        }
        const data = await pipefyRequest<{ deleteOrganizationReport: any }>(M_DELETE_ORGANIZATION_REPORT, { input: { id: input.id } });
        return jsonResult({ deleted: true, ...data.deleteOrganizationReport });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
