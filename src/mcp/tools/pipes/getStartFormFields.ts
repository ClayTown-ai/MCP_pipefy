import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_START_FORM_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetStartFormFields(server: McpServer) {
  server.tool(
    "get_start_form_fields",
    "Get the start form fields for a pipe (initial form fields).",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipe: { id: string; start_form_fields: any[] } }>(Q_START_FORM_FIELDS, { pipeId: input.pipe_id });
        return jsonResult(data.pipe.start_form_fields);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
