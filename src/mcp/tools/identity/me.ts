import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_ME } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerMe(server: McpServer) {
  server.tool("me", "Get the authenticated user's info (id, name, email, locale, timezone, role)", {},
    async () => {
      try { const data = await pipefyRequest<{ me: any }>(Q_ME); return jsonResult(data.me); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
