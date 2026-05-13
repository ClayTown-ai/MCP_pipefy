import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_LABEL } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateLabel(server: McpServer) {
  server.tool("create_label", "Create a label for a pipe or table",
    { name: z.string(), color: z.string(), pipe_id: z.string().optional(), table_id: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_CREATE_LABEL, { input }); return jsonResult({ success: true, name: input.name }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
