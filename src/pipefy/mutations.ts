// All 71 Pipefy GraphQL mutations

// --- Cards ---
export const M_CREATE_CARD = `mutation ($input: CreateCardInput!) { createCard(input: $input) { card { id title url done due_date createdAt current_phase { id name } fields { name value } } } }`;

export const M_UPDATE_CARD = `mutation ($input: UpdateCardInput!) { updateCard(input: $input) { clientMutationId } }`;

export const M_UPDATE_CARD_FIELD = `mutation ($input: UpdateCardFieldInput!) { updateCardField(input: $input) { clientMutationId success } }`;

export const M_MOVE_CARD_TO_PHASE = `mutation ($input: MoveCardToPhaseInput!) { moveCardToPhase(input: $input) { clientMutationId } }`;

export const M_DELETE_CARD = `mutation ($input: DeleteCardInput!) { deleteCard(input: $input) { clientMutationId success } }`;

// --- Pipes ---
export const M_CREATE_PIPE = `mutation ($input: CreatePipeInput!) { createPipe(input: $input) { clientMutationId } }`;

export const M_UPDATE_PIPE = `mutation ($input: UpdatePipeInput!) { updatePipe(input: $input) { clientMutationId } }`;

export const M_DELETE_PIPE = `mutation ($input: DeletePipeInput!) { deletePipe(input: $input) { clientMutationId success } }`;

export const M_CLONE_PIPES = `mutation ($input: ClonePipesInput!) { clonePipes(input: $input) { pipes { id name } } }`;

// --- Phases ---
export const M_CREATE_PHASE = `mutation ($input: CreatePhaseInput!) { createPhase(input: $input) { clientMutationId } }`;

export const M_UPDATE_PHASE = `mutation ($input: UpdatePhaseInput!) { updatePhase(input: $input) { clientMutationId } }`;

export const M_DELETE_PHASE = `mutation ($input: DeletePhaseInput!) { deletePhase(input: $input) { clientMutationId success } }`;

// --- Phase Fields ---
export const M_CREATE_PHASE_FIELD = `mutation ($input: CreatePhaseFieldInput!) { createPhaseField(input: $input) { clientMutationId } }`;

export const M_UPDATE_PHASE_FIELD = `mutation ($input: UpdatePhaseFieldInput!) { updatePhaseField(input: $input) { clientMutationId } }`;

export const M_DELETE_PHASE_FIELD = `mutation ($input: DeletePhaseFieldInput!) { deletePhaseField(input: $input) { clientMutationId success } }`;

// --- Tables ---
export const M_CREATE_TABLE = `mutation ($input: CreateTableInput!) { createTable(input: $input) { clientMutationId } }`;

export const M_UPDATE_TABLE = `mutation ($input: UpdateTableInput!) { updateTable(input: $input) { clientMutationId } }`;

export const M_DELETE_TABLE = `mutation ($input: DeleteTableInput!) { deleteTable(input: $input) { clientMutationId success } }`;

// --- Table Fields ---
export const M_CREATE_TABLE_FIELD = `mutation ($input: CreateTableFieldInput!) { createTableField(input: $input) { clientMutationId } }`;

export const M_UPDATE_TABLE_FIELD = `mutation ($input: UpdateTableFieldInput!) { updateTableField(input: $input) { clientMutationId } }`;

export const M_DELETE_TABLE_FIELD = `mutation ($input: DeleteTableFieldInput!) { deleteTableField(input: $input) { clientMutationId success } }`;

// --- Table Records ---
export const M_CREATE_TABLE_RECORD = `mutation ($input: CreateTableRecordInput!) { createTableRecord(input: $input) { clientMutationId } }`;

export const M_CREATE_TABLE_RECORD_RESTRICTED = `mutation ($input: CreateTableRecordInRestrictedTableInput!) { createTableRecordInRestrictedTable(input: $input) { clientMutationId } }`;

export const M_UPDATE_TABLE_RECORD = `mutation ($input: UpdateTableRecordInput!) { updateTableRecord(input: $input) { clientMutationId } }`;

