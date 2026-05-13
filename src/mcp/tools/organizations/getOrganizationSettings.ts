import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ORGANIZATION_SETTINGS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetOrganizationSettings(server: McpServer) {
  server.tool("get_organization_settings", "Get organization advanced settings (SSO, branding, provisioning)",
    { id: z.string().describe("Organization ID") },
    async ({ id }) => {
      try { const data = await pipefyRequest<{ organizationSettings: any }>(Q_ORGANIZATION_SETTINGS, { id }); return jsonResult(data.organizationSettings); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
