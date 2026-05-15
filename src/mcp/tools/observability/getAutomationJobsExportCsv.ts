import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { Q_AUTOMATION_JOBS_EXPORT } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";
import * as XLSX from "xlsx";

const MAX_OUTPUT_CHARS = 400_000;
const MAX_DOWNLOAD_BYTES = 50 * 1024 * 1024; // 50 MiB
const ALLOWED_HOSTS = [".pipefy.com", ".amazonaws.com"];

function isAllowedHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_HOSTS.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
}

export function registerGetAutomationJobsExportCsv(server: McpServer) {
  server.tool(
    "get_automation_jobs_export_csv",
    "Download a finished automation jobs export (.xlsx), convert the first worksheet to CSV text, and return it. The export must be in 'finished' state (use get_automation_jobs_export to check). Only downloads from Pipefy/AWS signed URLs.",
    {
      export_id: z.string().describe("Export ID (from export_automation_jobs)"),
      max_output_chars: z
        .number()
        .int()
        .min(256)
        .max(2_000_000)
        .optional()
        .default(MAX_OUTPUT_CHARS)
        .describe("Max characters of CSV output to return"),
      max_download_bytes: z
        .number()
        .int()
        .min(4096)
        .max(80 * 1024 * 1024)
        .optional()
        .default(MAX_DOWNLOAD_BYTES)
        .describe("Max download size in bytes"),
    },
    async ({ export_id, max_output_chars, max_download_bytes }) => {
      try {
        const data = await pipefyRequest<{ automationJobsExport: { id: string; state: string; fileURL?: string } }>(
          Q_AUTOMATION_JOBS_EXPORT,
          { id: export_id },
        );

        const exp = data.automationJobsExport;
        if (!exp) return errorResult("NOT_FOUND", `Export ${export_id} not found`);

        if (exp.state !== "finished") {
          return errorResult("NOT_READY", `Export state is '${exp.state}', not 'finished'. Poll with get_automation_jobs_export until finished.`);
        }

        if (!exp.fileURL) {
          return errorResult("NO_URL", "Export is finished but fileURL is empty");
        }

        if (!isAllowedHost(exp.fileURL)) {
          return errorResult("BLOCKED_HOST", `Download URL host is not in the allowlist: ${new URL(exp.fileURL).hostname}`);
        }

        const res = await fetch(exp.fileURL);
        if (!res.ok) {
          return errorResult("DOWNLOAD_FAILED", `HTTP ${res.status} downloading export file`);
        }

        const contentLength = Number(res.headers.get("content-length") || 0);
        if (contentLength > max_download_bytes) {
          return errorResult("FILE_TOO_LARGE", `File size ${contentLength} bytes exceeds limit of ${max_download_bytes} bytes`);
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > max_download_bytes) {
          return errorResult("FILE_TOO_LARGE", `Downloaded ${buffer.length} bytes exceeds limit of ${max_download_bytes} bytes`);
        }

        const workbook = XLSX.read(buffer, { type: "buffer" });
        const firstSheet = workbook.SheetNames[0];
        if (!firstSheet) {
          return errorResult("EMPTY_WORKBOOK", "The exported file has no worksheets");
        }

        let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheet]);

        let truncated = false;
        if (csv.length > max_output_chars) {
          csv = csv.slice(0, max_output_chars);
          truncated = true;
        }

        return jsonResult({
          export_id,
          sheet_name: firstSheet,
          total_sheets: workbook.SheetNames.length,
          csv_chars: csv.length,
          truncated,
          csv,
        });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
