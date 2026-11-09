import { z } from "zod";
import data from "../../data/knowledge/cards.json" with { type: "json" };
import sourceData from "../../data/knowledge/sources.json" with { type: "json" };
import type { Entry } from "./schema";

const text = z.string().min(8);
const list = z.array(text).min(1);
export const KnowledgeCardSchema = z
  .object({
    id: z.string().regex(/^A\d{2}-\d{3}$/),
    version: z.literal("0.3.0"),
    batch: z.enum(["P2-01", "P2-02"]),
    depth: z.enum(["deep", "basic"]),
    concept: z.object({
      kind: z.enum([
        "archetype",
        "variant",
        "scenario",
        "structure",
        "lifecycle",
        "role",
        "composite",
      ]),
      rationale: text,
    }),
    definition: text,
    scope: text,
    scenarios: list,
    participants: z.array(z.string().min(2)).min(1),
    needs: list,
    interactions: list,
    properties: z.object({
      emotion: text,
      time: text,
      economics: text,
      material: text,
      autonomy: text,
    }),
    boundaries: list,
    misconceptions: list,
    conflicts: list,
    distinctions: z.array(z.object({ targetId: z.string(), text })).min(1),
    changes: list,
    facets: z.record(z.string(), z.string()),
    evidence: z.object({
      definitionKind: z.literal("working_definition"),
      editor: z.string(),
      editedAt: z.string(),
      sourceIds: z.array(z.string()),
      independentReview: z.literal("pending"),
      humanReviewer: z.null(),
      unverifiedHypotheses: z.array(text),
      note: text,
    }),
    deepDive: z.array(z.object({ title: z.string(), text })),
  })
  .superRefine((c, ctx) => {
    if (c.depth === "deep" && c.deepDive.length < 4)
      ctx.addIssue({
        code: "custom",
        message: "Deep card requires extended sections",
      });
  });
export type KnowledgeCard = z.infer<typeof KnowledgeCardSchema>;
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
  return c
    ? `${c.depth === "deep" ? "深度卡" : "基础卡"} · 工作定义 · 未审核`
    : "内容建设中 · 未审核";
}
export const coverage = {
  total: 479,
  complete: knowledgeCards.length,
  deep: knowledgeCards.filter((c) => c.depth === "deep").length,
  reviewed: 0,
};
