import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_PIPE_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdatePipeReport(server: McpServer) {
  server.tool(
    "update_pipe_report",
    "Update a pipe report's name, fields, filters, or formulas.",
    {
      id: z.string().describe("Report ID"),
      name: z.string().optional().describe("New name"),
      fields: z.array(z.string()).optional().describe("Updated field IDs"),
      filters: z.record(z.unknown()).optional().describe("Updated filters"),
      formulas: z.array(z.record(z.unknown())).optional().describe("Updated formulas"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const { id, extra_input, ...fields } = input;
        const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
        const data = await pipefyRequest<{ updatePipeReport: { pipeReport: any } }>(M_UPDATE_PIPE_REPORT, {
          input: { id, ...cleanFields, ...extra_input },
        });
        return jsonResult(data.updatePipeReport.pipeReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
