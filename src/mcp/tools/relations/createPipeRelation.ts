import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PIPE_RELATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreatePipeRelation(server: McpServer) {
  server.tool("create_pipe_relation", "Create a structural relation (bridge) between two pipes with behavior rules",
    {
      parentId: z.string().describe("Parent pipe/table ID"),
      childId: z.string().describe("Child pipe/table ID"),
      name: z.string().describe("Relation name"),
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
        await pipefyRequest(M_CREATE_PIPE_RELATION, { input });
        return jsonResult({ success: true, name: input.name });
      } catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
