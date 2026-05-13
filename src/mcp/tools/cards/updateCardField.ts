import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_CARD_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateCardField(server: McpServer) {
  server.tool(
    "update_card_field",
    "Update a specific form field value on a card. new_value is an ARRAY of strings (Pipefy API requirement).",
    {
      card_id: z.string().describe("Card ID"),
      field_id: z.string().describe("Field ID"),
      new_value: z.array(z.string()).describe("New value as string array"),
    },
    async ({ card_id, field_id, new_value }) => {
      try {
        await pipefyRequest(M_UPDATE_CARD_FIELD, {
          input: { card_id, field_id, new_value },
        });
        return jsonResult({ success: true, card_id, field_id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
