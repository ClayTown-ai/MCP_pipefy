import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SET_FAVORITE_PIPES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSetFavoritePipes(server: McpServer) {
  server.tool(
    "set_favorite_pipes",
    "Set which pipes are favorites for the authenticated user",
    { pipeIds: z.array(z.string()).describe("Pipe IDs to set as favorites") },
    async ({ pipeIds }) => {
      try {
        await pipefyRequest(M_SET_FAVORITE_PIPES, { input: { pipeIds } });
        return jsonResult({ success: true });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
