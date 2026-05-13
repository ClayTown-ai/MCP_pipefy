import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PHASE_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreatePhaseField(server: McpServer) {
  server.tool(
    "create_phase_field",
    "Create a field in a phase. Supports connector fields for relations. Types: short_text, long_text, number, date, datetime, email, phone, select, radio, checklist, attachment, connector, etc.",
    {
      phase_id: z.string().describe("Phase ID"),
      label: z.string().describe("Field label"),
      type: z.string().describe("Field type (short_text, number, date, select, connector, etc.)"),
      required: z.boolean().optional(),
      description: z.string().optional(),
      help: z.string().optional(),
      options: z.array(z.string()).optional().describe("Options for select/radio/checklist"),
      editable: z.boolean().optional(),
      minimal_view: z.boolean().optional(),
      index: z.string().optional(),
      sync_with_card: z.boolean().optional(),
      custom_validation: z.string().optional(),
      connectedRepoId: z.string().optional().describe("Connected pipe/table ID for connector fields"),
      canConnectExisting: z.boolean().optional(),
      canConnectMultiples: z.boolean().optional(),
      canCreateNewConnected: z.boolean().optional(),
      allChildrenMustBeDoneToFinishParent: z.boolean().optional(),
      allChildrenMustBeDoneToMoveParent: z.boolean().optional(),
      childMustExistToFinishParent: z.boolean().optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_PHASE_FIELD, { input });
        return jsonResult({ success: true, label: input.label, phase_id: input.phase_id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
