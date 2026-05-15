import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_INTROSPECT_MUTATION_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerIntrospectMutation(server: McpServer) {
  server.tool(
    "introspect_mutation",
    "Introspect a specific GraphQL mutation by name. Returns its arguments and return type.",
    {
      mutation_name: z.string().describe("The mutation name to introspect"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ __type: { fields: any[] } }>(Q_INTROSPECT_MUTATION_FIELDS);
        const field = data.__type?.fields?.find((f: any) => f.name === input.mutation_name);
        if (!field) return jsonResult({ error: true, message: `Mutation '${input.mutation_name}' not found` }, true);
        return jsonResult(field);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
