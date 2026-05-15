// All 31 Pipefy GraphQL queries

export const Q_ME = `query { me { id name email locale timezone uuid avatarUrl currentOrganizationRole roleName displayName phone username } }`;

export const Q_PUBLIC_USER = `query { publicUser { id email uuid roleName floatingUser } }`;

export const Q_ORGANIZATION = `query ($id: ID!) { organization(id: $id) { id name createdAt customDomain customLogoUrl daysToExpirePlan displayPipefyLogo freemium membersCount pipesCount planName role uuid onlyAdminCanCreatePipes onlyAdminCanInviteUsers ssoEnabled ssoOnly } }`;

export const Q_ORGANIZATIONS = `query ($ids: [ID], $order: Boolean) { organizations(ids: $ids, order: $order) { id name createdAt membersCount pipesCount planName role uuid } }`;

export const Q_ORGANIZATION_SETTINGS = `query ($id: ID!) { organizationSettings(id: $id) { id name uuid locale createdAt onlyAdminCanCreatePipes onlyAdminCanInviteUsers ssoEnabled ssoOnly headerColor customLogo displayPipefyBranding groupsProvisioningEnabled userProvisioningEnabled } }`;

export const Q_PIPE = `query ($id: ID!) { pipe(id: $id) { id name description icon color anyone_can_create_card public opened_cards_count cards_count users_count created_at uuid organizationId role type noun emailAddress startFormPhaseId phases { id name done color description cards_count index fields { id label type required options description } } start_form_fields { id label type required options description } labels { id name color } members { user { id name email } role_name } } }`;

export const Q_PIPES = `query ($ids: [ID]!) { pipes(ids: $ids) { id name description icon color anyone_can_create_card public opened_cards_count cards_count users_count created_at uuid organizationId role type } }`;

export const Q_PIPE_TEMPLATES = `query { pipe_templates { id name icon image } }`;

export const Q_PHASE = `query ($id: ID!) { phase(id: $id) { id name done color description cards_count can_receive_card_directly_from_draft lateness_time expiredCardsCount lateCardsCount index isDraft sequentialId repo_id uuid next_phase_ids previous_phase_ids fields { id label type required options description is_editable } } }`;

export const Q_CARD = `query ($id: ID!) { card(id: $id) { id title url done due_date createdAt updated_at finished_at expired late overdue age current_phase_age suid uuid emailMessagingAddress creatorEmail started_current_phase_at current_phase { id name } fields { name value field { id type } } assignees { id name email } labels { id name color } comments_count attachments_count } }`;

