import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_ORG_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteOrgWebhook(server: McpServer) {
  server.tool("delete_org_webhook", "DESTRUCTIVE: Delete an organization webhook",
    { id: z.string() },
    async ({ id }) => {
      try { await pipefyRequest(M_DELETE_ORG_WEBHOOK, { input: { id } }); return jsonResult({ success: true, deleted_id: id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
