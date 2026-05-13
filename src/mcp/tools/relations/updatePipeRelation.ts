import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_PIPE_RELATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdatePipeRelation(server: McpServer) {
  server.tool("update_pipe_relation", "Update a pipe relation's behavior rules",
    {
      id: z.string().describe("Relation ID"),
      name: z.string().optional(),
      autoFillFieldEnabled: z.boolean().optional(),
      canConnectExistingItems: z.boolean().optional(),
      canConnectMultipleItems: z.boolean().optional(),
      canCreateNewItems: z.boolean().optional(),
      allChildrenMustBeDoneToFinishParent: z.boolean().optional(),
      allChildrenMustBeDoneToMoveParent: z.boolean().optional(),
      childMustExistToFinishParent: z.boolean().optional(),
      childMustExistToMoveParent: z.boolean().optional(),
      ownFieldMaps: z.array(z.object({ fieldId: z.string(), inputMode: z.string().optional(), value: z.string().optional() })).optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_PIPE_RELATION, { input });
        return jsonResult({ success: true, relation_id: input.id });
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
