import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateWebhook(server: McpServer) {
  server.tool("update_webhook", "Update a webhook's name, URL, actions, headers, or filters",
    { id: z.string(), name: z.string().optional(), url: z.string().optional(), actions: z.array(z.string()).optional(), email: z.string().optional(), filters: z.string().optional(), headers: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_WEBHOOK, { input }); return jsonResult({ success: true, webhook_id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
