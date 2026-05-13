import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_INTERFACE_EMBED_CREATE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerInterfaceEmbedCreate(server: McpServer) {
  server.tool("interface_embed_create", "Create an embeddable interface URL for a user",
    { interfaceUuid: z.string(), userEmail: z.string() },
    async (input) => {
      try { const data = await pipefyRequest<{ interfaceEmbedCreate: any }>(M_INTERFACE_EMBED_CREATE, { input }); return jsonResult(data.interfaceEmbedCreate); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
