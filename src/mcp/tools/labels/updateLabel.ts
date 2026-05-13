import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_LABEL } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateLabel(server: McpServer) {
  server.tool("update_label", "Update a label's name and/or color",
    { id: z.string(), name: z.string().optional(), color: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_UPDATE_LABEL, { input }); return jsonResult({ success: true, label_id: input.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
