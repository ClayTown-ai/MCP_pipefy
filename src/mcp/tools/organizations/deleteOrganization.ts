import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_ORGANIZATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteOrganization(server: McpServer) {
  server.tool("delete_organization", "DESTRUCTIVE: Permanently delete an organization and all its data",
    { id: z.string().describe("Organization ID") },
    async ({ id }) => {
      try { await pipefyRequest(M_DELETE_ORGANIZATION, { input: { id } }); return jsonResult({ success: true, deleted_id: id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