export const Q_CARDS = `query ($pipe_id: ID!, $first: Int, $after: String, $search: CardSearch) { cards(pipe_id: $pipe_id, first: $first, after: $after, search: $search) { edges { node { id title url done due_date createdAt current_phase { id name } fields { name value } assignees { id name } labels { id name color } } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_ALL_CARDS = `query ($pipeId: ID!, $first: Int, $after: String, $filter: AdvancedSearch) { allCards(pipeId: $pipeId, first: $first, after: $after, filter: $filter) { edges { node { id title url done due_date createdAt current_phase { id name } fields { name value } assignees { id name } labels { id name color } } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_FIND_CARDS = `query ($pipeId: ID!, $first: Int, $after: String, $search: FindCards!) { findCards(pipeId: $pipeId, first: $first, after: $after, search: $search) { edges { node { id title url done due_date createdAt current_phase { id name } fields { name value } } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_TABLE = `query ($id: ID!) { table(id: $id) { id name description icon color authorization anyone_can_create_card public table_records_count users_count url uuid type create_record_button_label startFormPhaseId summary_attributes { id } table_fields { id label type required options description } } }`;

export const Q_TABLES = `query ($ids: [ID]!) { tables(ids: $ids) { id name description icon color authorization anyone_can_create_card public table_records_count users_count url uuid type } }`;

export const Q_TABLE_RECORD = `query ($id: ID!) { table_record(id: $id) { id title url done due_date created_at updated_at finished_at uuid record_fields { name value field { id type } } assignees { id name email } } }`;

export const Q_TABLE_RECORDS = `query ($table_id: ID!, $first: Int, $after: String, $search: TableRecordSearch) { table_records(table_id: $table_id, first: $first, after: $after, search: $search) { edges { node { id title url done due_date created_at record_fields { name value } assignees { id name } } cursor } pageInfo { hasNextPage endCursor } totalCount matchCount } }`;

export const Q_FIND_RECORDS = `query ($tableId: String!, $first: Int, $after: String, $search: FindCards!) { findRecords(tableId: $tableId, first: $first, after: $after, search: $search) { edges { node { id title url done due_date created_at record_fields { name value } } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_CONNECTED_TABLE_RECORDS = `query ($tableId: ID!, $throughConnectors: ReferenceConnectorFieldInput!, $first: Int, $after: String, $search: TableRecordSearch) { connectedTableRecords(tableId: $tableId, throughConnectors: $throughConnectors, first: $first, after: $after, search: $search) { edges { node { id title url done record_fields { name value } } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_PIPE_RELATIONS = `query ($ids: [ID]!) { pipe_relations(ids: $ids) { id name allChildrenMustBeDoneToFinishParent allChildrenMustBeDoneToMoveParent autoFillFieldEnabled canConnectExistingItems canConnectMultipleItems canCreateNewItems childMustExistToFinishParent childMustExistToMoveParent } }`;

export const Q_TABLE_RELATIONS = `query ($ids: [ID]!) { table_relations(ids: $ids) { id name allChildrenMustBeDoneToFinishParent allChildrenMustBeDoneToMoveParent canConnectExistingItems canConnectMultipleItems canCreateNewItems childMustExistToFinishParent childMustExistToMoveParent } }`;

export const Q_AUTO_FILL_FIELDS = `query ($connectorId: ID!, $connectorType: String!, $parentCardId: ID!, $overrideFieldValue: [FilledField]) { autoFillFields(connectorId: $connectorId, connectorType: $connectorType, parentCardId: $parentCardId, overrideFieldValue: $overrideFieldValue) { ... on AutoFillFieldCollection { fieldId value } ... on AutoFillFieldString { fieldId value } } }`;

export const Q_CONDITIONAL_FIELD = `query ($repoId: ID!, $cardId: ID!) { conditionalField(repoId: $repoId, cardId: $cardId) { fieldsToHide { id uuid } } }`;

export const Q_FIELD_CONDITION = `query ($id: ID!, $cardId: ID!) { fieldCondition(id: $id) { id name url isTrueFor(cardId: $cardId) } }`;

export const Q_GROUPS = `query ($organizationUuid: ID!, $first: Int, $after: String) { groups(organizationUuid: $organizationUuid, first: $first, after: $after) { edges { node { id name uuid } cursor } pageInfo { hasNextPage endCursor } totalCount } }`;

export const Q_INBOX_EMAILS = `query ($card_id: ID!) { inbox_emails(card_id: $card_id) { id from fromName to cc bcc main_to subject body clean_text clean_html state type created_at updated_at sent_via_automation } }`;

export const Q_CARDS_IMPORTATIONS = `query ($pipeId: ID!, $status: [String]) { cardsImportations(pipeId: $pipeId, status: $status) { id status importedCards url createdAt dateFormatted } }`;

export const Q_RECORDS_IMPORTATIONS = `query ($tableId: ID!, $status: [String]) { recordsImportations(tableId: $tableId, status: $status) { id status importedRecords url createdAt dateFormatted } }`;

export const Q_PIPE_REPORT_EXPORT = `query ($id: ID!) { pipeReportExport(id: $id) { id state fileURL startedAt finishedAt } }`;

export const Q_REPO_ITEM_FORM = `query ($repoId: ID!, $throughConnectors: ReferenceConnectorFieldInput) { repoItemForm(repoId: $repoId, throughConnectors: $throughConnectors) { ... on CardForm { id name uuid icon color canBeManaged createButtonLabel } ... on TableRecordForm { id name uuid icon color canBeManaged createButtonLabel } } }`;

export const Q_PLATFORM_APP_CONFIG = `query ($appSuid: ID!, $resourceType: String!, $resourceUuid: ID!) { platformAppConfiguration(appSuid: $appSuid, resourceType: $resourceType, resourceUuid: $resourceUuid) { fields { key value } } }`;

// --- Introspection ---
export const Q_INTROSPECT_TYPE = `query ($typeName: String!) { __type(name: $typeName) { name kind description fields { name description type { name kind ofType { name kind ofType { name kind ofType { name kind } } } } args { name description type { name kind ofType { name kind ofType { name kind } } } defaultValue } } inputFields { name description type { name kind ofType { name kind ofType { name kind ofType { name kind } } } } defaultValue } enumValues { name description isDeprecated deprecationReason } interfaces { name } possibleTypes { name } } }`;

export const Q_INTROSPECT_QUERY_FIELDS = `query { __type(name: "Query") { fields { name description args { name description type { name kind ofType { name kind ofType { name kind } } } defaultValue } type { name kind ofType { name kind ofType { name kind } } } } } }`;

export const Q_INTROSPECT_MUTATION_FIELDS = `query { __type(name: "Mutation") { fields { name description args { name description type { name kind ofType { name kind ofType { name kind } } } defaultValue } type { name kind ofType { name kind ofType { name kind } } } } } }`;

export const Q_SCHEMA_TYPES = `query { __schema { types { name kind description } } }`;

// --- Automations ---
export const Q_AUTOMATION = `query ($id: ID!) { automation(id: $id) { id name active trigger { id type params } actions { id type params } conditions { id field_id operation value } createdAt updatedAt } }`;

export const Q_AUTOMATIONS_BY_PIPE = `query ($pipeId: ID!) { automations(pipeId: $pipeId) { id name active trigger { id type } actions { id type } createdAt } }`;

export const Q_AUTOMATION_ACTIONS = `query ($pipeId: ID!) { automationActions(pipeId: $pipeId) { id name description params { name type required description } } }`;

export const Q_AUTOMATION_EVENTS = `query { automationEvents { id name description params { name type required description } } }`;

export const Q_AUTOMATION_SIMULATION = `query ($id: ID!) { automationSimulation(id: $id) { id status result errors } }`;

export const Q_PIPE_ORGANIZATION_ID = `query ($pipeId: ID!) { pipe(id: $pipeId) { id organization { id uuid } } }`;

// --- AI Agent Logs & Observability ---
export const Q_AI_AGENT_LOGS_BY_REPO = `query ($repoUuid: String!, $first: Int, $after: String) { aiAgentLogsByRepo(repoUuid: $repoUuid, first: $first, after: $after) { edges { node { id status createdAt completedAt cardId agentUuid } cursor } pageInfo { hasNextPage endCursor } } }`;

export const Q_AI_AGENT_LOG_DETAILS = `query ($id: ID!) { aiAgentLog(id: $id) { id status createdAt completedAt cardId agentUuid tracingNodes { id type content timestamp } input output errors } }`;

export const Q_AUTOMATION_LOGS = `query ($automationId: ID!, $first: Int, $after: String) { automationLogs(automationId: $automationId, first: $first, after: $after) { edges { node { id automationId status executedAt cardId error } cursor } pageInfo { hasNextPage endCursor } } }`;

export const Q_AUTOMATION_LOGS_BY_REPO = `query ($repoId: ID!, $first: Int, $after: String) { automationLogsByRepo(repoId: $repoId, first: $first, after: $after) { edges { node { id automationId status executedAt cardId error } cursor } pageInfo { hasNextPage endCursor } } }`;

export const Q_AGENTS_USAGE = `query ($organizationId: ID!) { agentsUsageDetails(organizationId: $organizationId) { totalCreditsUsed totalCreditsAvailable usageByAgent { agentUuid agentName creditsUsed } } }`;

export const Q_AUTOMATIONS_USAGE = `query ($organizationId: ID!) { automationsUsageDetails(organizationId: $organizationId) { totalExecutions executionsByAutomation { automationId automationName executions } } }`;

export const Q_AI_CREDIT_USAGE = `query ($organizationId: ID!) { aiCreditUsageStats(organizationId: $organizationId) { totalCredits usedCredits remainingCredits usageHistory { date creditsUsed } } }`;

export const Q_AUTOMATION_JOBS_EXPORT = `query ($id: ID!) { automationJobsExport(id: $id) { id state fileURL startedAt finishedAt } }`;

export const Q_RESOLVE_ORG_UUID = `query ($id: ID!) { organization(id: $id) { id uuid } }`;

// --- AI Agents ---
export const Q_AI_AGENT = `query ($uuid: String!) { aiAgent(uuid: $uuid) { uuid name instruction active repoUuid behaviors { id type config } createdAt updatedAt } }`;

export const Q_AI_AGENTS = `query ($repoUuid: String!, $first: Int, $after: String) { aiAgents(repoUuid: $repoUuid, first: $first, after: $after) { edges { node { uuid name instruction active behaviors { id type config } createdAt } cursor } pageInfo { hasNextPage endCursor } } }`;

// --- AI Automations ---
export const Q_AI_AUTOMATION = `query ($id: ID!) { aiAutomation(id: $id) { id name prompt fieldIds condition active pipeId createdAt updatedAt } }`;

export const Q_AI_AUTOMATIONS = `query ($pipeId: ID!) { aiAutomations(pipeId: $pipeId) { id name prompt active createdAt } }`;

// --- Reports ---
export const Q_PIPE_REPORTS = `query ($pipeUuid: String!, $first: Int, $after: String) { pipeReports(pipeUuid: $pipeUuid, first: $first, after: $after) { edges { node { id name createdAt updatedAt } cursor } pageInfo { hasNextPage endCursor } } }`;

export const Q_PIPE_REPORT = `query ($id: ID!) { pipeReport(id: $id) { id name fields filters formulas createdAt updatedAt } }`;

export const Q_PIPE_REPORT_COLUMNS = `query ($pipeId: ID!) { pipeReportColumns(pipeId: $pipeId) { id label fieldType } }`;

export const Q_PIPE_REPORT_FILTERABLE_FIELDS = `query ($pipeId: ID!) { pipeReportFilterableFields(pipeId: $pipeId) { phaseId phaseName fields { id label fieldType } } }`;

export const Q_ORGANIZATION_REPORT = `query ($id: ID!) { organizationReport(id: $id) { id name pipes { id name } fields filters createdAt updatedAt } }`;

export const Q_ORGANIZATION_REPORTS = `query ($organizationId: ID!, $first: Int, $after: String) { organizationReports(organizationId: $organizationId, first: $first, after: $after) { edges { node { id name createdAt } cursor } pageInfo { hasNextPage endCursor } } }`;

export const Q_ORGANIZATION_REPORT_EXPORT = `query ($id: ID!) { organizationReportExport(id: $id) { id state fileURL startedAt finishedAt } }`;

// --- Pipe extras ---
export const Q_START_FORM_FIELDS = `query ($pipeId: ID!) { pipe(id: $pipeId) { id start_form_fields { id label type required description options } } }`;

export const Q_PHASE_FIELDS = `query ($phaseId: ID!) { phase(id: $phaseId) { id name fields { id label type required description options } } }`;

export const Q_PIPE_MEMBERS = `query ($pipeId: ID!) { pipe(id: $pipeId) { id members { user { id name email } role_name } } }`;

export const Q_PIPE_LABELS = `query ($pipeId: ID!) { pipe(id: $pipeId) { id labels { id name color } } }`;

export const Q_SEARCH_PIPES = `query ($name: String!, $organizationId: ID) { pipes(name: $name, organizationId: $organizationId) { id name uuid organization { id name } } }`;

export const Q_SEARCH_TABLES = `query ($name: String!, $organizationId: ID) { tables(name: $name, organizationId: $organizationId) { edges { node { id name uuid organization { id name } } } } }`;

export const Q_CARD_RELATIONS = `query ($cardId: ID!) { card(id: $cardId) { id parent_relations { id name cards { id title } } child_relations { id name cards { id title } } } }`;

export const Q_WEBHOOKS = `query ($pipeId: ID!) { pipe(id: $pipeId) { id webhooks { id name url actions headers { key value } } } }`;

export const Q_EMAIL_TEMPLATES = `query ($pipeId: ID!) { pipe(id: $pipeId) { id emailTemplates { id name subject body toFieldId ccFieldId bccFieldId } } }`;

// --- Field conditions (list by phase) ---
export const Q_FIELD_CONDITIONS = `query ($phaseId: ID!) { phase(id: $phaseId) { id name fieldConditions { id name condition { expressions { field_address operation value } } actions { phaseFieldId action } } } }`;
