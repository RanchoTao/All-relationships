import { definitionFor } from "../src/lib/knowledge";
import test from "node:test";
import assert from "node:assert/strict";
import {
  entries,
  categories,
  entryById,
  attributesFor,
  annotationErrors,
  knowledgeFor,
} from "../src/lib/catalog";
import { searchEntries, emptyFilters } from "../src/lib/search";
import { compareEntries, compareSummary } from "../src/lib/compare";

test("every ID can be found and every category contains exactly its original records", () => {
  for (const c of categories) {
    const result = searchEntries({ ...emptyFilters, category: c.id });
    assert.equal(result.length, c.count);
    assert.ok(result.every((e) => e.category_id === c.id));
  }
  for (const e of entries)
    assert.ok(
      searchEntries({ ...emptyFilters, query: e.id }).some(
        (found) => found.id === e.id,
      ),
    );
});
test("Chinese, English and keyword search; zero matches", () => {
  assert.ok(
    searchEntries({ ...emptyFilters, query: "普通朋友" }).some(
      (e) => e.id === "A04-001",
    ),
  );
  assert.equal(
    searchEntries({ ...emptyFilters, query: "FWB" })[0].id,
    "A02-007",
  );
  assert.ok(
    searchEntries({ ...emptyFilters, query: "Casual Dating" }).some(
      (e) => e.id === "A01-012",
    ),
  );
  assert.equal(
    searchEntries({ ...emptyFilters, query: "zzzz9999不存在" }).length,
    0,
  );
  assert.equal(entryById["__proto__"], undefined);
  assert.equal(entryById["constructor"], undefined);
});
test("review and participant filters do not invent classifications", () => {
  assert.equal(
    searchEntries({ ...emptyFilters, status: "reviewed" }).length,
    0,
  );
  assert.equal(
    searchEntries({ ...emptyFilters, status: "working_draft" }).length,
    entries.filter((e) => !!definitionFor(e)).length,
  );
  assert.equal(
    searchEntries({
      ...emptyFilters,
      participants: "dyadic_or_network_depending_on_context",
    }).length,
    29,
  );
});
test("attributes are explicit draft claims, absence is never false", () => {
  assert.deepEqual(annotationErrors(), []);
  assert.equal(attributesFor(entryById["A02-007"]).sexual?.value, "可能涉及");
  assert.equal(attributesFor(entryById["A04-001"]).sexual, undefined);
  const withValue = searchEntries({
    ...emptyFilters,
    attributes: { cohabitation: "涉及" },
  });
  const unknown = searchEntries({
    ...emptyFilters,
    attributes: { cohabitation: "unknown" },
  });
  const other = entries.filter((e) => {
    const v = attributesFor(e).cohabitation?.value;
    return v && v !== "涉及";
  });
  assert.equal(withValue.length + unknown.length + other.length, 479);
  assert.ok(withValue.some((e) => e.id === "A07-001"));
});
test("comparison only reports differences when both sides are known", () => {
  const rows = compareEntries(entryById["A04-001"], entryById["A02-007"]);
  const sexual = rows.find((r) => r.label === "性亲密")!;
  assert.equal(sexual.left, null);
  assert.equal(sexual.right, "可能涉及");
  assert.ok(!compareSummary(rows).different.includes("性亲密"));
  const missing = compareEntries(entryById["A01-001"], entryById["A01-002"]);
  assert.equal(missing[0].left, null);
  assert.equal(missing[0].right, null);
});
test("risk entries remain descriptive only and raw records are retained", () => {
  const risks = entries.filter((e) => e.involuntary_or_harm_risk);
  assert.equal(risks.length, 3);
  assert.ok(
    risks.every(
      (e) =>
        e.matchmaking_treatment === "safety_reference_only" &&
        e.scope === "descriptive_wiki",
    ),
  );
});
test("normalized knowledge claims always resolve their evidence and do not invent semantic links", () => {
  for (const e of entries) {
    const knowledge = knowledgeFor(e);
    const evidenceIds = new Set(knowledge.evidence.map((item) => item.id));
    for (const claim of [
      ...Object.values(knowledge.attributes),
      ...knowledge.archetypes,
      ...knowledge.contexts,
      ...(knowledge.fullDefinition ? [knowledge.fullDefinition] : []),
    ]) {
      if (claim)
        assert.ok(claim.evidenceIds.every((id) => evidenceIds.has(id)));
    }
    for (const link of knowledge.links) {
      assert.ok(entryById[link.targetId]);
      assert.ok(link.evidenceIds.every((id) => evidenceIds.has(id)));
    }
    for (const change of knowledge.lifecycle)
      assert.ok(change.claim.evidenceIds.every((id) => evidenceIds.has(id)));
  }
});
