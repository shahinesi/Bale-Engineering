import { describe, expect, it } from "vitest";
import { readCatalogFile, searchCatalog } from "../src/content.js";

describe("readCatalogFile", () => {
  it("reads canonical skill content from the repository workspace", async () => {
    const content = await readCatalogFile("skills/bale-engineering/SKILL.md");
    expect(content).toContain("Bale Engineering");
  });

  it("rejects path traversal outside the content root", async () => {
    await expect(readCatalogFile("../../package.json")).rejects.toThrow(
      "outside the repository or package data directory"
    );
  });
});

describe("searchCatalog", () => {
  it("finds Safir references using deterministic keyword search", async () => {
    const results = await searchCatalog("safir idempotency", 10);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(item => item.id === "safir-overview" || item.id === "bale-safir")).toBe(true);
  });

  it("respects the maximum result limit", async () => {
    const results = await searchCatalog("bale bot mini app safir", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("returns no results for an empty token query", async () => {
    await expect(searchCatalog("  ")).resolves.toEqual([]);
  });
});
