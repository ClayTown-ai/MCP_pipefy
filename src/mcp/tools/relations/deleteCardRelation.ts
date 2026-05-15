import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_DELETE_CARD_RELATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerDeleteCardRelation(server: McpServer) {
  server.tool(
    "delete_card_relation",
    "Delete a card relation (parent/child link).",
    {
      id: z.string().describe("Card relation ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ deleteCardRelation: any }>(M_DELETE_CARD_RELATION, { input: { id: input.id } });
        return jsonResult({ deleted: true, ...data.deleteCardRelation });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
