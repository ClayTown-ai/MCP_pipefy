import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_COMMENT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateComment(server: McpServer) {
  server.tool("create_comment", "Add a comment to a card",
    { card_id: z.string(), text: z.string() },
    async (input) => {
      try { await pipefyRequest(M_CREATE_COMMENT, { input }); return jsonResult({ success: true, card_id: input.card_id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
