import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_MEMBERS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeMembers(server: McpServer) {
  server.tool(
    "get_pipe_members",
    "Get the members of a pipe with their roles.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipe: { id: string; members: any[] } }>(Q_PIPE_MEMBERS, { pipeId: input.pipe_id });
        return jsonResult(data.pipe.members);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
