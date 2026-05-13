import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteWebhook(server: McpServer) {
  server.tool("delete_webhook", "DESTRUCTIVE: Delete a webhook",
    { id: z.string() },
    async ({ id }) => {
      try { await pipefyRequest(M_DELETE_WEBHOOK, { input: { id } }); return jsonResult({ success: true, deleted_id: id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
