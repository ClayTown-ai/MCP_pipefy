import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_TABLE_RECORD } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, normalizeFields } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetRecord(server: McpServer) {
  server.tool(
    "get_record",
    "Get a table record by ID with all fields and assignees",
    { id: z.string().describe("Record ID") },
    async ({ id }) => {
      try {
        const data = await pipefyRequest<{ table_record: any }>(Q_TABLE_RECORD, { id });
        const r = data.table_record;
        return jsonResult({
          ...r,
          fields: normalizeFields(r.record_fields),
          record_fields: undefined,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
