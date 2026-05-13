export type McpErrorType =
  | "PIPEFY_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "DESTRUCTIVE_BLOCKED"
  | "REQUIRED_FIELDS_MISSING"
  | "TIMEOUT";

export interface McpError {
  error: true;
  type: McpErrorType;
  message: string;
}

export function mcpError(type: McpErrorType, message: string): McpError {
  return { error: true, type, message };
}

export function formatGraphQLErrors(errors: Array<{ message: string }>): string {
  return errors.map((e) => e.message).join("; ");
}

export class PipefyApiError extends Error {
  constructor(
    public readonly type: McpErrorType,
    message: string,
  ) {
    super(message);
    this.name = "PipefyApiError";
  }
}
