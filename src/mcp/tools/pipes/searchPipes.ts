import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_SEARCH_PIPES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSearchPipes(server: McpServer) {
  server.tool(
    "search_pipes",
    "Search pipes by name across organizations.",
    {
      name: z.string().describe("Search term for pipe name"),
      organization_id: z.string().optional().describe("Filter by organization ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipes: any[] }>(Q_SEARCH_PIPES, {
          name: input.name,
          ...(input.organization_id && { organizationId: input.organization_id }),
        });
        return jsonResult(data.pipes);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
