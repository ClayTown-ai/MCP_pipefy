import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetOrganization(server: McpServer) {
  server.tool("get_organization", "Get organization details (name, members, pipes, plan, SSO settings)",
    { id: z.string().describe("Organization ID") },
    async ({ id }) => {
      try { const data = await pipefyRequest<{ organization: any }>(Q_ORGANIZATION, { id }); if (!data.organization) return errorResult("NOT_FOUND", `Organization ${id} not found`); return jsonResult(data.organization); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
