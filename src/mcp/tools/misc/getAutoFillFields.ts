import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTO_FILL_FIELDS } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetAutoFillFields(server: McpServer) {
  server.tool("get_auto_fill_fields", "Get auto-fill field values from a parent card through a connector",
    {
      connectorId: z.string(), connectorType: z.string(), parentCardId: z.string(),
      overrideFieldValue: z.array(z.object({ fieldId: z.string(), fieldValue: z.array(z.string()) })).optional(),
    },
    async ({ connectorId, connectorType, parentCardId, overrideFieldValue }) => {
      try { const data = await pipefyRequest<{ autoFillFields: any }>(Q_AUTO_FILL_FIELDS, { connectorId, connectorType, parentCardId, overrideFieldValue }); return jsonResult(data.autoFillFields); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
