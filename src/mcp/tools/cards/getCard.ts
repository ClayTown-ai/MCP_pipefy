import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_CARD } from "../../../pipefy/queries.js";
import { jsonResult, errorResult, normalizeFields } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerGetCard(server: McpServer) {
  server.tool(
    "get_card",
    "Get a Pipefy card by ID with all fields, assignees, labels, current phase, and metadata",
    { id: z.string().describe("Card ID") },
    async ({ id }) => {
      try {
        const data = await pipefyRequest<{ card: any }>(Q_CARD, { id });
        const c = data.card;
        return jsonResult({
          id: c.id,
          title: c.title,
          url: c.url,
          done: c.done,
          due_date: c.due_date,
          created_at: c.createdAt,
          updated_at: c.updated_at,
          expired: c.expired,
          late: c.late,
          overdue: c.overdue,
          current_phase: c.current_phase,
          fields: normalizeFields(c.fields),
          assignees: c.assignees,
          labels: c.labels,
          comments_count: c.comments_count,
          attachments_count: c.attachments_count,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
