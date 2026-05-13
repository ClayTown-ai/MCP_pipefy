import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_ORG_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateOrgWebhook(server: McpServer) {
  server.tool("update_org_webhook", "Update an organization webhook",
    { id: z.string(), name: z.string().optional(), url: z.string().optional(), actions: z.array(z.string()).optional(), email: z.string().optional(), headers: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_ORG_WEBHOOK, { input }); return jsonResult({ success: true, webhook_id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
