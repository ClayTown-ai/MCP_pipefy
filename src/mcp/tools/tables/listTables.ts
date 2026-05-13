import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_TABLES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerListTables(server: McpServer) {
  server.tool(
    "list_tables",
    "List tables by IDs with basic info",
    { ids: z.array(z.string()).min(1).describe("Array of Table IDs") },
    async ({ ids }) => {
      try {
        const data = await pipefyRequest<{ tables: any[] }>(Q_TABLES, { ids });
        return jsonResult(data.tables);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
