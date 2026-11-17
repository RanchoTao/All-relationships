import { z } from "zod";
import { KnowledgeCardSchema, type KnowledgeCard } from "./knowledge-schema";
import data from "../../data/knowledge/cards.json" with { type: "json" };
import sourceData from "../../data/knowledge/sources.json" with { type: "json" };
import draft from "../../data/draft/AllRelationships_479_catalog_v0.2.json" with { type: "json" };
import type { Entry } from "./schema";
export { KnowledgeCardSchema, type KnowledgeCard } from "./knowledge-schema";
export const knowledgeCards = z.array(KnowledgeCardSchema).parse(data.cards);
export const knowledgeById: Record<string, KnowledgeCard> = Object.assign(
  Object.create(null),
  Object.fromEntries(knowledgeCards.map((c) => [c.id, c])),
);
export const sources = sourceData.sources;
export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
export const conceptLabels: Record<KnowledgeCard["concept"]["kind"], string> = {
  archetype: "关系原型 · 工作分类",
  variant: "关系变体",
  scenario: "活动或媒介场景",
  structure: "结构属性",
  lifecycle: "生命周期状态",
  role: "任务角色",
  composite: "复合关系",
};
export function definitionFor(entry: Entry) {
  return knowledgeById[entry.id]?.definition ?? entry.wiki_definition_zh;
}
export function effectiveKind(entry: Entry) {
  const kind = knowledgeById[entry.id]?.concept.kind;
  if (!kind) return entry.kind;
  return {
    archetype: "relationship_archetype",
    variant: "relationship_variant",
    scenario: "activity_scenario",
    structure: "structural_attribute",
    lifecycle: "lifecycle_state",
    role: "role_or_collaboration",
    composite: "composite_relation",
  }[kind];
}
export function contentStatus(id: string) {
  const c = knowledgeById[id];
  if (!c) return "内容建设中 · 未审核";
  if (c.schemaVersion === "0.3-legacy") return "旧版卡 · 待重写 · 未审核";
  const depth = { deep: "深度卡", standard: "标准卡", brief: "简要卡" }[
    c.depth
  ];
  return `${depth} · v0.4 工作定义 · ${c.evidence.independentReview === "reviewed" ? "人工已审核" : "未审核"}`;
}
export function coverageFor(id: string) {
  const c = knowledgeById[id];
  return !c ? "pending" : c.schemaVersion === "0.3-legacy" ? "legacy" : c.depth;
}
export const currentCards = knowledgeCards.filter(
  (c) => c.schemaVersion === "0.4",
);
export const coverage = {
  total: draft.entries.length,
  complete: currentCards.length,
  legacy: knowledgeCards.length - currentCards.length,
  missing: draft.entries.length - knowledgeCards.length,
  deep: currentCards.filter((c) => c.depth === "deep").length,
  standard: currentCards.filter((c) => c.depth === "standard").length,
  brief: currentCards.filter((c) => c.depth === "brief").length,
  reviewed: currentCards.filter(
    (c) => c.evidence.independentReview === "reviewed",
  ).length,
};
