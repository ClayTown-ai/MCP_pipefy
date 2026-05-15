import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_EMAIL_TEMPLATES } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetEmailTemplates(server: McpServer) {
  server.tool(
    "get_email_templates",
    "List email templates for a pipe.",
    {
      pipe_id: z.string().describe("Pipe ID"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ pipe: { id: string; emailTemplates: any[] } }>(Q_EMAIL_TEMPLATES, { pipeId: input.pipe_id });
        return jsonResult(data.pipe.emailTemplates);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
