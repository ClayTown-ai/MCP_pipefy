import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_REMOVE_USER_FROM_ORG } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerRemoveUserFromOrg(server: McpServer) {
  server.tool("remove_user_from_org", "DESTRUCTIVE: Remove a user from an organization",
    { organization_id: z.string(), email: z.string() },
    async (input) => {
      try { await pipefyRequest(M_REMOVE_USER_FROM_ORG, { input }); return jsonResult({ success: true, email: input.email }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
