import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CONNECTED_TABLE_RECORDS } from "../../../pipefy/queries.js";
import { unwrapConnection, normalizeFields, jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetConnectedRecords(server: McpServer) {
  server.tool(
    "get_connected_records",
    "Get table records connected through a connector field",
    {
      tableId: z.string().describe("Table ID"),
      throughConnectors: z.record(z.unknown()).describe("ReferenceConnectorFieldInput object"),
      first: z.number().int().positive().max(50).optional(),
      after: z.string().optional(),
    },
    async ({ tableId, throughConnectors, first, after }) => {
      try {
        const data = await pipefyRequest<{ connectedTableRecords: any }>(
          Q_CONNECTED_TABLE_RECORDS,
          { tableId, throughConnectors, first: first ?? 30, after },
        );
        const result = unwrapConnection(data.connectedTableRecords);
        return jsonResult({
          records: result.items.map((r: any) => ({ ...r, fields: normalizeFields(r.record_fields), record_fields: undefined })),
          hasNextPage: result.hasNextPage, endCursor: result.endCursor, totalCount: result.totalCount,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
