import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_SEARCH_PIPES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSearchPipes(server: McpServer) {
  server.tool(
    "search_pipes",
    "Search pipes by name within an organization. Returns pipes whose name contains the search term (case-insensitive).",
    {
      name: z.string().describe("Search term for pipe name"),
      organization_id: z.string().describe("Organization ID to search in"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ organization: { pipes: any[] } }>(Q_SEARCH_PIPES, {
          organizationId: input.organization_id,
        });
        const term = input.name.toLowerCase();
        const filtered = data.organization.pipes.filter(
          (p) => p.name.toLowerCase().includes(term),
        );
        return jsonResult(filtered);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
