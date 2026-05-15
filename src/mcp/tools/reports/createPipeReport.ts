import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PIPE_REPORT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreatePipeReport(server: McpServer) {
  server.tool(
    "create_pipe_report",
    "Create a pipe report with name, fields, filters, and formulas.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      name: z.string().describe("Report name"),
      fields: z.array(z.string()).optional().describe("Field IDs to include"),
      filters: z.record(z.unknown()).optional().describe("Filter configuration"),
      formulas: z.array(z.record(z.unknown())).optional().describe("Formula definitions"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createPipeReport: { pipeReport: any } }>(M_CREATE_PIPE_REPORT, {
          input: {
            pipe_id: input.pipe_id,
            name: input.name,
            ...(input.fields && { fields: input.fields }),
            ...(input.filters && { filters: input.filters }),
            ...(input.formulas && { formulas: input.formulas }),
            ...input.extra_input,
          },
        });
        return jsonResult(data.createPipeReport.pipeReport);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
