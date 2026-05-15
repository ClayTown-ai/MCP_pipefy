import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_INTROSPECT_TYPE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

const SCALAR_TYPES = new Set(["ID", "String", "Int", "Float", "Boolean", "DateTime"]);

async function resolveType(typeName: string, depth: number, maxDepth: number, visited: Set<string>): Promise<any> {
  if (depth > maxDepth || visited.has(typeName) || SCALAR_TYPES.has(typeName)) return null;
  visited.add(typeName);

  const data = await pipefyRequest<{ __type: any }>(Q_INTROSPECT_TYPE, { typeName });
  const t = data.__type;
  if (!t) return null;

  if (depth < maxDepth && t.fields) {
    for (const field of t.fields) {
      const refType = extractTypeName(field.type);
      if (refType && !SCALAR_TYPES.has(refType) && !visited.has(refType)) {
        field._resolvedType = await resolveType(refType, depth + 1, maxDepth, visited);
      }
    }
  }
  return t;
}

function extractTypeName(type: any): string | null {
  if (!type) return null;
  if (type.name && type.kind !== "NON_NULL" && type.kind !== "LIST") return type.name;
  return extractTypeName(type.ofType);
}

export function registerIntrospectType(server: McpServer) {
  server.tool(
    "introspect_type",
    "Introspect a GraphQL type by name. Returns fields, inputFields, enumValues. Use max_depth > 1 to resolve referenced types recursively.",
    {
      type_name: z.string().describe("The GraphQL type name to introspect"),
      max_depth: z.number().optional().default(1).describe("How deep to resolve referenced types (default 1)"),
    },
    async (input) => {
      try {
        const result = await resolveType(input.type_name, 1, input.max_depth, new Set());
        if (!result) return jsonResult({ error: true, message: `Type '${input.type_name}' not found` }, true);
        return jsonResult(result);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
