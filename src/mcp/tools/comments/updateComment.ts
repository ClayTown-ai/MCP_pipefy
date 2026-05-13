import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_COMMENT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateComment(server: McpServer) {
  server.tool("update_comment", "Update a comment's text",
    { id: z.string(), text: z.string() },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_COMMENT, { input }); return jsonResult({ success: true, comment_id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
