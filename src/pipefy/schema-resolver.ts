import { pipefyRequest } from "./client.js";
import { config } from "../infra/config.js";
import { logger } from "../infra/logger.js";

interface FieldMapping {
  id: string;
  label: string;
  type: string;
}

interface PhaseMapping {
  id: string;
  name: string;
}

interface SchemaCache {
  fieldsByLabel: Map<string, FieldMapping>;
  fieldsById: Map<string, FieldMapping>;
  phasesByName: Map<string, PhaseMapping>;
  phasesById: Map<string, PhaseMapping>;
  expiresAt: number;
}

const cache = new Map<string, SchemaCache>();

const PIPE_SCHEMA_QUERY = `query ($id: ID!) {
  pipe(id: $id) {
    phases { id name fields { id label type } }
    start_form_fields { id label type }
  }
}`;

const TABLE_SCHEMA_QUERY = `query ($id: ID!) {
  table(id: $id) {
    table_fields { id label type }
  }
}`;

async function fetchPipeSchema(pipeId: string): Promise<SchemaCache> {
  const data = await pipefyRequest<{
    pipe: {
      phases: Array<{ id: string; name: string; fields: FieldMapping[] }>;
      start_form_fields: FieldMapping[];
    };
  }>(PIPE_SCHEMA_QUERY, { id: pipeId });

  const schema: SchemaCache = {
    fieldsByLabel: new Map(),
    fieldsById: new Map(),
    phasesByName: new Map(),
    phasesById: new Map(),
    expiresAt: Date.now() + config.cache.ttlMs,
  };

  for (const phase of data.pipe.phases) {
    schema.phasesByName.set(phase.name.toLowerCase(), { id: phase.id, name: phase.name });
    schema.phasesById.set(phase.id, { id: phase.id, name: phase.name });
    for (const f of phase.fields) {
      schema.fieldsByLabel.set(f.label.toLowerCase(), f);
      schema.fieldsById.set(f.id, f);
    }
  }
  for (const f of data.pipe.start_form_fields ?? []) {
    schema.fieldsByLabel.set(f.label.toLowerCase(), f);
    schema.fieldsById.set(f.id, f);
  }

  return schema;
}

async function fetchTableSchema(tableId: string): Promise<SchemaCache> {
  const data = await pipefyRequest<{
    table: { table_fields: FieldMapping[] };
  }>(TABLE_SCHEMA_QUERY, { id: tableId });

  const schema: SchemaCache = {
    fieldsByLabel: new Map(),
    fieldsById: new Map(),
    phasesByName: new Map(),
    phasesById: new Map(),
    expiresAt: Date.now() + config.cache.ttlMs,
  };

  for (const f of data.table.table_fields) {
    schema.fieldsByLabel.set(f.label.toLowerCase(), f);
    schema.fieldsById.set(f.id, f);
  }

  return schema;
}

async function getSchema(repoId: string, type: "pipe" | "table"): Promise<SchemaCache> {
  const key = `${type}:${repoId}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached;

  logger.debug({ repoId, type }, "Fetching schema");
  const schema = type === "pipe"
    ? await fetchPipeSchema(repoId)
    : await fetchTableSchema(repoId);

  cache.set(key, schema);
  return schema;
}

/**
 * Resolves a field name-or-id to an actual field ID.
 * Falls back to using the input as-is if not found (assumes it's already an ID).
 */
export async function resolveFieldId(
  repoId: string,
  nameOrId: string,
  type: "pipe" | "table" = "pipe",
): Promise<string> {
  const schema = await getSchema(repoId, type);
  const byLabel = schema.fieldsByLabel.get(nameOrId.toLowerCase());
  if (byLabel) return byLabel.id;
  if (schema.fieldsById.has(nameOrId)) return nameOrId;
  return nameOrId; // fallback: assume it's an ID
}

/**
 * Resolves a phase name-or-id to an actual phase ID.
 */
export async function resolvePhaseId(
  pipeId: string,
  nameOrId: string,
): Promise<string> {
  const schema = await getSchema(pipeId, "pipe");
  const byName = schema.phasesByName.get(nameOrId.toLowerCase());
  if (byName) return byName.id;
  if (schema.phasesById.has(nameOrId)) return nameOrId;
  return nameOrId;
}

/**
 * Invalidates cached schema for a repo.
 */
export function invalidateSchema(repoId: string, type: "pipe" | "table" = "pipe"): void {
  cache.delete(`${type}:${repoId}`);
}
