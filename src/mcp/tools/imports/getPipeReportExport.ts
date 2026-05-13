import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_REPORT_EXPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeReportExport(server: McpServer) {
  server.tool("get_pipe_report_export", "Check the status and download URL of a pipe report export",
    { id: z.string().describe("Export ID") },
    async ({ id }) => {
      try { const data = await pipefyRequest<{ pipeReportExport: any }>(Q_PIPE_REPORT_EXPORT, { id }); if (!data.pipeReportExport) return errorResult("NOT_FOUND", `Pipe report export ${id} not found`); return jsonResult(data.pipeReportExport); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
