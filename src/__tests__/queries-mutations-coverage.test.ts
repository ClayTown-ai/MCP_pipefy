import { describe, it, expect } from "vitest";
import * as queries from "../pipefy/queries.js";
import * as mutations from "../pipefy/mutations.js";

describe("GraphQL query coverage", () => {
  const queryExports = Object.entries(queries).filter(([k]) => k.startsWith("Q_"));

  it("has exactly 31 query constants", () => {
    expect(queryExports).toHaveLength(31);
  });

  const expectedQueries = [
    "Q_ME", "Q_PUBLIC_USER",
    "Q_ORGANIZATION", "Q_ORGANIZATIONS", "Q_ORGANIZATION_SETTINGS",
    "Q_PIPE", "Q_PIPES", "Q_PIPE_TEMPLATES", "Q_PHASE",
    "Q_CARD", "Q_CARDS", "Q_ALL_CARDS", "Q_FIND_CARDS",
    "Q_TABLE", "Q_TABLES", "Q_TABLE_RECORD", "Q_TABLE_RECORDS", "Q_FIND_RECORDS",
    "Q_CONNECTED_TABLE_RECORDS",
    "Q_PIPE_RELATIONS", "Q_TABLE_RELATIONS",
    "Q_AUTO_FILL_FIELDS", "Q_CONDITIONAL_FIELD", "Q_FIELD_CONDITION",
    "Q_GROUPS", "Q_INBOX_EMAILS",
    "Q_CARDS_IMPORTATIONS", "Q_RECORDS_IMPORTATIONS", "Q_PIPE_REPORT_EXPORT",
    "Q_REPO_ITEM_FORM", "Q_PLATFORM_APP_CONFIG",
  ];

  for (const name of expectedQueries) {
    it(`exports ${name}`, () => {
      expect((queries as any)[name]).toBeDefined();
      expect(typeof (queries as any)[name]).toBe("string");
      expect((queries as any)[name]).toContain("query");
    });
  }
});

describe("GraphQL mutation coverage", () => {
  const mutationExports = Object.entries(mutations).filter(([k]) => k.startsWith("M_"));

  it("has at least 60 mutation constants", () => {
    expect(mutationExports.length).toBeGreaterThanOrEqual(60);
  });

  const expectedMutations = [
    "M_CREATE_CARD", "M_UPDATE_CARD", "M_UPDATE_CARD_FIELD", "M_MOVE_CARD_TO_PHASE", "M_DELETE_CARD",
    "M_CREATE_PIPE", "M_UPDATE_PIPE", "M_DELETE_PIPE", "M_CLONE_PIPES",
    "M_CREATE_PHASE", "M_UPDATE_PHASE", "M_DELETE_PHASE",
    "M_CREATE_PHASE_FIELD", "M_UPDATE_PHASE_FIELD", "M_DELETE_PHASE_FIELD",
    "M_CREATE_TABLE", "M_UPDATE_TABLE", "M_DELETE_TABLE",
    "M_CREATE_TABLE_FIELD", "M_UPDATE_TABLE_FIELD", "M_DELETE_TABLE_FIELD",
    "M_CREATE_TABLE_RECORD", "M_CREATE_TABLE_RECORD_RESTRICTED",
    "M_UPDATE_TABLE_RECORD", "M_DELETE_TABLE_RECORD", "M_SET_TABLE_RECORD_FIELD_VALUE",
    "M_CREATE_PIPE_RELATION", "M_UPDATE_PIPE_RELATION", "M_DELETE_PIPE_RELATION", "M_CREATE_CARD_RELATION",
    "M_CREATE_LABEL", "M_UPDATE_LABEL", "M_DELETE_LABEL",
    "M_CREATE_COMMENT", "M_UPDATE_COMMENT", "M_DELETE_COMMENT",
    "M_CREATE_WEBHOOK", "M_UPDATE_WEBHOOK", "M_DELETE_WEBHOOK",
    "M_CREATE_ORG_WEBHOOK", "M_UPDATE_ORG_WEBHOOK", "M_DELETE_ORG_WEBHOOK",
    "M_INVITE_MEMBERS", "M_INVITE_USER_TO_GROUP", "M_SET_ROLE", "M_SET_ROLES",
    "M_REMOVE_USER_FROM_ORG", "M_REMOVE_USER_FROM_PIPE", "M_REMOVE_USER_FROM_TABLE", "M_REMOVE_MEMBERS_FROM_PIPE",
    "M_CREATE_ORGANIZATION", "M_UPDATE_ORGANIZATION", "M_DELETE_ORGANIZATION",
    "M_CREATE_FIELD_CONDITION", "M_UPDATE_FIELD_CONDITION", "M_DELETE_FIELD_CONDITION", "M_SET_FIELD_CONDITION_ORDER",
    "M_CREATE_INBOX_EMAIL", "M_SEND_INBOX_EMAIL", "M_DELETE_INBOX_EMAIL",
    "M_CARDS_IMPORTER", "M_RECORDS_IMPORTER", "M_EXPORT_PIPE_REPORT",
    "M_CONFIGURE_PUBLIC_FORM_LINK", "M_INTERFACE_EMBED_CREATE", "M_UPDATE_FIELDS_VALUES",
    "M_SET_SUMMARY_ATTRIBUTES", "M_SET_TABLE_FIELD_ORDER", "M_SET_FAVORITE_PIPES",
  ];

  for (const name of expectedMutations) {
    it(`exports ${name}`, () => {
      expect((mutations as any)[name]).toBeDefined();
      expect(typeof (mutations as any)[name]).toBe("string");
      expect((mutations as any)[name]).toContain("mutation");
    });
  }
});
