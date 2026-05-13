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
