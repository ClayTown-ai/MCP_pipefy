import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_INBOX_EMAIL } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteInboxEmail(server: McpServer) {
  server.tool("delete_inbox_email", "DESTRUCTIVE: Delete an inbox email",
    { id: z.string() },
    async ({ id }) => {
      try { await pipefyRequest(M_DELETE_INBOX_EMAIL, { input: { id } }); return jsonResult({ success: true, deleted_id: id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
