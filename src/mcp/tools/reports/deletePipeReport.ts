import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_PIPE_REPORT } from "../../../pipefy/mutations.js";
import { Q_PIPE_REPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeletePipeReport(server: McpServer) {
  server.tool(
    "delete_pipe_report",
    "Delete a pipe report. Use confirm=false to preview, confirm=true to execute.",
    {
      id: z.string().describe("Report ID"),
      confirm: z.boolean().default(false).describe("Set to true to actually delete"),
    },
    async (input) => {
      try {
        if (!input.confirm) {
          const data = await pipefyRequest<{ pipeReport: any }>(Q_PIPE_REPORT, { id: input.id });
          return jsonResult({ preview: true, message: "Set confirm=true to delete", pipeReport: data.pipeReport });
        }
        const data = await pipefyRequest<{ deletePipeReport: any }>(M_DELETE_PIPE_REPORT, { input: { id: input.id } });
        return jsonResult({ deleted: true, ...data.deletePipeReport });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
