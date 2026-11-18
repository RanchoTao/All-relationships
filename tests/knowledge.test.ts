import test from "node:test";
import assert from "node:assert/strict";
import {
  knowledgeCards,
  knowledgeById,
  sources,
  definitionFor,
  effectiveKind,
  currentCards,
  coverage,
} from "../src/lib/knowledge";
import { entries, entryById } from "../src/lib/catalog";
import { searchEntries, emptyFilters } from "../src/lib/search";
test("new concept filters and card concepts use the same editorial layer", () => {
  assert.equal(effectiveKind(entryById["A05-001"]), "activity_scenario");
  assert.equal(effectiveKind(entryById["A03-001"]), "structural_attribute");
  assert.equal(effectiveKind(entryById["A17-007"]), "lifecycle_state");
  assert.ok(
    searchEntries({ ...emptyFilters, kind: "structural_attribute" }).some(
      (e) => e.id === "A03-001",
    ),
  );
  assert.ok(
    !searchEntries({ ...emptyFilters, kind: "relationship_archetype" }).some(
      (e) => e.id === "A03-001",
    ),
  );
});
test("each card keeps its stable identity and draft provenance", () => {
  assert.equal(
    new Set(knowledgeCards.map((c) => c.id)).size,
    knowledgeCards.length,
  );
  for (const c of knowledgeCards) {
    assert.ok(entryById[c.id]);
    assert.equal(c.evidence.definitionKind, "working_definition");
    assert.notEqual(c.evidence.independentReview, "reviewed");
    assert.equal(c.evidence.humanReviewer, null);
    assert.ok(
      c.distinctions.every((d) => entryById[d.targetId] && d.targetId !== c.id),
    );
    assert.ok(
      c.evidence.sourceIds.every((id) => sources.some((s) => s.id === id)),
    );
  }
});
test("raw catalogue remains 479 and coverage filters refer to actual authored content", () => {
  assert.equal(entries.length, 479);
  assert.equal(
    searchEntries({ ...emptyFilters, coverage: "complete" }).length,
    currentCards.length,
  );
  assert.equal(
    searchEntries({ ...emptyFilters, coverage: "pending" }).length,
    entries.length - knowledgeCards.length,
  );
  assert.equal(
    searchEntries({ ...emptyFilters, coverage: "deep" }).length,
    coverage.deep,
  );
  assert.equal(
    searchEntries({ ...emptyFilters, coverage: "legacy" }).length,
    coverage.legacy,
  );
  assert.equal(
    coverage.complete + coverage.legacy + coverage.missing,
    entries.length,
  );
  assert.ok(
    searchEntries({ ...emptyFilters, coverage: "complete" }).every(
      (e) => knowledgeById[e.id].schemaVersion === "0.4",
    ),
  );
  assert.equal(knowledgeById["constructor"], undefined);
  assert.ok(
    searchEntries({ ...emptyFilters, query: "贡献记录" }).some(
      (e) => e.id === "A09-014",
    ),
  );
  assert.ok(definitionFor(entryById["A09-014"])?.includes("研究问题"));
});
