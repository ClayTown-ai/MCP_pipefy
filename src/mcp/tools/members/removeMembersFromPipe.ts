import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_REMOVE_MEMBERS_FROM_PIPE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerRemoveMembersFromPipe(server: McpServer) {
  server.tool("remove_members_from_pipe", "DESTRUCTIVE: Remove multiple users/groups from a pipe",
    { pipeUuid: z.string(), usersUuids: z.array(z.string()).optional(), groupsUuids: z.array(z.string()).optional() },
    async (input) => {
      try { await pipefyRequest(M_REMOVE_MEMBERS_FROM_PIPE, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
