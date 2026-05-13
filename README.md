# Pipefy MCP Server

MCP (Model Context Protocol) server providing **102 tools** for full Pipefy administration via Cursor. Covers **100% of the Pipefy GraphQL API** — all 31 queries and 69+ mutations organized across 15 domains.

## Quick Start

### Prerequisites

- Node.js 20+
- A Pipefy API token ([generate one here](https://app.pipefy.com/tokens))

### Installation

```bash
cd MCP_pipefy
npm install
```

### Cursor Configuration

Add to your Cursor MCP settings (`.cursor/mcp.json` or IDE settings):

```json
{
  "mcpServers": {
    "pipefy": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/MCP_pipefy/src/index.ts"],
      "env": {
        "PIPEFY_TOKEN": "your-pipefy-api-token"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PIPEFY_TOKEN` | Yes | — | Pipefy API Bearer token |
| `LOG_LEVEL` | No | `info` | Pino log level (`debug`, `info`, `warn`, `error`) |
| `CACHE_TTL_MS` | No | `300000` | Schema resolver cache TTL (5 min) |
| `REQUEST_TIMEOUT_MS` | No | `30000` | HTTP request timeout (30s) |

## Architecture

```
Cursor LLM ──MCP stdio──► MCP Server ──dispatch──► 102 Tool Handlers
                                                        │
                                          ┌─────────────┼─────────────┐
                                          ▼             ▼             ▼
                                   Schema Resolver  Validators  GraphQL Client
                                   (cache + maps)   (Zod)       (fetch + retry)
                                          │                         │
                                          └─────────────────────────┘
                                                        │
                                                        ▼
                                              Pipefy GraphQL API
```

**Transport:** stdio (standard MCP SDK)
**Client:** Native `fetch` with retry (exponential backoff for 429), HTTP 200 error inspection
**Validation:** Zod schemas on all tool inputs
**Caching:** In-memory schema resolver with bidirectional field/phase name↔ID maps (5 min TTL)

## Tool Catalog (102 tools across 15 domains)

### D1: Identity (2 tools)

| Tool | Description |
|---|---|
| `me` | Get authenticated user info |
| `get_public_user` | Get public user info |

### D2: Organizations (6 tools)

| Tool | Description |
|---|---|
| `get_organization` | Get organization by ID |
| `list_organizations` | List organizations by IDs |
| `get_organization_settings` | Get organization settings |
| `create_organization` | Create an organization |
| `update_organization` | Update an organization |
| `delete_organization` | **DESTRUCTIVE** Delete an organization |

### D3: Pipes (8 tools)

| Tool | Description |
|---|---|
| `get_pipe` | Get pipe with phases, fields, labels, members |
| `list_pipes` | List pipes by IDs |
| `get_pipe_templates` | Get available pipe templates |
| `create_pipe` | Create pipe with phases, labels, members, preferences |
| `update_pipe` | Update pipe settings |
| `delete_pipe` | **DESTRUCTIVE** Delete a pipe |
| `clone_pipes` | Clone pipes from templates |
| `set_favorite_pipes` | Set favorite pipes |

### D4: Phases (4 tools)

| Tool | Description |
|---|---|
| `get_phase` | Get phase with fields and card counts |
| `create_phase` | Create a phase in a pipe |
| `update_phase` | Update phase properties |
| `delete_phase` | **DESTRUCTIVE** Delete a phase |

### D5: Fields (6 tools)

| Tool | Description |
|---|---|
| `create_phase_field` | Create field in phase (supports connector fields) |
| `update_phase_field` | Update phase field |
| `delete_phase_field` | **DESTRUCTIVE** Delete phase field |
| `create_table_field` | Create field in table (supports connector fields) |
| `update_table_field` | Update table field |
| `delete_table_field` | **DESTRUCTIVE** Delete table field |

### D6: Cards (10 tools)

| Tool | Description |
|---|---|
| `get_card` | Get card with all fields, assignees, labels, metadata |
| `list_cards` | List cards with simple filters (Relay pagination) |
| `list_all_cards` | Advanced card listing with AND/OR composite filters |
| `find_cards` | Find cards by specific field value |
| `list_cards_all_pages` | **Auto-paginate** all cards (up to 1000) |
| `create_card` | Create card with `fields_attributes: [{field_id, field_value: string[]}]` |
| `update_card` | Update card metadata (title, assignees, labels, due date) |
| `update_card_field` | Update a single card field (`new_value: string[]`) |
| `move_card` | Move card to another phase (validates required fields) |
| `delete_card` | **DESTRUCTIVE** Delete a card (pre-read check) |

### D7: Tables (5 tools)

| Tool | Description |
|---|---|
| `get_table` | Get table with fields and metadata |
| `list_tables` | List tables by IDs |
| `create_table` | Create a database table |
| `update_table` | Update table settings |
| `delete_table` | **DESTRUCTIVE** Delete a table |

### D8: Records (10 tools)

| Tool | Description |
|---|---|
| `get_record` | Get record with all fields |
| `list_records` | List records with filters (Relay pagination) |
| `find_records` | Find records by specific field value |
| `get_connected_records` | Get records through connector fields |
| `list_records_all_pages` | **Auto-paginate** all records (up to 1000) |
| `create_record` | Create record with `fields_attributes` |
| `create_restricted_record` | Create record in restricted table |
| `update_record` | Update record metadata |
| `delete_record` | **DESTRUCTIVE** Delete a record |
| `set_record_field` | Set a single record field value (`value: string[]`) |

### D9: Relations (6 tools)

| Tool | Description |
|---|---|
| `list_pipe_relations` | List pipe relations by IDs |
| `list_table_relations` | List table relations by IDs |
| `create_pipe_relation` | Create pipe relation with field maps |
| `update_pipe_relation` | Update pipe relation |
| `delete_pipe_relation` | **DESTRUCTIVE** Delete pipe relation |
| `create_card_relation` | Create card relation (parent/child) |

### D10: Labels (3 tools)

| Tool | Description |
|---|---|
| `create_label` | Create label on pipe or table |
| `update_label` | Update label name/color |
| `delete_label` | **DESTRUCTIVE** Delete a label |

### D11: Comments (3 tools)

| Tool | Description |
|---|---|
| `create_comment` | Create comment on a card |
| `update_comment` | Update comment text |
| `delete_comment` | **DESTRUCTIVE** Delete a comment |

### D12: Webhooks (6 tools)

| Tool | Description |
|---|---|
| `create_webhook` | Create webhook on pipe/table |
| `update_webhook` | Update webhook settings |
| `delete_webhook` | **DESTRUCTIVE** Delete webhook |
| `create_org_webhook` | Create organization webhook |
| `update_org_webhook` | Update organization webhook |
| `delete_org_webhook` | **DESTRUCTIVE** Delete organization webhook |

### D13: Members & Roles (8 tools)

| Tool | Description |
|---|---|
| `invite_members` | Invite members to pipe/table/org |
| `invite_user_to_group` | Invite user to a group |
| `set_role` | Set member role |
| `set_roles` | Set roles for multiple members |
| `remove_user_from_org` | **DESTRUCTIVE** Remove user from organization |
| `remove_user_from_pipe` | **DESTRUCTIVE** Remove user from pipe |
| `remove_user_from_table` | **DESTRUCTIVE** Remove user from table |
| `remove_members_from_pipe` | **DESTRUCTIVE** Remove multiple members from pipe |

### D14: Field Conditions + Emails + Imports (16 tools)

| Tool | Description |
|---|---|
| `get_field_condition` | Get field condition with evaluation |
| `get_conditional_field` | Get conditional fields to hide |
| `create_field_condition` | Create field condition |
| `update_field_condition` | Update field condition |
| `delete_field_condition` | **DESTRUCTIVE** Delete field condition |
| `set_field_condition_order` | Set field condition order |
| `list_inbox_emails` | List inbox emails for a card |
| `create_inbox_email` | Create inbox email |
| `send_inbox_email` | Send inbox email |
| `delete_inbox_email` | **DESTRUCTIVE** Delete inbox email |
| `import_cards` | Import cards from CSV URL |
| `import_records` | Import records from CSV URL |
| `get_cards_importations` | Get card import status |
| `get_records_importations` | Get record import status |
| `export_pipe_report` | Export pipe report |
| `get_pipe_report_export` | Get export status/URL |

### D15: Misc + Groups (9 tools)

| Tool | Description |
|---|---|
| `get_auto_fill_fields` | Get auto-fill field values |
| `get_repo_item_form` | Get repository item form |
| `get_platform_app_config` | Get platform app configuration |
| `configure_public_form_link` | Enable/disable public form link |
| `interface_embed_create` | Create interface embed URL |
| `update_fields_values` | Batch update field values |
| `set_summary_attributes` | Set summary attributes on pipe/table |
| `set_table_field_order` | Set table field display order |
| `list_groups` | List organization groups |

## Critical API Rules

1. **Field values are ARRAYS**: `new_value: string[]`, `field_value: string[]` — never a plain string
2. **`fields_attributes`** format: `[{ field_id: string, field_value: string[] }]`
3. **Relay pagination**: `first`, `after`, `edges.node`, `pageInfo.hasNextPage/endCursor`
4. **Errors with HTTP 200**: The client inspects `response.errors` on every response
5. **Destructive actions**: Pre-read query before `delete*`/`remove*` operations
6. **`move_card`**: Validates required fields on destination phase
7. **Token security**: Never logged or included in error messages
8. **Rate limiting**: Exponential backoff retry (1s → 2s → 4s, max 3 retries) for HTTP 429

## Development

```bash
npm run dev          # Watch mode
npm run build        # TypeScript compile
npm test             # Run all tests (vitest)
npm run test:watch   # Watch mode tests
```

### Project Structure

```
src/
├── index.ts                    # Entry point
├── mcp/
│   ├── server.ts               # MCP server + tool registration
│   └── tools/                  # 102 tool handlers in 16 domain folders
│       ├── cards/              # 10 tools
│       ├── pipes/              # 8 tools
│       ├── phases/             # 4 tools
│       ├── fields/             # 6 tools
│       ├── tables/             # 5 tools
│       ├── records/            # 10 tools
│       ├── relations/          # 6 tools
│       ├── labels/             # 3 tools
│       ├── comments/           # 3 tools
│       ├── webhooks/           # 6 tools
│       ├── identity/           # 2 tools
│       ├── organizations/      # 6 tools
│       ├── members/            # 8 tools
│       ├── fieldConditions/    # 6 tools
│       ├── emails/             # 4 tools
│       ├── imports/            # 6 tools
│       ├── misc/               # 8 tools
│       └── groups/             # 1 tool
├── pipefy/
│   ├── client.ts               # GraphQL client (fetch + retry + error inspect)
│   ├── queries.ts              # 31 query strings
│   ├── mutations.ts            # 69+ mutation strings
│   ├── mapper.ts               # Relay unwrap + field normalization + auto-pagination
│   └── schema-resolver.ts      # Bidirectional name↔ID cache
├── core/
│   ├── types.ts                # TypeScript types
│   ├── errors.ts               # Error types
│   └── validators.ts           # Zod schemas
├── infra/
│   ├── config.ts               # Environment configuration
│   └── logger.ts               # Pino logger (stderr, token redaction)
└── __tests__/                  # 177 unit tests
```

## Testing

177 unit tests covering:
- GraphQL client (retry, error handling, timeouts)
- Relay connection unwrapping and field normalization
- Auto-pagination across multiple pages
- Schema resolver with caching and invalidation
- Zod validators for all input shapes
- Query/mutation export completeness (31 queries, 69+ mutations)
- Card, Pipe, and Record tool handlers with mocked GraphQL

```bash
npm test
```

## License

Private — for internal use.
