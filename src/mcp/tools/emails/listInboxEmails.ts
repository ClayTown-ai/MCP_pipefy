import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_INBOX_EMAILS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListInboxEmails(server: McpServer) {
  server.tool("list_inbox_emails", "List all inbox emails for a card",
    { card_id: z.string() },
    async ({ card_id }) => {
      try { const data = await pipefyRequest<{ inbox_emails: any[] }>(Q_INBOX_EMAILS, { card_id }); return jsonResult(data.inbox_emails); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
