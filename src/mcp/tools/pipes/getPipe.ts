import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipe(server: McpServer) {
  server.tool(
    "get_pipe",
    "Get full pipe info including all phases, fields, start form fields, labels, and members",
    { id: z.string().describe("Pipe ID") },
    async ({ id }) => {
      try {
        const data = await pipefyRequest<{ pipe: any }>(Q_PIPE, { id });
        return jsonResult(data.pipe);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