export const M_DELETE_TABLE_RECORD = `mutation ($input: DeleteTableRecordInput!) { deleteTableRecord(input: $input) { clientMutationId success } }`;

export const M_SET_TABLE_RECORD_FIELD_VALUE = `mutation ($input: SetTableRecordFieldValueInput!) { setTableRecordFieldValue(input: $input) { clientMutationId } }`;

// --- Relations ---
export const M_CREATE_PIPE_RELATION = `mutation ($input: CreatePipeRelationInput!) { createPipeRelation(input: $input) { clientMutationId } }`;

export const M_UPDATE_PIPE_RELATION = `mutation ($input: UpdatePipeRelationInput!) { updatePipeRelation(input: $input) { clientMutationId } }`;

export const M_DELETE_PIPE_RELATION = `mutation ($input: DeletePipeRelationInput!) { deletePipeRelation(input: $input) { clientMutationId success } }`;

export const M_CREATE_CARD_RELATION = `mutation ($input: CreateCardRelationInput!) { createCardRelation(input: $input) { clientMutationId } }`;

// --- Labels ---
export const M_CREATE_LABEL = `mutation ($input: CreateLabelInput!) { createLabel(input: $input) { clientMutationId } }`;

export const M_UPDATE_LABEL = `mutation ($input: UpdateLabelInput!) { updateLabel(input: $input) { clientMutationId } }`;

export const M_DELETE_LABEL = `mutation ($input: DeleteLabelInput!) { deleteLabel(input: $input) { clientMutationId success } }`;

// --- Comments ---
export const M_CREATE_COMMENT = `mutation ($input: CreateCommentInput!) { createComment(input: $input) { clientMutationId } }`;

export const M_UPDATE_COMMENT = `mutation ($input: UpdateCommentInput!) { updateComment(input: $input) { clientMutationId } }`;

export const M_DELETE_COMMENT = `mutation ($input: DeleteCommentInput!) { deleteComment(input: $input) { clientMutationId success } }`;

// --- Webhooks ---
export const M_CREATE_WEBHOOK = `mutation ($input: CreateWebhookInput!) { createWebhook(input: $input) { clientMutationId } }`;

export const M_UPDATE_WEBHOOK = `mutation ($input: UpdateWebhookInput!) { updateWebhook(input: $input) { clientMutationId } }`;

export const M_DELETE_WEBHOOK = `mutation ($input: DeleteWebhookInput!) { deleteWebhook(input: $input) { clientMutationId success } }`;

export const M_CREATE_ORG_WEBHOOK = `mutation ($input: CreateOrganizationWebhookInput!) { createOrganizationWebhook(input: $input) { clientMutationId } }`;

export const M_UPDATE_ORG_WEBHOOK = `mutation ($input: UpdateOrganizationWebhookInput!) { updateOrganizationWebhook(input: $input) { clientMutationId } }`;

export const M_DELETE_ORG_WEBHOOK = `mutation ($input: DeleteOrganizationWebhookGQLMutationInput!) { deleteOrganizationWebhook(input: $input) { clientMutationId success } }`;

// --- Members & Roles ---
export const M_INVITE_MEMBERS = `mutation ($input: InviteMembersInput!) { inviteMembers(input: $input) { clientMutationId } }`;

export const M_INVITE_USER_TO_GROUP = `mutation ($input: InviteUserToGroupInput!) { inviteUserToGroup(input: $input) { clientMutationId success } }`;

export const M_SET_ROLE = `mutation ($input: SetRoleInput!) { setRole(input: $input) { clientMutationId } }`;

export const M_SET_ROLES = `mutation ($input: SetRolesInput!) { setRoles(input: $input) { clientMutationId errors } }`;

export const M_REMOVE_USER_FROM_ORG = `mutation ($input: RemoveUserFromOrgInput!) { removeUserFromOrg(input: $input) { clientMutationId success } }`;

export const M_REMOVE_USER_FROM_PIPE = `mutation ($input: RemoveUserFromPipeInput!) { removeUserFromPipe(input: $input) { clientMutationId success } }`;

export const M_REMOVE_USER_FROM_TABLE = `mutation ($input: RemoveUserFromTableInput!) { removeUserFromTable(input: $input) { clientMutationId success } }`;

