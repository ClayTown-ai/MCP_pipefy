import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_AI_AGENT } from "../../../pipefy/mutations.js";
import { Q_AI_AGENT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteAiAgent(server: McpServer) {
  server.tool(
    "delete_ai_agent",
    "Delete an AI agent. Use confirm=false to preview, confirm=true to execute.",
    {
      uuid: z.string().describe("Agent UUID"),
      confirm: z.boolean().default(false).describe("Set to true to actually delete"),
    },
    async (input) => {
      try {
        if (!input.confirm) {
          const data = await pipefyRequest<{ aiAgent: any }>(Q_AI_AGENT, { uuid: input.uuid });
          return jsonResult({ preview: true, message: "Set confirm=true to delete", aiAgent: data.aiAgent });
        }
        const data = await pipefyRequest<{ deleteAiAgent: any }>(M_DELETE_AI_AGENT, { uuid: input.uuid });
        return jsonResult({ deleted: true, ...data.deleteAiAgent });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
