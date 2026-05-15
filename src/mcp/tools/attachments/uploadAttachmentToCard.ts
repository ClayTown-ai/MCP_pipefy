import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_PRESIGNED_URL } from "../../../pipefy/mutations.js";
import { M_UPDATE_CARD_FIELD } from "../../../pipefy/mutations.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerUploadAttachmentToCard(server: McpServer) {
  server.tool(
    "upload_attachment_to_card",
    "Upload a file to a card field. Provide file_url (HTTP) or file_content_base64. Uses presigned URL + S3 PUT.",
    {
      organization_id: z.string().describe("Organization ID"),
      card_id: z.string().describe("Card ID"),
      field_id: z.string().describe("Attachment field ID"),
      file_name: z.string().describe("File name with extension"),
      content_type: z.string().optional().default("application/octet-stream").describe("MIME type"),
      file_url: z.string().optional().describe("URL to download the file from"),
      file_content_base64: z.string().optional().describe("Base64-encoded file content"),
    },
    async (input) => {
      try {
        if (!input.file_url && !input.file_content_base64) {
          return errorResult("VALIDATION_ERROR", "Provide either file_url or file_content_base64");
        }

        let fileBuffer: Buffer;
        if (input.file_content_base64) {
          fileBuffer = Buffer.from(input.file_content_base64, "base64");
        } else {
          const res = await fetch(input.file_url!);
          if (!res.ok) return errorResult("DOWNLOAD_ERROR", `Failed to download: ${res.status}`);
          fileBuffer = Buffer.from(await res.arrayBuffer());
        }

        const presigned = await pipefyRequest<{ createPresignedUrl: { url: string; downloadUrl: string } }>(
          M_CREATE_PRESIGNED_URL,
          { input: { organizationId: input.organization_id, fileName: input.file_name, contentType: input.content_type, contentLength: fileBuffer.length } },
        );

        const uploadUrl = presigned.createPresignedUrl.url;
        const host = new URL(uploadUrl).host;
        if (!host.includes("amazonaws.com") && !host.includes("pipefy.com")) {
          return errorResult("SECURITY_ERROR", `Unexpected upload host: ${host}`);
        }

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": input.content_type },
          body: new Uint8Array(fileBuffer),
        });
        if (!uploadRes.ok) {
          return errorResult("UPLOAD_ERROR", `S3 upload failed: ${uploadRes.status}`);
        }

        const storagePath = presigned.createPresignedUrl.downloadUrl;
        await pipefyRequest<any>(M_UPDATE_CARD_FIELD, {
          input: { card_id: input.card_id, field_id: input.field_id, new_value: [storagePath] },
        });

        return jsonResult({ success: true, card_id: input.card_id, field_id: input.field_id, file_name: input.file_name, url: storagePath });
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
