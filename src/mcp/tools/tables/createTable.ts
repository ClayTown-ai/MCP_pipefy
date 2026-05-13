import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_TABLE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateTable(server: McpServer) {
  server.tool(
    "create_table",
    "Create a new database table in an organization",
    {
      organization_id: z.string().describe("Organization ID"),
      name: z.string().describe("Table name"),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      authorization: z.string().optional().describe("Authorization level"),
      public: z.boolean().optional(),
      labels: z.array(z.object({ name: z.string(), color: z.string() })).optional(),
      members: z.array(z.object({ user_id: z.number(), role_name: z.string() })).optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_TABLE, { input });
        return jsonResult({ success: true, name: input.name });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
