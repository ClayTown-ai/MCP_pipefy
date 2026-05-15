import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_WEBHOOKS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetWebhooks(server: McpServer) {
  server.tool(
    "get_webhooks",
    "List webhooks configured for a pipe.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipe: { id: string; webhooks: any[] } }>(Q_WEBHOOKS, { pipeId: input.pipe_id });
        return jsonResult(data.pipe.webhooks);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
