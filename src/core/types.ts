// Relay pagination types
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface RelayConnection<T> {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: PageInfo;
  totalCount?: number;
  matchCount?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  hasNextPage: boolean;
  endCursor: string | null;
  totalCount?: number;
}

// Field attribute format used by createCard / createTableRecord
export interface FieldAttribute {
  field_id: string;
  field_value: string[];
}

// Normalized card
export interface NormalizedCard {
  id: string;
  title: string;
  url: string;
  done: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  current_phase?: { id: string; name: string };
  fields: Record<string, string | string[]>;
  assignees?: Array<{ id: string; name: string }>;
  labels?: Array<{ id: string; name: string; color: string }>;
}

// Normalized record
export interface NormalizedRecord {
  id: string;
  title: string;
  url: string;
  done: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  fields: Record<string, string | string[]>;
}

// Tool handler result
export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

// Generic GraphQL response
export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string; locations?: unknown; path?: unknown }>;
}
