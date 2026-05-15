import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_RESOLVE_ORG_UUID } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerResolveOrgUuid(server: McpServer) {
  server.tool(
    "resolve_org_uuid",
    "Resolve an organization's UUID from its numeric ID.",
    {
      organization_id: z.string().describe("Organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ organization: { id: string; uuid: string } }>(Q_RESOLVE_ORG_UUID, { id: input.organization_id });
        return jsonResult(data.organization);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
