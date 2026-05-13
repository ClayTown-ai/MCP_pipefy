import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_RELATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListPipeRelations(server: McpServer) {
  server.tool("list_pipe_relations", "List pipe relation definitions by IDs",
    { ids: z.array(z.string()).min(1).describe("Relation IDs") },
    async ({ ids }) => {
      try {
        const data = await pipefyRequest<{ pipe_relations: any[] }>(Q_PIPE_RELATIONS, { ids });
        return jsonResult(data.pipe_relations);
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
