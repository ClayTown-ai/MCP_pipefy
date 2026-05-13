import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_ORGANIZATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateOrganization(server: McpServer) {
  server.tool("update_organization", "Update organization settings",
    { id: z.string(), name: z.string().optional(), only_admin_can_create_pipes: z.boolean().optional(), only_admin_can_invite_users: z.boolean().optional() },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_ORGANIZATION, { input }); return jsonResult({ success: true, org_id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
