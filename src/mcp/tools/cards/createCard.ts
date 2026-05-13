import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_CARD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult, normalizeFields } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateCard(server: McpServer) {
  server.tool(
    "create_card",
    "Create a new card in a pipe. fields_attributes uses [{field_id, field_value: string[]}] format. Schema resolver can convert field names to IDs.",
    {
      pipe_id: z.string().describe("Pipe ID"),
      title: z.string().describe("Card title"),
      phase_id: z.string().optional().describe("Phase ID (defaults to start phase)"),
      fields_attributes: z.array(z.object({
        field_id: z.string(),
        field_value: z.array(z.string()),
      })).optional().describe("Field values as [{field_id, field_value: string[]}]"),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      due_date: z.string().optional().describe("ISO date string"),
      parent_ids: z.array(z.string()).optional().describe("Parent card IDs for relations"),
      attachments: z.array(z.string()).optional().describe("Attachment URLs"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ createCard: { card: any } }>(M_CREATE_CARD, {
          input: {
            pipe_id: input.pipe_id,
            title: input.title,
            ...(input.phase_id && { phase_id: input.phase_id }),
            ...(input.fields_attributes && { fields_attributes: input.fields_attributes }),
            ...(input.assignee_ids && { assignee_ids: input.assignee_ids }),
            ...(input.label_ids && { label_ids: input.label_ids }),
            ...(input.due_date && { due_date: input.due_date }),
            ...(input.parent_ids && { parent_ids: input.parent_ids }),
            ...(input.attachments && { attachments: input.attachments }),
          },
        });
        const c = data.createCard.card;
        return jsonResult({
          id: c.id,
          title: c.title,
          url: c.url,
          current_phase: c.current_phase,
          fields: normalizeFields(c.fields),
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
