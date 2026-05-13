import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CARDS_IMPORTER } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerImportCards(server: McpServer) {
  server.tool("import_cards", "Import cards from a CSV/spreadsheet URL into a pipe",
    {
      pipeId: z.string(), url: z.string().describe("URL to CSV file"),
      fieldValuesColumns: z.array(z.object({ column: z.string(), fieldId: z.string() })),
      assigneesColumn: z.string().optional(), labelsColumn: z.string().optional(),
      currentPhaseColumn: z.string().optional(), dueDateColumn: z.string().optional(),
    },
    async (input) => {
      try { const data = await pipefyRequest<{ cardsImporter: { cardsImportation: { id: string } } }>(M_CARDS_IMPORTER, { input }); return jsonResult({ success: true, importation_id: data.cardsImporter.cardsImportation.id }); }
      catch (e) { if (e instanceof PipefyApiError) return errorResult(e.type, e.message); throw e; }
    });
}
