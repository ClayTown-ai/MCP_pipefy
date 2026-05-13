import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_PIPE_RELATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeletePipeRelation(server: McpServer) {
  server.tool("delete_pipe_relation", "DESTRUCTIVE: Delete a pipe relation. WARNING: Breaks automations using this relation.",
    { id: z.string().describe("Relation ID") },
    async ({ id }) => {
      try {
        await pipefyRequest(M_DELETE_PIPE_RELATION, { input: { id } });
        return jsonResult({ success: true, deleted_id: id });
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
