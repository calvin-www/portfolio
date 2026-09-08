import { describe, expect, test } from "bun:test";
import { buildListHref, parseListParams } from "./v3-url";

describe("parseListParams", () => {
  test("defaults to all and no item", () => {
    expect(parseListParams(new URLSearchParams(""))).toEqual({ filter: "all", item: null });
  });
  test("reads a valid filter and item", () => {
    expect(parseListParams(new URLSearchParams("filter=work&item=acme"))).toEqual({ filter: "work", item: "acme" });
  });
  test("falls back to all for an unknown filter", () => {
    expect(parseListParams(new URLSearchParams("filter=nope")).filter).toBe("all");
  });
  test("treats empty item as null", () => {
    expect(parseListParams(new URLSearchParams("item=")).item).toBeNull();
  });
});

describe("buildListHref", () => {
  test("setting a filter adds the param", () => {
    expect(buildListHref("/", new URLSearchParams(""), { filter: "work" })).toBe("/?filter=work");
  });
  test("setting filter to all removes the param", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work"), { filter: "all" })).toBe("/");
  });
  test("opening an item keeps the filter", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work"), { item: "acme" })).toBe("/?filter=work&item=acme");
  });
  test("closing an item keeps the filter", () => {
    expect(buildListHref("/", new URLSearchParams("filter=work&item=acme"), { item: null })).toBe("/?filter=work");
  });
  test("leaves unrelated params alone", () => {
    expect(buildListHref("/", new URLSearchParams("utm=x"), { filter: "projects" })).toBe("/?utm=x&filter=projects");
  });
  test("does not mutate the input", () => {
    const sp = new URLSearchParams("filter=work");
    buildListHref("/", sp, { filter: "all" });
    expect(sp.get("filter")).toBe("work");
  });
});
