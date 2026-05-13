import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_ROLES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetRoles(server: McpServer) {
  server.tool("set_roles", "Set roles for multiple members at once",
    {
      members: z.array(z.object({ user_id: z.number(), role_name: z.string() })).min(1),
      pipe_id: z.string().optional(), table_id: z.string().optional(), organization_id: z.string().optional(),
    },
    async (input) => {
      try { await pipefyRequest(M_SET_ROLES, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
