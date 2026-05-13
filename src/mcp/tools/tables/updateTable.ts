import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_UPDATE_TABLE } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUpdateTable(server: McpServer) {
  server.tool(
    "update_table",
    "Update table settings including name, visibility, form settings, and more",
    {
      id: z.string().describe("Table ID"),
      name: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
      authorization: z.string().optional(),
      public: z.boolean().optional(),
      noun: z.string().optional(),
      create_record_button_label: z.string().optional(),
      title_field_id: z.number().optional(),
      summary_attributes: z.array(z.number()).optional(),
      public_form: z.boolean().optional(),
      publicFormSettings: z.record(z.unknown()).optional(),
    },
    async (input) => {
      try {
        await pipefyRequest(M_UPDATE_TABLE, { input });
        return jsonResult({ success: true, table_id: input.id });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
