import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Card tools
import { registerGetCard } from "./tools/cards/getCard.js";
import { registerListCards } from "./tools/cards/listCards.js";
import { registerListAllCards } from "./tools/cards/listAllCards.js";
import { registerFindCards } from "./tools/cards/findCards.js";
import { registerCreateCard } from "./tools/cards/createCard.js";
import { registerUpdateCard } from "./tools/cards/updateCard.js";
import { registerUpdateCardField } from "./tools/cards/updateCardField.js";
import { registerMoveCard } from "./tools/cards/moveCard.js";
import { registerDeleteCard } from "./tools/cards/deleteCard.js";
import { registerListCardsAutoPage } from "./tools/cards/listAllCardsAutoPage.js";

// Pipe tools
import { registerGetPipe } from "./tools/pipes/getPipe.js";
import { registerListPipes } from "./tools/pipes/listPipes.js";
import { registerGetPipeTemplates } from "./tools/pipes/getPipeTemplates.js";
import { registerCreatePipe } from "./tools/pipes/createPipe.js";
import { registerUpdatePipe } from "./tools/pipes/updatePipe.js";
import { registerDeletePipe } from "./tools/pipes/deletePipe.js";
import { registerClonePipes } from "./tools/pipes/clonePipes.js";
import { registerSetFavoritePipes } from "./tools/pipes/setFavoritePipes.js";

// Phase tools
import { registerGetPhase } from "./tools/phases/getPhase.js";
import { registerCreatePhase } from "./tools/phases/createPhase.js";
import { registerUpdatePhase } from "./tools/phases/updatePhase.js";
import { registerDeletePhase } from "./tools/phases/deletePhase.js";

// Field tools
import { registerCreatePhaseField } from "./tools/fields/createPhaseField.js";
import { registerUpdatePhaseField } from "./tools/fields/updatePhaseField.js";
import { registerDeletePhaseField } from "./tools/fields/deletePhaseField.js";
import { registerCreateTableField } from "./tools/fields/createTableField.js";
import { registerUpdateTableField } from "./tools/fields/updateTableField.js";
import { registerDeleteTableField } from "./tools/fields/deleteTableField.js";

// Table tools
import { registerGetTable } from "./tools/tables/getTable.js";
import { registerListTables } from "./tools/tables/listTables.js";
import { registerCreateTable } from "./tools/tables/createTable.js";
import { registerUpdateTable } from "./tools/tables/updateTable.js";
import { registerDeleteTable } from "./tools/tables/deleteTable.js";

// Record tools
import { registerGetRecord } from "./tools/records/getRecord.js";
import { registerListRecords } from "./tools/records/listRecords.js";
import { registerFindRecords } from "./tools/records/findRecords.js";
import { registerGetConnectedRecords } from "./tools/records/getConnectedRecords.js";
import { registerCreateRecord } from "./tools/records/createRecord.js";
import { registerCreateRestrictedRecord } from "./tools/records/createRestrictedRecord.js";
import { registerUpdateRecord } from "./tools/records/updateRecord.js";
import { registerDeleteRecord } from "./tools/records/deleteRecord.js";
import { registerSetRecordField } from "./tools/records/setRecordField.js";
import { registerListRecordsAutoPage } from "./tools/records/listRecordsAutoPage.js";

// Relation tools
import { registerListPipeRelations } from "./tools/relations/listPipeRelations.js";
import { registerListTableRelations } from "./tools/relations/listTableRelations.js";
import { registerCreatePipeRelation } from "./tools/relations/createPipeRelation.js";
import { registerUpdatePipeRelation } from "./tools/relations/updatePipeRelation.js";
import { registerDeletePipeRelation } from "./tools/relations/deletePipeRelation.js";
import { registerCreateCardRelation } from "./tools/relations/createCardRelation.js";

// Label tools
import { registerCreateLabel } from "./tools/labels/createLabel.js";
import { registerUpdateLabel } from "./tools/labels/updateLabel.js";
import { registerDeleteLabel } from "./tools/labels/deleteLabel.js";

// Comment tools
import { registerCreateComment } from "./tools/comments/createComment.js";
import { registerUpdateComment } from "./tools/comments/updateComment.js";
import { registerDeleteComment } from "./tools/comments/deleteComment.js";

