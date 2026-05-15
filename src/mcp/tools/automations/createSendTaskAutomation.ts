import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_AUTOMATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateSendTaskAutomation(server: McpServer) {
  server.tool(
    "create_send_task_automation",
    "Shortcut to create an automation that sends a task (card) to another pipe when triggered.",
    {
      pipe_id: z.string().describe("Source pipe ID"),
      name: z.string().describe("Automation name"),
      trigger_id: z.string().describe("Trigger event ID"),
      target_pipe_id: z.string().describe("Target pipe ID to send the task to"),
      trigger_params: z.record(z.unknown()).optional().describe("Trigger parameters"),
      field_mappings: z.array(z.object({
        source_field_id: z.string(),
        target_field_id: z.string(),
      })).optional().describe("Field mappings from source to target"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createAutomation: { automation: any } }>(M_CREATE_AUTOMATION, {
          input: {
            pipe_id: input.pipe_id,
            name: input.name,
            trigger_id: input.trigger_id,
            action_id: "send_task",
            action_params: {
              target_pipe_id: input.target_pipe_id,
              ...(input.field_mappings && { field_mappings: input.field_mappings }),
            },
            ...(input.trigger_params && { trigger_params: input.trigger_params }),
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
