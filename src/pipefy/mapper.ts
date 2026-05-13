import { pipefyRequest } from "./client.js";
import { logger } from "../infra/logger.js";
import type { PageInfo, PaginatedResult } from "../core/types.js";

/**
 * Unwraps a Relay connection into a flat list + pagination info.
 */
export function unwrapConnection<T>(
  connection: {
    edges?: Array<{ node: T; cursor: string }>;
    pageInfo?: PageInfo;
    totalCount?: number;
    matchCount?: number;
  } | null | undefined,
): PaginatedResult<T> {
  if (!connection) {
    return { items: [], hasNextPage: false, endCursor: null };
  }
  return {
    items: connection.edges?.map((e) => e.node) ?? [],
    hasNextPage: connection.pageInfo?.hasNextPage ?? false,
    endCursor: connection.pageInfo?.endCursor ?? null,
    totalCount: connection.totalCount ?? connection.matchCount,
  };
}

const MAX_AUTO_PAGES = 20;
const DEFAULT_PAGE_SIZE = 50;

/**
 * Automatically paginates through all pages of a Relay connection.
 * Extracts the connection from the response using `connectionKey`.
 * Caps at MAX_AUTO_PAGES (20) to avoid runaway fetches.
 */
export async function paginateAll<T>(
  query: string,
  baseVariables: Record<string, unknown>,
  connectionKey: string,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<{ items: T[]; totalCount?: number; pagesFetched: number }> {
  const allItems: T[] = [];
  let cursor: string | null = null;
  let totalCount: number | undefined;
  let page = 0;

  while (page < MAX_AUTO_PAGES) {
    page++;
    const variables: Record<string, unknown> = { ...baseVariables, first: pageSize, after: cursor };
    const data: Record<string, any> = await pipefyRequest<Record<string, any>>(query, variables);
    const connection: any = data[connectionKey];
    const result: PaginatedResult<T> = unwrapConnection<T>(connection);

    allItems.push(...result.items);
    totalCount = result.totalCount;

    if (!result.hasNextPage || !result.endCursor) break;
    cursor = result.endCursor;
    logger.debug({ connectionKey, page, fetched: allItems.length, totalCount }, "Auto-pagination page");
  }

  if (page >= MAX_AUTO_PAGES) {
    logger.warn({ connectionKey, fetched: allItems.length, totalCount }, "Auto-pagination hit max pages limit");
  }

  return { items: allItems, totalCount, pagesFetched: page };
}

/**
 * Converts `[{ name, value }]` field arrays into `{ name: value }` objects.
 */
export function normalizeFields(
  fields: Array<{ name: string; value: string | null }> | null | undefined,
): Record<string, string> {
  if (!fields) return {};
  const result: Record<string, string> = {};
  for (const f of fields) {
    result[f.name] = f.value ?? "";
  }
  return result;
}

/**
 * Builds a JSON text response for MCP tool results.
 */
export function jsonResult(data: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    isError,
  };
}

/**
 * Builds an error text response for MCP tool results.
 */
export function errorResult(type: string, message: string) {
  return jsonResult({ error: true, type, message }, true);
}
