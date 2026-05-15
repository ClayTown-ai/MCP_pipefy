import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_EXPORT_PIPE_AUDIT_LOGS } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerExportPipeAuditLogs(server: McpServer) {
  server.tool(
    "export_pipe_audit_logs",
    "Export audit logs for a pipe. The export is delivered asynchronously.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields (date filters, etc.)"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ exportPipeAuditLogs: any }>(M_EXPORT_PIPE_AUDIT_LOGS, {
          input: { pipe_id: input.pipe_id, ...input.extra_input },
        });
        return jsonResult({ started: true, ...data.exportPipeAuditLogs });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
