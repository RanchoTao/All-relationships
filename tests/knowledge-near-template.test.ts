import assert from "node:assert/strict";
import test from "node:test";
import { nearTemplateReport } from "../src/lib/knowledge-quality";
import type { KnowledgeCard } from "../src/lib/knowledge-schema";

// A concise fixture with only the fields the similarity detector reads.
const card = (
  id: string,
  needs: string[],
  schemaVersion: KnowledgeCard["schemaVersion"] = "0.4",
) => ({ id, schemaVersion, needs }) as KnowledgeCard;
const blocks = (characters: string) =>
  Array.from(characters, (char) => char.repeat(8));

test("near-template warning uses distinct 8-character shingles and a strict cutoff", () => {
  const a = card("A01-001", blocks("甲乙丙丁戊己"));
  const atThreshold = card("A01-002", blocks("甲乙丙庚辛壬癸"));
  const at = nearTemplateReport([a, atThreshold]);
  assert.equal(at.comparedPairs, 1);
  assert.equal(at.highestPair?.similarity, 3 / 10);
  assert.deepEqual(at.warnings, []);

  const aboveThreshold = card("A01-003", blocks("甲甲乙丙庚辛壬"));
  const above = nearTemplateReport([aboveThreshold, a]);
  assert.equal(above.highestPair?.similarity, 3 / 9);
  assert.deepEqual(
    above.warnings.map(({ cardIds, similarity, severity }) => ({
      cardIds,
      similarity,
      severity,
    })),
    [{ cardIds: [a.id, aboveThreshold.id], similarity: 3 / 9, severity: "warning" }],
  );
});

test("near-template report compares every v0.4 pair once and ignores legacy and metadata", () => {
  const body = "𠮷甲乙丙丁戊己庚";
  const a = card("A01-001", [body]);
  const b = card("A01-002", ["𠮷甲 乙丙。丁戊己庚"]);
  const c = Object.assign(card("A01-003", ["𠮷甲乙丙", "丁戊己庚"]), {
    summary: body,
    evidence: { note: body },
    concept: { rationale: body },
    deepDive: [{ title: body, text: "短句" }],
  });
  const legacy = card("A01-004", [body], "0.3-legacy");
  const report = nearTemplateReport([legacy, c, b, a]);
  assert.equal(report.comparedPairs, 3);
  assert.deepEqual(report.highestPair, { cardIds: [a.id, b.id], similarity: 1 });
  assert.deepEqual(report.warnings.map((warning) => warning.cardIds), [[a.id, b.id]]);
  assert.equal(nearTemplateReport([legacy, a]).highestPair, null);
  assert.equal(
    nearTemplateReport([card(a.id, ["短句"]), c]).highestPair?.similarity,
    0,
  );
});
