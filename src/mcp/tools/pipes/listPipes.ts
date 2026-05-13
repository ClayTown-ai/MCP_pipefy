import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListPipes(server: McpServer) {
  server.tool(
    "list_pipes",
    "List pipes by IDs with basic info (name, cards count, icon, color, etc.)",
    { ids: z.array(z.string()).min(1).describe("Array of Pipe IDs") },
    async ({ ids }) => {
      try {
        const data = await pipefyRequest<{ pipes: any[] }>(Q_PIPES, { ids });
        return jsonResult(data.pipes);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
