import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CARD_RELATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetCardRelations(server: McpServer) {
  server.tool(
    "get_card_relations",
    "Get parent and child relations of a card.",
    {
      card_id: z.string().describe("Card ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ card: any }>(Q_CARD_RELATIONS, { cardId: input.card_id });
        return jsonResult({
          card_id: data.card.id,
          parent_relations: data.card.parent_relations,
          child_relations: data.card.child_relations,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
