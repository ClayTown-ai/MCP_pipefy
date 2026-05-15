import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_AI_AUTOMATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateAiAutomation(server: McpServer) {
  server.tool(
    "create_ai_automation",
    "Create an AI automation with a prompt and field IDs for a pipe.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      name: z.string().describe("Automation name"),
      prompt: z.string().describe("AI prompt template"),
      field_ids: z.array(z.string()).describe("Field IDs to include in context"),
      condition: z.record(z.unknown()).optional().describe("Condition configuration"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createAiAutomation: { aiAutomation: any } }>(M_CREATE_AI_AUTOMATION, {
          input: {
            pipe_id: input.pipe_id,
            name: input.name,
            prompt: input.prompt,
            field_ids: input.field_ids,
            ...(input.condition && { condition: input.condition }),
            ...input.extra_input,
          },
        });
        return jsonResult(data.createAiAutomation.aiAutomation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
