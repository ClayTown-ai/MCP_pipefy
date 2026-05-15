import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_AI_AUTOMATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateAiAutomation(server: McpServer) {
  server.tool(
    "update_ai_automation",
    "Update an AI automation's prompt, fields, or condition.",
    {
      id: z.string().describe("AI Automation ID"),
      name: z.string().optional().describe("New name"),
      prompt: z.string().optional().describe("Updated prompt"),
      field_ids: z.array(z.string()).optional().describe("Updated field IDs"),
      condition: z.record(z.unknown()).optional().describe("Updated condition"),
      active: z.boolean().optional().describe("Enable/disable"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const { id, extra_input, ...fields } = input;
        const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
        const data = await pipefyRequest<{ updateAiAutomation: { aiAutomation: any } }>(M_UPDATE_AI_AUTOMATION, {
          input: { id, ...cleanFields, ...extra_input },
        });
        return jsonResult(data.updateAiAutomation.aiAutomation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
