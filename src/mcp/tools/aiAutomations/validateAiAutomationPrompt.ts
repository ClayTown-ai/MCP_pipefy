import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PHASE_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerValidateAiAutomationPrompt(server: McpServer) {
  server.tool(
    "validate_ai_automation_prompt",
    "Pre-flight validation: checks that field_ids exist and prompt tokens reference valid fields.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      phase_id: z.string().describe("Phase ID to validate fields against"),
      prompt: z.string().describe("Prompt template with {{field_id}} tokens"),
      field_ids: z.array(z.string()).describe("Field IDs to validate"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ phase: { fields: Array<{ id: string; label: string }> } }>(
          Q_PHASE_FIELDS, { phaseId: input.phase_id },
        );
        const availableFields = data.phase.fields;
        const availableIds = new Set(availableFields.map((f) => f.id));

        const invalidFieldIds = input.field_ids.filter((id) => !availableIds.has(id));

        const tokenRegex = /\{\{(\w+)\}\}/g;
        const tokens: string[] = [];
        let match;
        while ((match = tokenRegex.exec(input.prompt)) !== null) {
          tokens.push(match[1]);
        }
        const invalidTokens = tokens.filter((t) => !availableIds.has(t));

        const valid = invalidFieldIds.length === 0 && invalidTokens.length === 0;

        return jsonResult({
          valid,
          ...(invalidFieldIds.length > 0 && { invalid_field_ids: invalidFieldIds }),
          ...(invalidTokens.length > 0 && { invalid_prompt_tokens: invalidTokens }),
          available_fields: availableFields,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
