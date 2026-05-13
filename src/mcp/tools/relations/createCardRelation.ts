import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_CARD_RELATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateCardRelation(server: McpServer) {
  server.tool("create_card_relation", "Connect two existing cards/records using a structural relation bridge",
    {
      parentId: z.string().describe("Parent card/record ID"),
      childId: z.string().describe("Child card/record ID"),
      sourceId: z.string().describe("Relation bridge ID (PipeRelation or TableField)"),
      sourceType: z.enum(["PipeRelation", "TableField"]).describe("Type of relation source"),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_CARD_RELATION, { input });
        return jsonResult({ success: true, parentId: input.parentId, childId: input.childId });
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
