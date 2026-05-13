import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_FIELD_CONDITION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetFieldCondition(server: McpServer) {
  server.tool("get_field_condition", "Get a field condition and check if it's true for a specific card",
    { id: z.string().describe("Field condition ID"), cardId: z.string().describe("Card ID to evaluate against") },
    async ({ id, cardId }) => {
      try { const data = await pipefyRequest<{ fieldCondition: any }>(Q_FIELD_CONDITION, { id, cardId }); return jsonResult(data.fieldCondition); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
