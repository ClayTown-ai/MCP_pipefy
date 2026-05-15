import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_SEARCH_TABLES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, unwrapConnection } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSearchTables(server: McpServer) {
  server.tool(
    "search_tables",
    "Search tables by name across organizations.",
    {
      name: z.string().describe("Search term for table name"),
      organization_id: z.string().optional().describe("Filter by organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ tables: any }>(Q_SEARCH_TABLES, {
          name: input.name,
          ...(input.organization_id && { organizationId: input.organization_id }),
        });
        return jsonResult(unwrapConnection(data.tables));
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
