import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_CARD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateCard(server: McpServer) {
  server.tool(
    "update_card",
    "Update card metadata (title, assignees, labels, due_date). Use update_card_field for form field values.",
    {
      id: z.string().describe("Card ID"),
      title: z.string().optional(),
      assignee_ids: z.array(z.string()).optional(),
      label_ids: z.array(z.string()).optional(),
      due_date: z.string().optional().describe("ISO date string"),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_CARD, { input });
        return jsonResult({ success: true, card_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
