import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_JOBS_EXPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomationJobsExport(server: McpServer) {
  server.tool(
    "get_automation_jobs_export",
    "Poll the status of an automation jobs export. Returns state and fileURL when ready.",
    {
      id: z.string().describe("Export ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automationJobsExport: any }>(Q_AUTOMATION_JOBS_EXPORT, { id: input.id });
        return jsonResult(data.automationJobsExport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
