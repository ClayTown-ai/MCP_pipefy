import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CONDITIONAL_FIELD } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetConditionalField(server: McpServer) {
  server.tool("get_conditional_field", "Get which fields should be hidden based on conditions for a card",
    { repoId: z.string().describe("Pipe/Table ID"), cardId: z.string().describe("Card ID") },
    async ({ repoId, cardId }) => {
      try { const data = await pipefyRequest<{ conditionalField: any }>(Q_CONDITIONAL_FIELD, { repoId, cardId }); return jsonResult(data.conditionalField); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