// Webhook tools
import { registerCreateWebhook } from "./tools/webhooks/createWebhook.js";
import { registerUpdateWebhook } from "./tools/webhooks/updateWebhook.js";
import { registerDeleteWebhook } from "./tools/webhooks/deleteWebhook.js";
import { registerCreateOrgWebhook } from "./tools/webhooks/createOrgWebhook.js";
import { registerUpdateOrgWebhook } from "./tools/webhooks/updateOrgWebhook.js";
import { registerDeleteOrgWebhook } from "./tools/webhooks/deleteOrgWebhook.js";

// Identity tools
import { registerMe } from "./tools/identity/me.js";
import { registerGetPublicUser } from "./tools/identity/getPublicUser.js";

// Organization tools
import { registerGetOrganization } from "./tools/organizations/getOrganization.js";
import { registerListOrganizations } from "./tools/organizations/listOrganizations.js";
import { registerGetOrganizationSettings } from "./tools/organizations/getOrganizationSettings.js";
import { registerCreateOrganization } from "./tools/organizations/createOrganization.js";
import { registerUpdateOrganization } from "./tools/organizations/updateOrganization.js";
import { registerDeleteOrganization } from "./tools/organizations/deleteOrganization.js";

// Member tools
import { registerInviteMembers } from "./tools/members/inviteMembers.js";
import { registerInviteUserToGroup } from "./tools/members/inviteUserToGroup.js";
import { registerSetRole } from "./tools/members/setRole.js";
import { registerSetRoles } from "./tools/members/setRoles.js";
import { registerRemoveUserFromOrg } from "./tools/members/removeUserFromOrg.js";
import { registerRemoveUserFromPipe } from "./tools/members/removeUserFromPipe.js";
import { registerRemoveUserFromTable } from "./tools/members/removeUserFromTable.js";
import { registerRemoveMembersFromPipe } from "./tools/members/removeMembersFromPipe.js";

// Field Condition tools
import { registerGetFieldCondition } from "./tools/fieldConditions/getFieldCondition.js";
import { registerGetConditionalField } from "./tools/fieldConditions/getConditionalField.js";
import { registerCreateFieldCondition } from "./tools/fieldConditions/createFieldCondition.js";
import { registerUpdateFieldCondition } from "./tools/fieldConditions/updateFieldCondition.js";
import { registerDeleteFieldCondition } from "./tools/fieldConditions/deleteFieldCondition.js";
import { registerSetFieldConditionOrder } from "./tools/fieldConditions/setFieldConditionOrder.js";

// Email tools
import { registerListInboxEmails } from "./tools/emails/listInboxEmails.js";
import { registerCreateInboxEmail } from "./tools/emails/createInboxEmail.js";
import { registerSendInboxEmail } from "./tools/emails/sendInboxEmail.js";
import { registerDeleteInboxEmail } from "./tools/emails/deleteInboxEmail.js";

// Import/Export tools
import { registerImportCards } from "./tools/imports/importCards.js";
import { registerImportRecords } from "./tools/imports/importRecords.js";
import { registerGetCardsImportations } from "./tools/imports/getCardsImportations.js";
import { registerGetRecordsImportations } from "./tools/imports/getRecordsImportations.js";
import { registerExportPipeReport } from "./tools/imports/exportPipeReport.js";
import { registerGetPipeReportExport } from "./tools/imports/getPipeReportExport.js";

// Misc tools
import { registerGetAutoFillFields } from "./tools/misc/getAutoFillFields.js";
import { registerGetRepoItemForm } from "./tools/misc/getRepoItemForm.js";
import { registerGetPlatformAppConfig } from "./tools/misc/getPlatformAppConfig.js";
import { registerConfigurePublicFormLink } from "./tools/misc/configurePublicFormLink.js";
import { registerInterfaceEmbedCreate } from "./tools/misc/interfaceEmbedCreate.js";
import { registerUpdateFieldsValues } from "./tools/misc/updateFieldsValues.js";
import { registerSetSummaryAttributes } from "./tools/misc/setSummaryAttributes.js";
import { registerSetTableFieldOrder } from "./tools/misc/setTableFieldOrder.js";

