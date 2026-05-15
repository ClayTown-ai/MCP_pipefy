import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_AUTOMATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateAutomation(server: McpServer) {
  server.tool(
    "create_automation",
    "Create an automation rule on a pipe with trigger and action.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      name: z.string().describe("Automation name"),
      trigger_id: z.string().describe("Trigger event ID"),
      action_id: z.string().describe("Action type ID"),
      trigger_params: z.record(z.unknown()).optional().describe("Trigger parameters"),
      action_params: z.record(z.unknown()).optional().describe("Action parameters"),
      condition: z.record(z.unknown()).optional().describe("Condition configuration"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createAutomation: { automation: any } }>(M_CREATE_AUTOMATION, {
          input: {
            pipe_id: input.pipe_id,
            name: input.name,
            trigger_id: input.trigger_id,
            action_id: input.action_id,
            ...(input.trigger_params && { trigger_params: input.trigger_params }),
            ...(input.action_params && { action_params: input.action_params }),
            ...(input.condition && { condition: input.condition }),
            ...input.extra_input,
          },
        });
        return jsonResult(data.createAutomation.automation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
