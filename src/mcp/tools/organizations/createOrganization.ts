import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_ORGANIZATION } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerCreateOrganization(server: McpServer) {
  server.tool("create_organization", "Create a new organization",
    { name: z.string(), industry: z.string().optional() },
    async (input) => {
      try { await pipefyRequest(M_CREATE_ORGANIZATION, { input }); return jsonResult({ success: true, name: input.name }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
