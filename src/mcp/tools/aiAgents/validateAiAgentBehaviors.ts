import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

const Q_PIPE_FOR_VALIDATION = `query ($pipeId: ID!) { pipe(id: $pipeId) { id phases { id name fields { id label type } } start_form_fields { id label type } labels { id name } } }`;

export function registerValidateAiAgentBehaviors(server: McpServer) {
  server.tool(
    "validate_ai_agent_behaviors",
    "Validate AI agent behaviors against a pipe's structure (fields, phases, relations).",
    {
      pipe_id: z.string().describe("Pipe ID to validate against"),
      behaviors: z.array(z.object({
        type: z.string(),
        config: z.record(z.unknown()),
      })).describe("Behaviors to validate"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipe: any }>(Q_PIPE_FOR_VALIDATION, { pipeId: input.pipe_id });
        const pipe = data.pipe;
        const allFields = new Set<string>();
        const allPhases = new Set<string>();

        pipe.phases?.forEach((p: any) => {
          allPhases.add(p.id);
          p.fields?.forEach((f: any) => allFields.add(f.id));
        });
        pipe.start_form_fields?.forEach((f: any) => allFields.add(f.id));

        const issues: Array<{ behavior_index: number; type: string; issue: string }> = [];

        input.behaviors.forEach((behavior, idx) => {
          const config = behavior.config as Record<string, any>;
          if (config.field_id && !allFields.has(config.field_id)) {
            issues.push({ behavior_index: idx, type: behavior.type, issue: `field_id '${config.field_id}' not found in pipe` });
          }
          if (config.phase_id && !allPhases.has(config.phase_id)) {
            issues.push({ behavior_index: idx, type: behavior.type, issue: `phase_id '${config.phase_id}' not found in pipe` });
          }
          if (config.field_ids) {
            (config.field_ids as string[]).forEach((fid) => {
              if (!allFields.has(fid)) {
                issues.push({ behavior_index: idx, type: behavior.type, issue: `field_id '${fid}' not found in pipe` });
              }
            });
          }
        });

        return jsonResult({
          valid: issues.length === 0,
          issues,
          pipe_summary: {
            phases: pipe.phases?.map((p: any) => ({ id: p.id, name: p.name })),
            total_fields: allFields.size,
          },
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
