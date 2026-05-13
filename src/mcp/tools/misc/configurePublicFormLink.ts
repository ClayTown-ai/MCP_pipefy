import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CONFIGURE_PUBLIC_FORM_LINK } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerConfigurePublicFormLink(server: McpServer) {
  server.tool("configure_public_form_link", "Enable or disable the public form link for a card",
    { cardId: z.string(), enable: z.boolean() },
    async ({ cardId, enable }) => {
      try { const data = await pipefyRequest<{ configurePublicPhaseFormLink: { active: boolean; url: string } }>(M_CONFIGURE_PUBLIC_FORM_LINK, { input: { cardId, enable } }); return jsonResult(data.configurePublicPhaseFormLink); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
