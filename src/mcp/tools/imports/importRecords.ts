import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_RECORDS_IMPORTER } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerImportRecords(server: McpServer) {
  server.tool("import_records", "Import records from a CSV/spreadsheet URL into a table",
    {
      tableId: z.string(), url: z.string(),
      fieldValuesColumns: z.array(z.object({ column: z.string(), fieldId: z.string() })),
      statusColumn: z.string().optional(),
    },
    async (input) => {
      try { await pipefyRequest(M_RECORDS_IMPORTER, { input }); return jsonResult({ success: true }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
