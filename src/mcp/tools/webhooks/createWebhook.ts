import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateWebhook(server: McpServer) {
  server.tool("create_webhook", "Create a webhook for a pipe or table. Actions: card.create, card.move, card.done, etc.",
    { pipe_id: z.string().optional(), table_id: z.string().optional(), name: z.string(), url: z.string(), actions: z.array(z.string()), email: z.string().optional(), filters: z.string().optional(), headers: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_CREATE_WEBHOOK, { input }); return jsonResult({ success: true, name: input.name }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
