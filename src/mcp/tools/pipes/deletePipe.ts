import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE } from "../../../pipefy/queries.js";
import { M_DELETE_PIPE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeletePipe(server: McpServer) {
  server.tool(
    "delete_pipe",
    "DESTRUCTIVE: Permanently delete a pipe and all its cards. Reads the pipe first to confirm.",
    { id: z.string().describe("Pipe ID to delete") },
    async ({ id }) => {
      try {
        const check = await pipefyRequest<{ pipe: { id: string; name: string; cards_count: number } }>(
          `query ($id: ID!) { pipe(id: $id) { id name cards_count } }`, { id },
        );
        if (!check.pipe) return errorResult("NOT_FOUND", `Pipe ${id} not found`);

        await pipefyRequest(M_DELETE_PIPE, { input: { id } });
        return jsonResult({
          success: true,
          deleted_id: id,
          deleted_name: check.pipe.name,
          cards_deleted: check.pipe.cards_count,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
