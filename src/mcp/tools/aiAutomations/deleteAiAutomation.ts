import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_AI_AUTOMATION } from "../../../pipefy/mutations.js";
import { Q_AI_AUTOMATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteAiAutomation(server: McpServer) {
  server.tool(
    "delete_ai_automation",
    "Delete an AI automation. Use confirm=false to preview, confirm=true to execute.",
    {
      id: z.string().describe("AI Automation ID"),
      confirm: z.boolean().default(false).describe("Set to true to actually delete"),
    },
    async (input) => {
      try {
        if (!input.confirm) {
          const data = await pipefyRequest<{ aiAutomation: any }>(Q_AI_AUTOMATION, { id: input.id });
          return jsonResult({ preview: true, message: "Set confirm=true to delete", aiAutomation: data.aiAutomation });
        }
        const data = await pipefyRequest<{ deleteAiAutomation: any }>(M_DELETE_AI_AUTOMATION, { input: { id: input.id } });
        return jsonResult({ deleted: true, ...data.deleteAiAutomation });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
