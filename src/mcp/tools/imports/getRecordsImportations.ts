import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_RECORDS_IMPORTATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetRecordsImportations(server: McpServer) {
  server.tool("get_records_importations", "Check the status of record importation jobs",
    { tableId: z.string(), status: z.array(z.string()).optional() },
    async ({ tableId, status }) => {
      try { const data = await pipefyRequest<{ recordsImportations: any[] }>(Q_RECORDS_IMPORTATIONS, { tableId, status }); return jsonResult(data.recordsImportations); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
