import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_PIPE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdatePipe(server: McpServer) {
  server.tool(
    "update_pipe",
    "Update pipe settings including name, visibility, permissions, expiration, form settings, and more",
    {
      id: z.string().describe("Pipe ID"),
      name: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      anyone_can_create_card: z.boolean().optional(),
      public: z.boolean().optional(),
      only_admin_can_remove_cards: z.boolean().optional(),
      only_assignees_can_edit_cards: z.boolean().optional(),
      noun: z.string().optional(),
      expiration_time_by_unit: z.number().optional(),
      expiration_unit: z.number().optional(),
      public_form: z.boolean().optional(),
      title_field_id: z.number().optional(),
      preferences: z.object({
        findable: z.boolean().optional(),
        inboxEmailEnabled: z.boolean().optional(),
        mainTabViews: z.array(z.string()).optional(),
      }).optional(),
      publicFormSettings: z.record(z.unknown()).optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_PIPE, { input });
        return jsonResult({ success: true, pipe_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
