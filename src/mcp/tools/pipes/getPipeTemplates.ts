import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PIPE_TEMPLATES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPipeTemplates(server: McpServer) {
  server.tool(
    "get_pipe_templates",
    "List all available pipe templates (id, name, icon, image)",
    {},
    async () => {
      try {
        const data = await pipefyRequest<{ pipe_templates: any[] }>(Q_PIPE_TEMPLATES);
        return jsonResult(data.pipe_templates);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
