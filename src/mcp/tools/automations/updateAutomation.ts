import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_AUTOMATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateAutomation(server: McpServer) {
  server.tool(
    "update_automation",
    "Update an existing automation rule.",
    {
      id: z.string().describe("Automation ID"),
      name: z.string().optional().describe("New name"),
      active: z.boolean().optional().describe("Enable/disable"),
      trigger_params: z.record(z.unknown()).optional().describe("Updated trigger parameters"),
      action_params: z.record(z.unknown()).optional().describe("Updated action parameters"),
      condition: z.record(z.unknown()).optional().describe("Updated condition"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const { id, extra_input, ...fields } = input;
        const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
        const data = await pipefyRequest<{ updateAutomation: { automation: any } }>(M_UPDATE_AUTOMATION, {
          input: { id, ...cleanFields, ...extra_input },
        });
        return jsonResult(data.updateAutomation.automation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
