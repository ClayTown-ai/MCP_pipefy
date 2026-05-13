import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_PLATFORM_APP_CONFIG } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetPlatformAppConfig(server: McpServer) {
  server.tool("get_platform_app_config", "Get a platform app's configuration for a resource",
    { appSuid: z.string(), resourceType: z.string(), resourceUuid: z.string() },
    async (input) => {
      try { const data = await pipefyRequest<{ platformAppConfiguration: any }>(Q_PLATFORM_APP_CONFIG, input); return jsonResult(data.platformAppConfiguration); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
