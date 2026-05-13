import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_TABLE_RECORD_FIELD_VALUE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetRecordField(server: McpServer) {
  server.tool(
    "set_record_field",
    "Set a specific field value on a table record. value is an ARRAY of strings (API requirement).",
    {
      table_record_id: z.string().describe("Record ID"),
      field_id: z.string().describe("Field ID"),
      value: z.array(z.string()).describe("Value as string array"),
    },
    async ({ table_record_id, field_id, value }) => {
      try {
        await pipefyRequest(M_SET_TABLE_RECORD_FIELD_VALUE, {
          input: { table_record_id, field_id, value },
        });
        return jsonResult({ success: true, record_id: table_record_id, field_id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
