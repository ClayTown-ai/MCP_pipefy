import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CLONE_PIPES } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerClonePipes(server: McpServer) {
  server.tool(
    "clone_pipes",
    "Clone pipes from templates into an organization",
    {
      organization_id: z.string().describe("Organization ID"),
      pipe_template_ids: z.array(z.string()).min(1).describe("Template IDs to clone"),
    },
    async ({ organization_id, pipe_template_ids }) => {
      try {
        const data = await pipefyRequest<{ clonePipes: { pipes: any[] } }>(
          M_CLONE_PIPES,
          { input: { organization_id, pipe_template_ids } },
        );
        return jsonResult({ success: true, pipes: data.clonePipes.pipes });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
