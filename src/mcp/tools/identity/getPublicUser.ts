import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PUBLIC_USER } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPublicUser(server: McpServer) {
  server.tool("get_public_user", "Get basic public user data (id, email, uuid, role)", {},
    async () => {
      try { const data = await pipefyRequest<{ publicUser: any }>(Q_PUBLIC_USER); return jsonResult(data.publicUser); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
