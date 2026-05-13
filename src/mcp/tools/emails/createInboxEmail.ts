import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_INBOX_EMAIL } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateInboxEmail(server: McpServer) {
  server.tool("create_inbox_email", "Create an inbox email draft on a card",
    {
      card_id: z.string(), from: z.string(), main_to: z.string(), subject: z.string(),
      text: z.string().optional(), html: z.string().optional(),
      to: z.array(z.string()).optional(), cc: z.array(z.string()).optional(), bcc: z.array(z.string()).optional(),
      repo_id: z.string().optional(), state: z.string().optional(),
    },
    async (input) => {
      try { await pipefyRequest(M_CREATE_INBOX_EMAIL, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
