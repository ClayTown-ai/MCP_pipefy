import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_INVITE_MEMBERS } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerInviteMembers(server: McpServer) {
  server.tool("invite_members", "Invite members to a pipe, table, or organization",
    {
      emails: z.array(z.object({ email: z.string(), role_name: z.string() })).min(1),
      pipe_id: z.string().optional(), table_id: z.string().optional(), organization_id: z.string().optional(),
      message: z.string().optional().describe("Custom invitation message"),
    },
    async (input) => {
      try { await pipefyRequest(M_INVITE_MEMBERS, { input }); return jsonResult({ success: true, invited: input.emails.length }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
