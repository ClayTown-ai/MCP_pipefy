import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListOrganizations(server: McpServer) {
  server.tool("list_organizations", "List organizations accessible to the user",
    { ids: z.array(z.string()).optional(), order: z.boolean().optional() },
    async ({ ids, order }) => {
      try { const data = await pipefyRequest<{ organizations: any[] }>(Q_ORGANIZATIONS, { ids, order }); return jsonResult(data.organizations); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
