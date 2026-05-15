import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_REPORT_COLUMNS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeReportColumns(server: McpServer) {
  server.tool(
    "get_pipe_report_columns",
    "Get available columns for a pipe report.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipeReportColumns: any[] }>(Q_PIPE_REPORT_COLUMNS, { pipeId: input.pipe_id });
        return jsonResult(data.pipeReportColumns);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
