import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_AI_AGENT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateAiAgent(server: McpServer) {
  server.tool(
    "update_ai_agent",
    "Update an AI agent's full configuration (replaces existing config).",
    {
      uuid: z.string().describe("Agent UUID"),
      name: z.string().optional().describe("New name"),
      instruction: z.string().optional().describe("Updated instruction"),
      behaviors: z.array(z.object({
        type: z.string(),
        config: z.record(z.unknown()),
      })).optional().describe("Updated behaviors (replaces all)"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const { uuid, extra_input, ...fields } = input;
        const cleanFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
        const data = await pipefyRequest<{ updateAiAgent: { aiAgent: any } }>(M_UPDATE_AI_AGENT, {
          input: { uuid, ...cleanFields, ...extra_input },
        });
        return jsonResult(data.updateAiAgent.aiAgent);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
