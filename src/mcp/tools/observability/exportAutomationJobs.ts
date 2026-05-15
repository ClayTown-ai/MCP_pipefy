import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_EXPORT_AUTOMATION_JOBS } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerExportAutomationJobs(server: McpServer) {
  server.tool(
    "export_automation_jobs",
    "Start an async export of automation job history. Use get_automation_jobs_export to poll status.",
    {
      automation_id: z.string().describe("Automation ID"),
      pipe_id: z.string().optional().describe("Pipe ID"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createAutomationJobsExport: { automationJobsExport: any } }>(
          M_EXPORT_AUTOMATION_JOBS,
          { input: { automation_id: input.automation_id, ...(input.pipe_id && { pipe_id: input.pipe_id }), ...input.extra_input } },
        );
        return jsonResult(data.createAutomationJobsExport.automationJobsExport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
