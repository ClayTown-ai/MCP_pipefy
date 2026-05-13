import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CARDS_IMPORTATIONS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetCardsImportations(server: McpServer) {
  server.tool("get_cards_importations", "Check the status of card importation jobs",
    { pipeId: z.string(), status: z.array(z.string()).optional() },
    async ({ pipeId, status }) => {
      try { const data = await pipefyRequest<{ cardsImportations: any[] }>(Q_CARDS_IMPORTATIONS, { pipeId, status }); return jsonResult(data.cardsImportations); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