export const M_REMOVE_MEMBERS_FROM_PIPE = `mutation ($input: RemoveMembersFromPipeInput!) { removeMembersFromPipe(input: $input) { clientMutationId success errors removedUsersUuids removedGroupsUuids } }`;

// --- Organizations ---
export const M_CREATE_ORGANIZATION = `mutation ($input: CreateOrganizationInput!) { createOrganization(input: $input) { clientMutationId } }`;

export const M_UPDATE_ORGANIZATION = `mutation ($input: UpdateOrganizationInput!) { updateOrganization(input: $input) { clientMutationId } }`;

export const M_DELETE_ORGANIZATION = `mutation ($input: DeleteOrganizationInput!) { deleteOrganization(input: $input) { clientMutationId success } }`;

// --- Field Conditions ---
export const M_CREATE_FIELD_CONDITION = `mutation ($input: createFieldConditionInput!) { createFieldCondition(input: $input) { clientMutationId } }`;

export const M_UPDATE_FIELD_CONDITION = `mutation ($input: UpdateFieldConditionInput!) { updateFieldCondition(input: $input) { clientMutationId } }`;

export const M_DELETE_FIELD_CONDITION = `mutation ($input: DeleteFieldConditionInput!) { deleteFieldCondition(input: $input) { clientMutationId success } }`;

export const M_SET_FIELD_CONDITION_ORDER = `mutation ($input: setFieldConditionOrderInput!) { setFieldConditionOrder(input: $input) { clientMutationId } }`;

// --- Emails ---
export const M_CREATE_INBOX_EMAIL = `mutation ($input: CreateInboxEmailInput!) { createInboxEmail(input: $input) { clientMutationId } }`;

export const M_SEND_INBOX_EMAIL = `mutation ($input: SendInboxEmailInput!) { sendInboxEmail(input: $input) { clientMutationId success } }`;

export const M_DELETE_INBOX_EMAIL = `mutation ($input: DeleteInboxEmailInput!) { deleteInboxEmail(input: $input) { clientMutationId success } }`;

// --- Imports / Exports ---
export const M_CARDS_IMPORTER = `mutation ($input: CardsImporterInput!) { cardsImporter(input: $input) { cardsImportation { id } } }`;

export const M_RECORDS_IMPORTER = `mutation ($input: RecordsImporterInput!) { recordsImporter(input: $input) { clientMutationId } }`;

export const M_EXPORT_PIPE_REPORT = `mutation ($input: ExportPipeReportInput!) { exportPipeReport(input: $input) { clientMutationId } }`;

// --- Misc ---
export const M_CONFIGURE_PUBLIC_FORM_LINK = `mutation ($input: configurePublicPhaseFormLinkInput!) { configurePublicPhaseFormLink(input: $input) { active url } }`;

export const M_INTERFACE_EMBED_CREATE = `mutation ($input: InterfaceEmbedCreateMutationInput!) { interfaceEmbedCreate(input: $input) { clientMutationId embedUrl errors success } }`;

export const M_UPDATE_FIELDS_VALUES = `mutation ($input: UpdateFieldsValuesInput!) { updateFieldsValues(input: $input) { clientMutationId success } }`;

export const M_SET_SUMMARY_ATTRIBUTES = `mutation ($input: SetSummaryAttributesInput!) { setSummaryAttributes(input: $input) { clientMutationId } }`;

export const M_SET_TABLE_FIELD_ORDER = `mutation ($input: SetTableFieldOrderInput!) { setTableFieldOrder(input: $input) { clientMutationId } }`;

export const M_SET_FAVORITE_PIPES = `mutation ($input: SetFavoritePipesInput!) { setFavoritePipes(input: $input) { clientMutationId success } }`;

// --- Automations ---
export const M_CREATE_AUTOMATION = `mutation ($input: CreateAutomationInput!) { createAutomation(input: $input) { automation { id name active } } }`;

export const M_UPDATE_AUTOMATION = `mutation ($input: UpdateAutomationInput!) { updateAutomation(input: $input) { automation { id name active } } }`;

