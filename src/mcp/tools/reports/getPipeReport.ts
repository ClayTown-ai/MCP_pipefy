import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_REPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeReport(server: McpServer) {
  server.tool(
    "get_pipe_report",
    "Get a single pipe report by ID with fields, filters, and formulas.",
    {
      id: z.string().describe("Pipe Report ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipeReport: any }>(Q_PIPE_REPORT, { id: input.id });
        return jsonResult(data.pipeReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