// Groups
import { registerListGroups } from "./tools/groups/listGroups.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "pipefy",
    version: "1.0.0",
  });

  // D1: Identity
  registerMe(server);
  registerGetPublicUser(server);

  // D2: Organizations
  registerGetOrganization(server);
  registerListOrganizations(server);
  registerGetOrganizationSettings(server);
  registerCreateOrganization(server);
  registerUpdateOrganization(server);
  registerDeleteOrganization(server);

  // D3: Pipes
  registerGetPipe(server);
  registerListPipes(server);
  registerGetPipeTemplates(server);
  registerCreatePipe(server);
  registerUpdatePipe(server);
  registerDeletePipe(server);
  registerClonePipes(server);
  registerSetFavoritePipes(server);

  // D4: Phases
  registerGetPhase(server);
  registerCreatePhase(server);
  registerUpdatePhase(server);
  registerDeletePhase(server);

  // D5: Fields
  registerCreatePhaseField(server);
  registerUpdatePhaseField(server);
  registerDeletePhaseField(server);
  registerCreateTableField(server);
  registerUpdateTableField(server);
  registerDeleteTableField(server);

  // D6: Cards
  registerGetCard(server);
  registerListCards(server);
  registerListAllCards(server);
  registerFindCards(server);
  registerCreateCard(server);
  registerUpdateCard(server);
  registerUpdateCardField(server);
  registerMoveCard(server);
  registerDeleteCard(server);
  registerListCardsAutoPage(server);

  // D7: Tables
  registerGetTable(server);
  registerListTables(server);
  registerCreateTable(server);
  registerUpdateTable(server);
  registerDeleteTable(server);

  // D8: Records
  registerGetRecord(server);
  registerListRecords(server);
  registerFindRecords(server);
  registerGetConnectedRecords(server);
  registerCreateRecord(server);
  registerCreateRestrictedRecord(server);
  registerUpdateRecord(server);
  registerDeleteRecord(server);
  registerSetRecordField(server);
  registerListRecordsAutoPage(server);

  // D9: Relations
  registerListPipeRelations(server);
  registerListTableRelations(server);
  registerCreatePipeRelation(server);
  registerUpdatePipeRelation(server);
  registerDeletePipeRelation(server);
  registerCreateCardRelation(server);

  // D10: Labels
  registerCreateLabel(server);
  registerUpdateLabel(server);
  registerDeleteLabel(server);

  // D11: Comments
  registerCreateComment(server);
  registerUpdateComment(server);
  registerDeleteComment(server);

  // D12: Webhooks
  registerCreateWebhook(server);
  registerUpdateWebhook(server);
  registerDeleteWebhook(server);
  registerCreateOrgWebhook(server);
  registerUpdateOrgWebhook(server);
  registerDeleteOrgWebhook(server);

  // D13: Members
  registerInviteMembers(server);
  registerInviteUserToGroup(server);
  registerSetRole(server);
  registerSetRoles(server);
  registerRemoveUserFromOrg(server);
  registerRemoveUserFromPipe(server);
  registerRemoveUserFromTable(server);
  registerRemoveMembersFromPipe(server);

  // D14: Field Conditions, Emails, Imports
  registerGetFieldCondition(server);
  registerGetConditionalField(server);
  registerCreateFieldCondition(server);
  registerUpdateFieldCondition(server);
  registerDeleteFieldCondition(server);
  registerSetFieldConditionOrder(server);
  registerListInboxEmails(server);
  registerCreateInboxEmail(server);
  registerSendInboxEmail(server);
  registerDeleteInboxEmail(server);
  registerImportCards(server);
  registerImportRecords(server);
  registerGetCardsImportations(server);
  registerGetRecordsImportations(server);
  registerExportPipeReport(server);
  registerGetPipeReportExport(server);

  // D15: Misc + Groups
  registerGetAutoFillFields(server);
  registerGetRepoItemForm(server);
  registerGetPlatformAppConfig(server);
  registerConfigurePublicFormLink(server);
  registerInterfaceEmbedCreate(server);
  registerUpdateFieldsValues(server);
  registerSetSummaryAttributes(server);
  registerSetTableFieldOrder(server);
  registerListGroups(server);

  return server;
}
