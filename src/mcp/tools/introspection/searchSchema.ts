import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_SCHEMA_TYPES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSearchSchema(server: McpServer) {
  server.tool(
    "search_schema",
    "Search GraphQL schema types by keyword. Optionally filter by kind (OBJECT, INPUT_OBJECT, ENUM, SCALAR, INTERFACE, UNION).",
    {
      keyword: z.string().describe("Search keyword (case-insensitive match on type name or description)"),
      kind: z.string().optional().describe("Filter by GraphQL type kind"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ __schema: { types: any[] } }>(Q_SCHEMA_TYPES);
        const keyword = input.keyword.toLowerCase();
        let types = data.__schema.types.filter((t: any) => {
          const nameMatch = t.name?.toLowerCase().includes(keyword);
          const descMatch = t.description?.toLowerCase().includes(keyword);
          return nameMatch || descMatch;
        });
        if (input.kind) {
          const kind = input.kind.toUpperCase();
          types = types.filter((t: any) => t.kind === kind);
        }
        return jsonResult({ count: types.length, types });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
