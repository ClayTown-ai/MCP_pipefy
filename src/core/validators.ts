import { z } from "zod";

// Reusable primitives
export const zId = z.string().min(1, "ID is required");
export const zOptionalId = z.string().optional();
export const zIds = z.array(zId).min(1);
export const zPagination = z.object({
  first: z.number().int().positive().max(50).optional(),
  after: z.string().optional(),
});

// field_value is always string[] in Pipefy API
export const zFieldValue = z.array(z.string());

export const zFieldAttribute = z.object({
  field_id: z.string(),
  field_value: zFieldValue,
});

export const zFieldAttributes = z.array(zFieldAttribute).optional();

// Connector field params shared by createPhaseField / createTableField
export const zConnectorParams = z.object({
  connectedRepoId: zOptionalId,
  canConnectExisting: z.boolean().optional(),
  canConnectMultiples: z.boolean().optional(),
  canCreateNewConnected: z.boolean().optional(),
  allChildrenMustBeDoneToFinishParent: z.boolean().optional(),
  allChildrenMustBeDoneToMoveParent: z.boolean().optional(),
  childMustExistToFinishParent: z.boolean().optional(),
  childMustExistToMoveParent: z.boolean().optional(),
});

// CardSearch (for `cards` query)
export const zCardSearch = z.object({
  title: z.string().optional(),
  assignee_ids: z.array(z.string()).optional(),
  label_ids: z.array(z.string()).optional(),
  include_done: z.boolean().optional(),
  ignore_ids: z.array(z.string()).optional(),
  inbox_emails_read: z.boolean().optional(),
  search_strategy: z.string().optional(),
}).optional();

// AdvancedSearch (for `allCards` query) -- recursive AND/OR
export const zAdvancedSearchLeaf = z.object({
  field: z.string().optional(),
  operator: z.string().optional(),
  value: z.string().optional(),
});
// Simplified: we accept the nested structure as-is
export const zAdvancedSearch = z.record(z.unknown()).optional();

// TableRecordSearch
export const zTableRecordSearch = z.object({
  title: z.string().optional(),
  assignee_ids: z.array(z.string()).optional(),
  label_ids: z.array(z.string()).optional(),
  include_done: z.boolean().optional(),
  ignore_ids: z.array(z.string()).optional(),
  orderDirection: z.string().optional(),
  orderField: z.string().optional(),
}).optional();

// FindCards / FindRecords search
export const zFindSearch = z.object({
  fieldId: z.string(),
  fieldValue: z.string(),
});

// PublicFormSettings (shared by updatePipe / updateTable)
export const zPublicFormSettings = z.object({
  afterSubmitMessage: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  brandColor: z.string().optional(),
  description: z.string().optional(),
  displayPipefyLogo: z.boolean().optional(),
  logo: z.string().optional(),
  reuseLastSubmissionResponse: z.boolean().optional(),
  showSubmitAnotherResponseButton: z.boolean().optional(),
  submitButtonText: z.string().optional(),
  submitterEmailCollectionEnabled: z.boolean().optional(),
  submitterEmailCollectionMethod: z.string().optional(),
  submitterEmailFieldId: z.number().optional(),
  title: z.string().optional(),
}).optional();

// OwnFieldMaps for pipe relations
export const zOwnFieldMap = z.object({
  fieldId: z.string(),
  inputMode: z.string().optional(),
  value: z.string().optional(),
});

// Preferences (for createPipe / updatePipe)
export const zPipePreferences = z.object({
  findable: z.boolean().optional(),
  inboxEmailEnabled: z.boolean().optional(),
  mainTabViews: z.array(z.string()).optional(),
}).optional();

// FieldCondition expression/action (complex nested objects)
export const zFieldConditionExpression = z.object({
  field_address: z.string().optional(),
  id: z.number().optional(),
  operation: z.string().optional(),
  structure_id: z.number().optional(),
  value: z.string().optional(),
});

export const zFieldConditionAction = z.object({
  actionId: z.string().optional(),
  id: z.number().optional(),
  phaseFieldId: z.number().optional(),
  phaseId: z.number().optional(),
  whenEvaluator: z.boolean().optional(),
});

// ReferenceConnectorFieldInput (recursive)
export const zReferenceConnectorField: z.ZodType<{
  fieldId?: number;
  fieldUuid?: number;
  nextConnectorField?: unknown;
}> = z.object({
  fieldId: z.number().optional(),
  fieldUuid: z.number().optional(),
  nextConnectorField: z.lazy(() => zReferenceConnectorField).optional(),
});
