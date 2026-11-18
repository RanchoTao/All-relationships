import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { entries, entryById } from "../src/lib/catalog";
import {
  knowledgeCards,
  knowledgeById,
  sources,
  coverage,
  currentCards,
} from "../src/lib/knowledge";
import {
  cardQuality,
  bodyCharacters,
  repeatedSentences,
  nearTemplateReport,
  referenceErrors,
  legacyTransitionErrors,
} from "../src/lib/knowledge-quality";
import { readBaseline, frozenLegacyErrors } from "./knowledge-baseline";
import { questions, templates, questionPath } from "../src/lib/assessment";
import lock from "../data/knowledge/history-lock.json" with { type: "json" };

const hash = (text: string) =>
  crypto.createHash("sha256").update(text).digest("hex");
const baseline = readBaseline();
assert.equal(
  fs
    .readFileSync("data/knowledge/history-lock.json", "utf8")
    .replace(/\r\n/g, "\n"),
  baseline.read("data/knowledge/history-lock.json")?.replace(/\r\n/g, "\n"),
  "Do not alter the historical lock",
);
for (const [path, expected] of Object.entries(lock.sha256))
  assert.equal(
    hash(fs.readFileSync(path, "utf8").replace(/\r\n/g, "\n")),
    expected,
    `Historical file changed: ${path}`,
  );
assert.equal(entries.length, 479);
assert.equal(
  new Set(knowledgeCards.map((c) => c.id)).size,
  knowledgeCards.length,
);
assert.equal(new Set(sources.map((s) => s.id)).size, sources.length);
for (const s of sources) {
  assert.match(s.url, /^https:\/\//);
  assert.ok(s.locator && s.limit && s.claim);
}
const allowlist = JSON.parse(
  fs.readFileSync("data/knowledge/legacy-allowlist.json", "utf8"),
);
assert.ok(
  Array.isArray(allowlist.ids) &&
    allowlist.ids.every(
      (id: unknown) => typeof id === "string" && /^A\d{2}-\d{3}$/.test(id),
    ),
);
const errors = [
  ...legacyTransitionErrors(knowledgeCards, allowlist.ids, baseline.ids),
  ...frozenLegacyErrors(
    knowledgeCards.map((c) =>
      JSON.parse(fs.readFileSync(`data/knowledge/cards/${c.id}.json`, "utf8")),
    ),
    baseline.cards,
  ),
  ...referenceErrors(
    knowledgeCards,
    new Set(entries.map((e) => e.id)),
    new Set(sources.map((s) => s.id)),
  ),
];
const issues = [
  ...knowledgeCards.flatMap((c) =>
    cardQuality(c, !!entryById[c.id]?.involuntary_or_harm_risk),
  ),
  ...repeatedSentences(knowledgeCards),
].map((issue) => ({
  ...issue,
  severity: issue.cardIds.some(
    (id) => knowledgeById[id]?.schemaVersion === "0.4",
  )
    ? "error"
    : "warning",
}));
const nearTemplates = nearTemplateReport(knowledgeCards);
errors.push(
  ...issues
    .filter((i) => i.severity === "error")
    .map((i) => `${i.cardIds.join(",")}: ${i.code}: ${i.message}`),
);

// Keep existing assessment invariants without changing the question bank or classification audit.
for (const t of templates) {
  assert.ok(knowledgeById[t.id]);
  assert.ok(!entryById[t.id].involuntary_or_harm_risk);
  for (const [id, signal] of Object.entries(t.signals)) {
    const q = questions.find((q) => q.id === id);
    assert.ok(
      q && signal.values.every((v) => q.options.some((o) => o.value === v)),
    );
  }
}
for (const goal of [
  "romantic",
  "friendship",
  "activity",
  "research",
  "learning",
  "living",
  "community",
]) {
  const path = questionPath({
    purpose: { state: "answered", value: goal, must: false },
    age: { state: "answered", value: "adult", must: false },
  });
  assert.ok(path.length >= 6 && path.length <= 12);
}
const missingIds = entries.filter((e) => !knowledgeById[e.id]).map((e) => e.id);
const legacyIds = knowledgeCards
  .filter((c) => c.schemaVersion === "0.3-legacy")
  .map((c) => c.id);
const report = {
  version: "0.4.0",
  status: errors.length ? "FAIL" : "PASS",
  baseline: {
    ref: baseline.ref,
    commit: baseline.commit,
    legacyCount: baseline.ids.length,
  },
  historicalFilesUnchanged: true,
  total: entries.length,
  completeCards: coverage.complete,
  byDepth: {
    deep: coverage.deep,
    standard: coverage.standard,
    brief: coverage.brief,
  },
  legacyPendingRewrite: legacyIds.length,
  missingCards: missingIds.length,
  cardsWithSources: currentCards.filter((c) => c.evidence.sourceIds.length)
    .length,
  legacyWithSources: knowledgeCards.filter(
    (c) => c.schemaVersion === "0.3-legacy" && c.evidence.sourceIds.length,
  ).length,
  aiSelfChecked: currentCards.filter(
    (c) => c.evidence.independentReview === "ai_self_checked",
  ).length,
  reviewed: coverage.reviewed,
  legacyIds,
  missingIds,
  notCompleteIds: entries
    .filter((e) => knowledgeById[e.id]?.schemaVersion !== "0.4")
    .map((e) => e.id),
  bodyCharacters: Object.fromEntries(
    currentCards.map((c) => [c.id, bodyCharacters(c)]),
  ),
  legacyQualityWarnings: issues.filter((i) => i.severity === "warning").length,
  nearTemplates,
  blockingErrors: errors,
  contentSourceHash: hash(JSON.stringify(knowledgeCards)),
};
fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync(
  "artifacts/knowledge-quality.json",
  JSON.stringify(
    { issues: [...issues, ...nearTemplates.warnings], nearTemplates, errors },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  "artifacts/knowledge-coverage.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      ...report,
      legacyIds: `${legacyIds.length} IDs in report`,
      missingIds: `${missingIds.length} IDs in report`,
      notCompleteIds: `${report.notCompleteIds.length} IDs in report`,
    },
    null,
    2,
  ),
);
assert.deepEqual(
  errors,
  [],
  "Knowledge gate failed; see artifacts/knowledge-quality.json",
);
