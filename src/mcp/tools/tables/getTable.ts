import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_TABLE } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetTable(server: McpServer) {
  server.tool(
    "get_table",
    "Get full table info including all fields, record count, and settings",
    { id: z.string().describe("Table ID") },
    async ({ id }) => {
      try {
        const data = await pipefyRequest<{ table: any }>(Q_TABLE, { id });
        if (!data.table) return errorResult("NOT_FOUND", `Table ${id} not found`);
        return jsonResult(data.table);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
