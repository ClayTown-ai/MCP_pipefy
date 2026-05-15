import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutomation(server: McpServer) {
  server.tool(
    "get_automation",
    "Get a single automation rule by ID with trigger, actions, and status.",
    {
      id: z.string().describe("Automation ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ automation: any }>(Q_AUTOMATION, { id: input.id });
        return jsonResult(data.automation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
