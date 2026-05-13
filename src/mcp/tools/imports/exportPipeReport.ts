import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_EXPORT_PIPE_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerExportPipeReport(server: McpServer) {
  server.tool("export_pipe_report", "Start an async pipe report export. Use get_pipe_report_export to check status.",
    {
      pipeId: z.string(), pipeReportId: z.string().optional(),
      columns: z.array(z.string()).optional(),
      filter: z.record(z.unknown()).optional(), sortBy: z.object({ field: z.string(), direction: z.string() }).optional(),
    },
    async (input) => {
      try { await pipefyRequest(M_EXPORT_PIPE_REPORT, { input }); return jsonResult({ success: true, message: "Export started. Use get_pipe_report_export to check status." }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
