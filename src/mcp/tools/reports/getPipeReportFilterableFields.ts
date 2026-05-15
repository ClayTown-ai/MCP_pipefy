import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_REPORT_FILTERABLE_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeReportFilterableFields(server: McpServer) {
  server.tool(
    "get_pipe_report_filterable_fields",
    "Get filterable fields grouped by phase for pipe reports.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipeReportFilterableFields: any[] }>(Q_PIPE_REPORT_FILTERABLE_FIELDS, { pipeId: input.pipe_id });
        return jsonResult(data.pipeReportFilterableFields);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
