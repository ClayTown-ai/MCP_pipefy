import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CARD } from "../../../pipefy/queries.js";
import { M_DELETE_CARD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteCard(server: McpServer) {
  server.tool(
    "delete_card",
    "DESTRUCTIVE: Permanently delete a card. Performs a read query first to confirm the card exists.",
    { id: z.string().describe("Card ID to delete") },
    async ({ id }) => {
      try {
        const check = await pipefyRequest<{ card: { id: string; title: string } }>(
          Q_CARD, { id },
        );
        if (!check.card) return errorResult("NOT_FOUND", `Card ${id} not found`);

        await pipefyRequest(M_DELETE_CARD, { input: { id } });
        return jsonResult({ success: true, deleted_id: id, deleted_title: check.card.title });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
