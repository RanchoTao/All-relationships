import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { entries, entryById } from "../src/lib/catalog";
import {
  knowledgeCards,
  knowledgeById,
  sources,
  definitionFor,
} from "../src/lib/knowledge";
import { questions, templates, questionPath } from "../src/lib/assessment";
import lock from "../data/knowledge/history-lock.json" with { type: "json" };

for (const [path, hash] of Object.entries(lock.sha256))
  assert.equal(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync(path, "utf8").replace(/\r\n/g, "\n"))
      .digest("hex"),
    hash,
    `Historical file changed: ${path}`,
  );
assert.equal(entries.length, 479);
assert.equal(knowledgeCards.length, 60);
assert.equal(knowledgeCards.filter((c) => c.depth === "deep").length, 20);
assert.equal(new Set(knowledgeCards.map((c) => c.id)).size, 60);
assert.equal(new Set(sources.map((s) => s.id)).size, sources.length);
for (const s of sources) {
  assert.match(s.url, /^https:\/\//);
  assert.ok(s.locator && s.limit && s.claim);
}
for (const c of knowledgeCards) {
  assert.ok(entryById[c.id]);
  assert.ok(
    c.distinctions.every((d) => entryById[d.targetId] && d.targetId !== c.id),
  );
  assert.ok(
    c.evidence.sourceIds.every((id) => sources.some((s) => s.id === id)),
  );
  assert.equal(c.evidence.independentReview, "pending");
  if (c.depth === "deep") assert.ok(c.deepDive.length >= 4);
}
for (const t of templates) {
  assert.ok(knowledgeById[t.id]);
  assert.ok(!entryById[t.id].involuntary_or_harm_risk);
  for (const [id, signal] of Object.entries(t.signals)) {
    const q = questions.find((q) => q.id === id);
    assert.ok(q);
    assert.ok(signal.values.every((v) => q.options.some((o) => o.value === v)));
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
  const p = questionPath({
    purpose: { state: "answered", value: goal, must: false },
    age: { state: "answered", value: "adult", must: false },
  });
  assert.ok(p.length >= 6 && p.length <= 12);
}
const classification = entries.map((e) => ({
  id: e.id,
  originalKind: e.kind,
  proposedKind: knowledgeById[e.id]?.concept.kind ?? null,
  rationale:
    knowledgeById[e.id]?.concept.rationale ??
    "沿用历史记录待逐项审查，不把目录类别自动转换为独立原型。",
  status: knowledgeById[e.id]
    ? "editorial_draft_not_independently_reviewed"
    : "pending_review",
}));
const report = {
  version: "0.3.0",
  asOf: "2026-11-10",
  status: "PASS",
  historicalFilesUnchanged: true,
  retainedOriginalEntries: 479,
  completeCards: 60,
  deepCards: 20,
  basicOnlyCards: 40,
  remainingCards: 419,
  definitionsIncludingLegacy: entries.filter((e) => definitionFor(e)).length,
  workingDefinitions: 60,
  independentlyReviewedCards: 0,
  sourceRecords: sources.length,
  sourcePageRead: sources.filter((s) => s.access === "page_read").length,
  abstractOnly: sources.filter((s) => s.access === "abstract_only").length,
  cardsWithContextSources: knowledgeCards.filter(
    (c) => c.evidence.sourceIds.length,
  ).length,
  classificationDrafts: 60,
  classificationPending: 419,
  questionBank: questions.length,
  readingTemplates: templates.length,
  assessmentValidated: false,
  contentSourceHash: crypto
    .createHash("sha256")
    .update(fs.readFileSync("data/knowledge/cards.json"))
    .digest("hex"),
};
fs.writeFileSync(
  "data/knowledge/classification-audit.json",
  JSON.stringify(
    { version: "0.3.0", asOf: "2026-11-10", entries: classification },
    null,
    2,
  ) + "\n",
);
fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync(
  "artifacts/knowledge-coverage.json",
  JSON.stringify(report, null, 2) + "\n",
);
const lines = [
  "# Phase 2 内容覆盖报告",
  "",
  `日期：2026-11-10；版本 0.3.0；历史基线 ${lock.commit}。`,
  "",
  "自动校验只验证结构、链接及不变量，不授予知识正确性或测评科学有效性。",
  "",
  ...Object.entries(report).map(([k, v]) => `- ${k}: ${v}`),
  "",
  "## 60 张完整卡片",
  "",
  "全部为可追溯工作定义；独立人工审核 0 张。来源登记中的命题与正文编辑提示分开。没有填充研究发生率、因果结论或法律效力。",
  "",
  "| ID | 名称 | 深度 | 概念层次 | 背景来源 |",
  "| --- | --- | --- | --- | --- |",
  ...knowledgeCards.map(
    (c) =>
      `| ${c.id} | ${entryById[c.id].label_zh} | ${c.depth} | ${c.concept.kind} | ${c.evidence.sourceIds.join(", ") || "暂无外部来源；工作定义"} |`,
  ),
  "",
  "## 剩余 419 项",
  "",
  "保持原始 ID、名称和 v0.2 历史数据。部分仍有旧示例定义，但未满足新卡片完整字段标准，界面显示内容建设中。逐条分类状态见 data/knowledge/classification-audit.json。",
  "",
  "## 审核边界",
  "",
  "20 个核心原型是本版组织内容的工作选择，包括对称关系与非对称角色，不是 20 个经过学界认证、互斥完备的自然类别。变体、场景、结构和生命周期不能被计为新增独立原型。",
  "",
  "7 个来源相关页面已读取；共同育儿论文全文遇到验证页，仅用元数据及摘要线索。来源核对由 AI 完成，尚无独立人工或领域专家逐卡审核。",
  "",
  "下一批优先补足专业服务、家庭既有角色和权力关系，逐项确认法域／机构范围；风险词条继续保持描述性质，不纳入推荐。",
];
fs.writeFileSync("docs/PHASE2_CONTENT_COVERAGE.md", lines.join("\n") + "\n");
console.log(JSON.stringify(report, null, 2));
const bank = [
  "# 关系偏好题库草案 v0.1",
  "",
  "编辑日期：2026-11-10。单一来源 src/lib/assessment.ts；生成本文件不代表专家审题或测评效度验证。",
  "",
  "14 题按分支选择 6–12 题，每题都支持不确定、跳过、不适用。先问目的；活动／研究有专属情境题，资源题仅用于相关分支，成年人敏感题须先确认成年。完整逻辑与边界见 PHASE2_ASSESSMENT.md。",
  "",
  ...questions.flatMap((q) => [
    `## ${q.id} · ${q.title}`,
    "",
    `维度：${q.dimension}。${q.why}`,
    "",
    ...q.options.map((o) => `- ${o.value}：${o.label}`),
    "",
    `必要条件选项：${q.hard ? "可由用户启用" : "不提供"}；成年人敏感题：${q.sensitive ? "是" : "否"}。`,
    "",
  ]),
  "## 34 个阅读模板",
  "",
  "这是编辑安排，不是关系群体的统计属性；定义、模板和私人答案分层。完整属性解释见网站 /explore/method 与源码。",
  "",
  "| ID | 阅读入口 | 主要方向 | 仍需核对的范围 |",
  "| --- | --- | --- | --- |",
  ...templates.map((t) => `| ${t.id} | ${t.title} | ${t.goal} | ${t.scope} |`),
];
fs.writeFileSync("docs/PHASE2_QUESTION_BANK.md", bank.join("\n") + "\n");
