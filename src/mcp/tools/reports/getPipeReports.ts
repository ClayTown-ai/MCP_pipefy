import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_REPORTS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeReports(server: McpServer) {
  server.tool(
    "get_pipe_reports",
    "List pipe reports with pagination (uses pipeUuid).",
    {
      pipe_uuid: z.string().describe("Pipe UUID"),
      first: z.number().optional().default(30).describe("Page size"),
      after: z.string().optional().describe("Cursor for pagination"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipeReports: any }>(Q_PIPE_REPORTS, {
          pipeUuid: input.pipe_uuid,
          first: input.first,
          ...(input.after && { after: input.after }),
        });
        return jsonResult(unwrapConnection(data.pipeReports));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
