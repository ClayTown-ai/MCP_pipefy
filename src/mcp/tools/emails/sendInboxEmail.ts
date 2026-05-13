import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SEND_INBOX_EMAIL } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSendInboxEmail(server: McpServer) {
  server.tool("send_inbox_email", "Send a previously created inbox email",
    { id: z.string().describe("Inbox email ID") },
    async ({ id }) => {
      try { await pipefyRequest(M_SEND_INBOX_EMAIL, { input: { id } }); return jsonResult({ success: true, sent_id: id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
