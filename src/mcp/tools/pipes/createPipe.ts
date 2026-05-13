import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PIPE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreatePipe(server: McpServer) {
  server.tool(
    "create_pipe",
    "Create a new pipe with optional phases, labels, members, start form fields, and preferences",
    {
      organization_id: z.string().describe("Organization ID"),
      name: z.string().describe("Pipe name"),
      icon: z.string().optional(),
      color: z.string().optional(),
      phases: z.array(z.object({ name: z.string(), done: z.boolean().optional() })).optional(),
      labels: z.array(z.object({ name: z.string(), color: z.string() })).optional(),
      members: z.array(z.object({ user_id: z.number(), role_name: z.string() })).optional(),
      start_form_fields: z.array(z.object({
        label: z.string(),
        type_id: z.number(),
        required: z.boolean().optional(),
        description: z.string().optional(),
        editable: z.boolean().optional(),
        help: z.string().optional(),
        options: z.array(z.string()).optional(),
        sync_with_card: z.boolean().optional(),
      })).optional(),
      preferences: z.object({
        findable: z.boolean().optional(),
        inboxEmailEnabled: z.boolean().optional(),
        mainTabViews: z.array(z.string()).optional(),
      }).optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_CREATE_PIPE, { input });
        return jsonResult({ success: true, name: input.name });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
