import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_REPO_ITEM_FORM } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetRepoItemForm(server: McpServer) {
  server.tool("get_repo_item_form", "Get the form configuration for a pipe or table",
    { repoId: z.string(), throughConnectors: z.record(z.unknown()).optional() },
    async ({ repoId, throughConnectors }) => {
      try { const data = await pipefyRequest<{ repoItemForm: any }>(Q_REPO_ITEM_FORM, { repoId, throughConnectors }); return jsonResult(data.repoItemForm); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
