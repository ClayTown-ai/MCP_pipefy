# Pipefy Context -- EXAMPLE

> Copy this file to `PIPEFY_CONTEXT.md` and fill in your real IDs.
> `PIPEFY_CONTEXT.md` is in `.gitignore` and will NOT be committed.

---

## Organization

| Field | Value |
|---|---|
| ID | `000000000` |
| UUID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| Name | Your Organization |
| Plan | Enterprise |
| Members | 0 |
| Pipes | 0 |

---

## Pipes

| ID | Name | Area |
|---|---|---|
| `000000001` | [OPS] Example Pipe | Operations |
| `000000002` | [CRM] Example Pipe | Sales |
| `000000003` | [CBR] Example Pipe | Cross-border |

---

## Databases (Tables)

| ID | Name | Records |
|---|---|---|
| `AbCdEfGh` | [OPS] Example Table | 0 |
| `IjKlMnOp` | [CRM] Example Table | 0 |

---

## Key Pipe Phases

### [OPS] Example Pipe (`000000001`)

| Phase ID | Name | Done? |
|---|---|---|
| `100000001` | Reception | No |
| `100000002` | Analysis | No |
| `100000003` | Review | No |
| `100000004` | Approved | Yes |
| `100000005` | Rejected | Yes |

---

## Key Fields

### Start Form Fields (Example Pipe)

| Field ID | Label | Type | Required |
|---|---|---|---|
| `field_name` | Field Name | short_text | Yes |
| `connector_field` | Related Record | connector | No |

### Phase Fields (Analysis)

| Field ID | Label | Type |
|---|---|---|
| `analysis_result` | Analysis Result | long_text |
| `status` | Status | radio_vertical |
