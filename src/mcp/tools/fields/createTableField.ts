import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_TABLE_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateTableField(server: McpServer) {
  server.tool(
    "create_table_field",
    "Create a field in a database table. Supports connector fields for relations.",
    {
      table_id: z.string().describe("Table ID"),
      label: z.string().describe("Field label"),
      type: z.string().describe("Field type"),
      required: z.boolean().optional(),
      description: z.string().optional(),
      help: z.string().optional(),
      options: z.array(z.string()).optional(),
      minimal_view: z.boolean().optional(),
      custom_validation: z.string().optional(),
      unique: z.boolean().optional().describe("Enforce unique values"),
      connectedRepoId: z.string().optional(),
      canConnectExisting: z.boolean().optional(),
      canConnectMultiples: z.boolean().optional(),
      canCreateNewConnected: z.boolean().optional(),
      allChildrenMustBeDoneToFinishParent: z.boolean().optional(),
      childMustExistToFinishParent: z.boolean().optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_TABLE_FIELD, { input });
        return jsonResult({ success: true, label: input.label, table_id: input.table_id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
