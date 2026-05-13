import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_INVITE_USER_TO_GROUP } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerInviteUserToGroup(server: McpServer) {
  server.tool("invite_user_to_group", "Invite users to a group by email or UUID",
    { groupUuid: z.string(), usersEmails: z.array(z.string()).optional(), usersUuids: z.array(z.string()).optional() },
    async (input) => {
      try { await pipefyRequest(M_INVITE_USER_TO_GROUP, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
