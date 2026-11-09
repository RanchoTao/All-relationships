import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import {
  entries,
  categories,
  prototypes,
  annotationErrors,
  unlinkedEntries,
} from "../src/lib/catalog";
import raw from "../data/raw/dearwithme_relationship_taxonomy.json" with { type: "json" };

assert.equal(entries.length, 479);
assert.equal(raw.entries.length, 479);
assert.equal(categories.length, 17);
assert.equal(prototypes.length, 20);
assert.equal(
  new Set(entries.map((e) => e.id)).size,
  479,
  "duplicate draft IDs",
);
assert.equal(
  new Set(raw.entries.map((e) => e.id)).size,
  479,
  "duplicate raw IDs",
);
assert.equal(
  new Set(entries.map((e) => e.label_zh)).size,
  479,
  "duplicate names",
);
assert.equal(new Set(categories.map((c) => c.id)).size, 17);
assert.equal(new Set(prototypes.map((p) => p.id)).size, 20);
const rawById = new Map(raw.entries.map((e) => [e.id, e]));
for (const e of entries) {
  const original = rawById.get(e.id);
  assert.ok(original, `missing raw ${e.id}`);
  assert.equal(e.label_zh, original.name);
  assert.equal(
    categories.find((c) => c.id === e.category_id)?.name,
    original.category,
  );
  assert.equal(e.original.classification, original.classification);
  assert.equal(e.original.handling, original.proposed_platform_handling);
  assert.equal(
    Boolean(e.wiki_definition_zh),
    e.definition_status !== "not_yet_written",
  );
}
for (const c of categories) {
  assert.equal(entries.filter((e) => e.category_id === c.id).length, c.count);
  assert.deepEqual(
    c,
    raw.categories.find((r) => r.id === c.id),
  );
}
assert.equal(entries.filter((e) => e.wiki_definition_zh).length, 23);
assert.equal(
  entries.filter((e) => e.definition_status === "not_yet_written").length,
  456,
);
assert.equal(
  entries.filter((e) => e.evidence_status === "unreviewed").length,
  479,
);
assert.deepEqual(
  annotationErrors(),
  [],
  "each structured annotation must have a literal source quote",
);
const markdown = fs.readFileSync(
  "data/raw/dearwithme_relationship_catalog.md",
  "utf8",
);
for (const e of raw.entries)
  assert.ok(markdown.includes(e.name), `markdown missing ${e.id}`);
const paths = [
  "data/raw/dearwithme_relationship_catalog.md",
  "data/raw/dearwithme_relationship_taxonomy.json",
  "data/draft/AllRelationships_479_catalog_v0.2.json",
  "docs/AllRelationships_taxonomy_review_v0.2.md",
];
const report = {
  checkedAt: new Date().toISOString(),
  status: "PASS",
  entries: 479,
  uniqueIds: 479,
  uniqueNames: 479,
  categories: 17,
  proposedFamilies: 20,
  workingDefinitions: 23,
  missingDefinitions: 456,
  independentlyReviewed: 0,
  entrySpecificReferences: entries.filter((e) => e.source_refs.length).length,
  riskEntries: entries.filter((e) => e.involuntary_or_harm_risk).length,
  unresolvedFamilyEntries: unlinkedEntries.length,
  unresolvedFamilyValues: [
    ...new Set(unlinkedEntries.map((e) => e.archetype_family)),
  ],
  categoryCounts: categories.map((c) => ({ id: c.id, count: c.count })),
  sourceHashes: Object.fromEntries(
    paths.map((path) => [
      path,
      crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex"),
    ]),
  ),
};
fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync(
  "artifacts/data-validation.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
