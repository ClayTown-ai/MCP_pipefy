import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_REMOVE_USER_FROM_TABLE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerRemoveUserFromTable(server: McpServer) {
  server.tool("remove_user_from_table", "DESTRUCTIVE: Remove a user from a table",
    { table_id: z.string(), email: z.string() },
    async (input) => {
      try { await pipefyRequest(M_REMOVE_USER_FROM_TABLE, { input }); return jsonResult({ success: true, email: input.email }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
