import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_ORG_WEBHOOK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateOrgWebhook(server: McpServer) {
  server.tool("create_org_webhook", "Create a webhook at organization level",
    { organization_id: z.string(), name: z.string(), url: z.string(), actions: z.array(z.string()), email: z.string().optional(), headers: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_CREATE_ORG_WEBHOOK, { input }); return jsonResult({ success: true, name: input.name }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
