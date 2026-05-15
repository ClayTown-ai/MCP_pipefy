import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_AI_AGENT, M_UPDATE_AI_AGENT } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateAiAgent(server: McpServer) {
  server.tool(
    "create_ai_agent",
    "Create an AI agent with instruction and 1-5 behaviors. Creates empty then updates with full config.",
    {
      repo_uuid: z.string().describe("Pipe repo UUID"),
      name: z.string().describe("Agent name"),
      instruction: z.string().describe("Agent instruction prompt"),
      behaviors: z.array(z.object({
        type: z.string().describe("Behavior type"),
        config: z.record(z.unknown()).describe("Behavior configuration"),
      })).min(1).max(5).describe("1-5 behaviors"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const createData = await pipefyRequest<{ createAiAgent: { aiAgent: { uuid: string } } }>(M_CREATE_AI_AGENT, {
          input: { repo_uuid: input.repo_uuid, name: input.name, ...input.extra_input },
        });
        const uuid = createData.createAiAgent.aiAgent.uuid;

        const updateData = await pipefyRequest<{ updateAiAgent: { aiAgent: any } }>(M_UPDATE_AI_AGENT, {
          input: {
            uuid,
            name: input.name,
            instruction: input.instruction,
            behaviors: input.behaviors,
          },
        });
        return jsonResult(updateData.updateAiAgent.aiAgent);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
