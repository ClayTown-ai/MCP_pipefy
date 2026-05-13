import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_TABLE_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateTableField(server: McpServer) {
  server.tool(
    "update_table_field",
    "Update a table field's properties including connector settings",
    {
      id: z.string().describe("Field ID"),
      table_id: z.string().describe("Table ID"),
      label: z.string().optional(),
      required: z.boolean().optional(),
      description: z.string().optional(),
      help: z.string().optional(),
      options: z.array(z.string()).optional(),
      minimal_view: z.boolean().optional(),
      custom_validation: z.string().optional(),
      unique: z.boolean().optional(),
      canConnectExisting: z.boolean().optional(),
      canConnectMultiples: z.boolean().optional(),
      canCreateNewConnected: z.boolean().optional(),
      allChildrenMustBeDoneToFinishParent: z.boolean().optional(),
      childMustExistToFinishParent: z.boolean().optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_TABLE_FIELD, { input });
        return jsonResult({ success: true, field_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
