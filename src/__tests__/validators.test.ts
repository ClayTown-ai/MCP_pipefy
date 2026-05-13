import { describe, it, expect } from "vitest";
import {
  zId, zIds, zFieldValue, zFieldAttribute, zFieldAttributes,
  zCardSearch, zFindSearch, zPagination, zConnectorParams,
  zPublicFormSettings, zPipePreferences,
} from "../core/validators.js";

describe("zId", () => {
  it("accepts non-empty string", () => {
    expect(zId.parse("123")).toBe("123");
  });

  it("rejects empty string", () => {
    expect(() => zId.parse("")).toThrow();
  });
});

describe("zIds", () => {
  it("accepts array of non-empty strings", () => {
    expect(zIds.parse(["1", "2"])).toEqual(["1", "2"]);
  });

  it("rejects empty array", () => {
    expect(() => zIds.parse([])).toThrow();
  });
});

describe("zFieldValue", () => {
  it("accepts string array", () => {
    expect(zFieldValue.parse(["value1", "value2"])).toEqual(["value1", "value2"]);
  });

  it("rejects non-array", () => {
    expect(() => zFieldValue.parse("single")).toThrow();
  });
});

describe("zFieldAttribute", () => {
  it("validates correct shape", () => {
    const result = zFieldAttribute.parse({ field_id: "abc", field_value: ["val"] });
    expect(result.field_id).toBe("abc");
    expect(result.field_value).toEqual(["val"]);
  });

  it("rejects field_value as string instead of array", () => {
    expect(() => zFieldAttribute.parse({ field_id: "abc", field_value: "val" })).toThrow();
  });
});

describe("zFieldAttributes", () => {
  it("accepts array of field attributes", () => {
    const r = zFieldAttributes.parse([
      { field_id: "f1", field_value: ["a"] },
      { field_id: "f2", field_value: ["b", "c"] },
    ]);
    expect(r).toHaveLength(2);
  });

  it("accepts undefined", () => {
    expect(zFieldAttributes.parse(undefined)).toBeUndefined();
  });
});

describe("zPagination", () => {
  it("accepts valid pagination", () => {
    const r = zPagination.parse({ first: 10, after: "cursor123" });
    expect(r.first).toBe(10);
    expect(r.after).toBe("cursor123");
  });

  it("accepts empty object", () => {
    const r = zPagination.parse({});
    expect(r.first).toBeUndefined();
  });

  it("rejects negative first", () => {
    expect(() => zPagination.parse({ first: -1 })).toThrow();
  });

  it("rejects first > 50", () => {
    expect(() => zPagination.parse({ first: 100 })).toThrow();
  });
});

describe("zCardSearch", () => {
  it("accepts valid search", () => {
    const r = zCardSearch.parse({ title: "test", include_done: true });
    expect(r?.title).toBe("test");
  });

  it("accepts undefined", () => {
    expect(zCardSearch.parse(undefined)).toBeUndefined();
  });
});

describe("zFindSearch", () => {
  it("requires fieldId and fieldValue", () => {
    const r = zFindSearch.parse({ fieldId: "f1", fieldValue: "v1" });
    expect(r.fieldId).toBe("f1");
  });

  it("rejects missing fieldId", () => {
    expect(() => zFindSearch.parse({ fieldValue: "v1" })).toThrow();
  });
});

describe("zConnectorParams", () => {
  it("accepts full connector params", () => {
    const r = zConnectorParams.parse({
      connectedRepoId: "123",
      canConnectExisting: true,
      canConnectMultiples: false,
      canCreateNewConnected: true,
      allChildrenMustBeDoneToFinishParent: false,
      allChildrenMustBeDoneToMoveParent: false,
      childMustExistToFinishParent: true,
      childMustExistToMoveParent: false,
    });
    expect(r.connectedRepoId).toBe("123");
  });

  it("accepts empty object", () => {
    expect(zConnectorParams.parse({})).toBeDefined();
  });
});

describe("zPublicFormSettings", () => {
  it("accepts partial settings", () => {
    const r = zPublicFormSettings.parse({ brandColor: "#ff0000", title: "Form" });
    expect(r?.brandColor).toBe("#ff0000");
  });

  it("accepts undefined", () => {
    expect(zPublicFormSettings.parse(undefined)).toBeUndefined();
  });
});

describe("zPipePreferences", () => {
  it("accepts preferences", () => {
    const r = zPipePreferences.parse({ findable: true, inboxEmailEnabled: false });
    expect(r?.findable).toBe(true);
  });
});
