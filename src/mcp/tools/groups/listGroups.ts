import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_GROUPS } from "../../../pipefy/queries.js";
import { unwrapConnection, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListGroups(server: McpServer) {
  server.tool("list_groups", "List user groups in an organization. Uses Relay pagination.",
    { organizationUuid: z.string(), first: z.number().int().positive().max(50).optional(), after: z.string().optional() },
    async ({ organizationUuid, first, after }) => {
      try {
        const data = await pipefyRequest<{ groups: any }>(Q_GROUPS, { organizationUuid, first: first ?? 30, after });
        const result = unwrapConnection(data.groups);
        return jsonResult({ groups: result.items, hasNextPage: result.hasNextPage, endCursor: result.endCursor, totalCount: result.totalCount });
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
