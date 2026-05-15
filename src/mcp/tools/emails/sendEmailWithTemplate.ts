import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_SEND_EMAIL_WITH_TEMPLATE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSendEmailWithTemplate(server: McpServer) {
  server.tool(
    "send_email_with_template",
    "Send an email using a pipe email template.",
    {
      card_id: z.string().describe("Card ID for context"),
      template_id: z.string().describe("Email template ID"),
      to: z.array(z.string()).optional().describe("Override recipient emails"),
      extra_input: z.record(z.unknown()).optional().describe("Additional input fields"),
    },
    async (input) => {
      try {
        const data = await pipefyRequest<{ sendEmailWithTemplate: any }>(M_SEND_EMAIL_WITH_TEMPLATE, {
          input: {
            card_id: input.card_id,
            template_id: input.template_id,
            ...(input.to && { to: input.to }),
            ...input.extra_input,
          },
        });
        return jsonResult({ sent: true, ...data.sendEmailWithTemplate });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
