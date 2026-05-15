import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PHASE_FIELDS } from "../../../pipefy/queries.js";
import { M_UPDATE_FIELDS_VALUES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerFillCardPhaseFields(server: McpServer) {
  server.tool(
    "fill_card_phase_fields",
    "Fill phase-specific fields on a card. Fetches the phase's editable fields, filters the provided values to valid field IDs only, and applies them in a single batch update. Call get_phase_fields first to discover field IDs and types.",
    {
      card_id: z.string().describe("Card ID to update"),
      phase_id: z.string().describe("Phase ID whose fields to fill"),
      fields: z
        .record(z.union([z.string(), z.array(z.string())]))
        .describe("Map of field_id → value (string or string array). Only IDs matching editable phase fields are sent."),
    },
    async ({ card_id, phase_id, fields }) => {
      try {
        const phaseData = await pipefyRequest<{ phase: { id: string; name: string; fields: Array<{ id: string; label: string; type: string }> } }>(
          Q_PHASE_FIELDS,
          { phaseId: phase_id },
        );
        if (!phaseData.phase) return errorResult("NOT_FOUND", `Phase ${phase_id} not found`);

        const editableIds = new Set(phaseData.phase.fields.map((f) => f.id));
        const values: Array<{ fieldId: string; value: string[] }> = [];
        const skipped: string[] = [];

        for (const [fieldId, rawValue] of Object.entries(fields)) {
          if (!editableIds.has(fieldId)) {
            skipped.push(fieldId);
            continue;
          }
          const value = Array.isArray(rawValue) ? rawValue : [rawValue];
          values.push({ fieldId, value });
        }

        if (values.length === 0) {
          return jsonResult({
            success: false,
            message: "No matching editable field IDs found for this phase",
            skipped_field_ids: skipped,
            available_fields: phaseData.phase.fields.map((f) => ({ id: f.id, label: f.label, type: f.type })),
          });
        }

        await pipefyRequest(M_UPDATE_FIELDS_VALUES, {
          input: { nodeId: card_id, values },
        });

        return jsonResult({
          success: true,
          card_id,
          phase_id,
          fields_updated: values.map((v) => v.fieldId),
          skipped_field_ids: skipped.length > 0 ? skipped : undefined,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