export const M_DELETE_AUTOMATION = `mutation ($input: DeleteAutomationInput!) { deleteAutomation(input: $input) { clientMutationId success } }`;

export const M_CREATE_AUTOMATION_SIMULATION = `mutation ($input: CreateAutomationSimulationInput!) { createAutomationSimulation(input: $input) { automationSimulation { id status } } }`;

// --- AI Automations ---
export const M_CREATE_AI_AUTOMATION = `mutation ($input: CreateAiAutomationInput!) { createAiAutomation(input: $input) { aiAutomation { id name prompt active } } }`;

export const M_UPDATE_AI_AUTOMATION = `mutation ($input: UpdateAiAutomationInput!) { updateAiAutomation(input: $input) { aiAutomation { id name prompt active } } }`;

export const M_DELETE_AI_AUTOMATION = `mutation ($input: DeleteAiAutomationInput!) { deleteAiAutomation(input: $input) { clientMutationId success } }`;

// --- AI Agents ---
export const M_CREATE_AI_AGENT = `mutation ($input: CreateAiAgentInput!) { createAiAgent(input: $input) { aiAgent { uuid name active } } }`;

export const M_UPDATE_AI_AGENT = `mutation ($input: UpdateAiAgentInput!) { updateAiAgent(input: $input) { aiAgent { uuid name active instruction behaviors { id type config } } } }`;

export const M_TOGGLE_AI_AGENT_STATUS = `mutation ($uuid: String!, $active: Boolean!) { updateAiAgentStatus(input: { uuid: $uuid, active: $active }) { aiAgent { uuid active } } }`;

export const M_DELETE_AI_AGENT = `mutation ($uuid: String!) { deleteAiAgent(input: { uuid: $uuid }) { clientMutationId success } }`;

// --- Observability ---
export const M_EXPORT_AUTOMATION_JOBS = `mutation ($input: CreateAutomationJobsExportInput!) { createAutomationJobsExport(input: $input) { automationJobsExport { id state } } }`;

// --- Reports ---
export const M_CREATE_PIPE_REPORT = `mutation ($input: CreatePipeReportInput!) { createPipeReport(input: $input) { pipeReport { id name } } }`;

export const M_UPDATE_PIPE_REPORT = `mutation ($input: UpdatePipeReportInput!) { updatePipeReport(input: $input) { pipeReport { id name } } }`;

export const M_DELETE_PIPE_REPORT = `mutation ($input: DeletePipeReportInput!) { deletePipeReport(input: $input) { clientMutationId success } }`;

export const M_CREATE_ORGANIZATION_REPORT = `mutation ($input: CreateOrganizationReportInput!) { createOrganizationReport(input: $input) { organizationReport { id name } } }`;

export const M_UPDATE_ORGANIZATION_REPORT = `mutation ($input: UpdateOrganizationReportInput!) { updateOrganizationReport(input: $input) { organizationReport { id name } } }`;

export const M_DELETE_ORGANIZATION_REPORT = `mutation ($input: DeleteOrganizationReportInput!) { deleteOrganizationReport(input: $input) { clientMutationId success } }`;

export const M_EXPORT_ORGANIZATION_REPORT = `mutation ($input: ExportOrganizationReportInput!) { exportOrganizationReport(input: $input) { clientMutationId } }`;

export const M_EXPORT_PIPE_AUDIT_LOGS = `mutation ($input: ExportPipeAuditLogsInput!) { exportPipeAuditLogs(input: $input) { clientMutationId } }`;

// --- Attachments ---
export const M_CREATE_PRESIGNED_URL = `mutation ($input: CreatePresignedUrlInput!) { createPresignedUrl(input: $input) { url downloadUrl clientMutationId } }`;

// --- Card Relations ---
export const M_DELETE_CARD_RELATION = `mutation ($input: DeleteCardRelationInput!) { deleteCardRelation(input: $input) { clientMutationId success } }`;

// --- Emails ---
export const M_SEND_EMAIL_WITH_TEMPLATE = `mutation ($input: SendEmailWithTemplateInput!) { sendEmailWithTemplate(input: $input) { clientMutationId success } }`;
