import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_TABLE_RECORD_RESTRICTED } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateRestrictedRecord(server: McpServer) {
  server.tool(
    "create_restricted_record",
    "Create a record in a restricted table using a connector context (throughConnectors)",
    {
      tableId: z.string().describe("Table ID"),
      fieldsAttributes: z.array(z.object({
        field_id: z.string(),
        field_value: z.array(z.string()),
      })).optional(),
      throughConnectors: z.record(z.unknown()).describe("ReferenceConnectorFieldInput"),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_TABLE_RECORD_RESTRICTED, { input });
        return jsonResult({ success: true, tableId: input.tableId });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
