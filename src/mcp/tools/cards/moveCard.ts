import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_MOVE_CARD_TO_PHASE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerMoveCard(server: McpServer) {
  server.tool(
    "move_card",
    "Move a card to a different phase. Will fail if destination phase has required fields that are empty.",
    {
      card_id: z.string().describe("Card ID"),
      destination_phase_id: z.string().describe("Target phase ID"),
    },
    async ({ card_id, destination_phase_id }) => {
      try {
        await pipefyRequest(M_MOVE_CARD_TO_PHASE, {
          input: { card_id, destination_phase_id },
        });
        return jsonResult({ success: true, card_id, destination_phase_id });
      } catch (e) {
        if (e instanceof PipefyApiError) {
          if (e.message.toLowerCase().includes("required")) {
            return errorResult("REQUIRED_FIELDS_MISSING", e.message);
          }
          return errorResult(e.type, e.message);
        }
        throw e;
      }
    },
  );
}
