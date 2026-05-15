import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerExecuteGraphql(server: McpServer) {
  server.tool(
    "execute_graphql",
    "Execute an arbitrary GraphQL query or mutation against the Pipefy API. Detects query/mutation mismatch.",
    {
      document: z.string().describe("The GraphQL document (query or mutation)"),
      variables: z.record(z.unknown()).optional().default({}).describe("Variables for the GraphQL document"),
    },
    async (input) => {
      try {
        const doc = input.document.trim();
        const isMutation = /^\s*mutation\b/i.test(doc);
        const isQuery = /^\s*query\b/i.test(doc) || /^\s*\{/i.test(doc);

        if (!isMutation && !isQuery) {
          return errorResult("VALIDATION_ERROR", "Document must start with 'query', 'mutation', or '{'");
        }

        const hasMutationField = /\b(create|update|delete|move|set|remove|invite|clone|send|export|configure|import)\w*/i.test(doc);
        if (isQuery && !isMutation && hasMutationField) {
          return errorResult(
            "MISMATCH_WARNING",
            "Document declared as 'query' but contains mutation-like field names. Did you mean to use 'mutation'?",
          );
        }

        const data = await pipefyRequest<any>(input.document, input.variables);
        return jsonResult(data);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
