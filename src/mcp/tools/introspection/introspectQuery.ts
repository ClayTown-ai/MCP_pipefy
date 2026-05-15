import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_INTROSPECT_QUERY_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerIntrospectQuery(server: McpServer) {
  server.tool(
    "introspect_query",
    "Introspect a specific GraphQL query by name. Returns its arguments and return type.",
    {
      query_name: z.string().describe("The query name to introspect"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ __type: { fields: any[] } }>(Q_INTROSPECT_QUERY_FIELDS);
        const field = data.__type?.fields?.find((f: any) => f.name === input.query_name);
        if (!field) return jsonResult({ error: true, message: `Query '${input.query_name}' not found` }, true);
        return jsonResult(field);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
