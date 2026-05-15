import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_AUTOMATION } from "../../../pipefy/mutations.js";
import { Q_AUTOMATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteAutomation(server: McpServer) {
  server.tool(
    "delete_automation",
    "Delete an automation rule. Use confirm=false to preview, confirm=true to execute.",
    {
      id: z.string().describe("Automation ID"),
      confirm: z.boolean().default(false).describe("Set to true to actually delete"),
    },
    async (input) => {
      try {
        if (!input.confirm) {
          const data = await pipefyRequest<{ automation: any }>(Q_AUTOMATION, { id: input.id });
          return jsonResult({ preview: true, message: "Set confirm=true to delete this automation", automation: data.automation });
        }
        const data = await pipefyRequest<{ deleteAutomation: any }>(M_DELETE_AUTOMATION, { input: { id: input.id } });
        return jsonResult({ deleted: true, ...data.deleteAutomation });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
