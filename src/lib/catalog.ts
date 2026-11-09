import draft from "../../data/draft/AllRelationships_479_catalog_v0.2.json" with { type: "json" };
import raw from "../../data/raw/dearwithme_relationship_taxonomy.json" with { type: "json" };
import {
  DraftSchema,
  RelationshipKnowledgeSchema,
  type AttributeKey,
  type Claim,
  type Entry,
  type Evidence,
} from "./schema";

export const catalog = DraftSchema.parse(draft);
export const entries = catalog.entries;
export const categories = catalog.category_summary;
export const prototypes = catalog.prototype_families;
export const sourcePath = "data/draft/AllRelationships_479_catalog_v0.2.json";
function indexById<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.assign(
    Object.create(null),
    Object.fromEntries(items.map((item) => [item.id, item])),
  );
}
export const categoryById = indexById(categories);
export const entryById = indexById(entries);
export const prototypeById = indexById(prototypes);
export const generalReferences = raw.references;
export const kindLabels: Record<string, string> = {
  relationship_archetype: "关系原型",
  relationship_variant: "关系变体",
  activity_scenario: "互动场景",
  role_or_collaboration: "角色与协作",
  social_role: "社会角色",
  service_role: "服务角色",
  exchange_or_contract_role: "交换与契约角色",
  ascribed_or_legal_role: "既有与法律身份",
  lifecycle_or_risk_state: "状态与风险",
  structural_attribute: "结构属性",
  institutional_role: "制度角色",
  role_or_arrangement: "角色与安排",
  lifecycle_state: "生命周期",
  network_structure: "网络结构",
  asymmetric_social_role: "非对称角色",
  risk_state: "风险状态",
  one_time_encounter: "一次性互动",
  composite_relation: "复合关系",
  legal_role: "法律角色",
};
export const statusLabels = {
  working_draft: "工作定义 · 未审核",
  not_yet_written: "待完善 · 未审核",
  reviewed: "定义已审核",
};
export const attributeLabels: Record<AttributeKey, string> = {
  purpose: "关系目的",
  intimacy: "情感亲密",
  duration: "持续时间",
  participants: "参与人数",
  cohabitation: "共同生活",
  resources: "经济或资源",
  romance: "浪漫亲密",
  sexual: "性亲密",
  structure: "关系结构",
};

// Only literal statements from the existing 23 working definitions are indexed.
// These are draft claims, not independently verified facts; absent is not false.
const annotations: Record<
  string,
  Partial<Record<AttributeKey, [string, string]>>
> = {
  "A01-018": {
    romance: ["涉及", "持续的浪漫关系"],
    duration: ["持续／长期", "相当长的时期"],
  },
  "A02-002": { duration: ["一次性", "一次性亲密接触"] },
  "A02-006": {
    sexual: ["涉及", "自愿性亲密接触"],
    duration: ["重复发生", "重复的自愿性亲密接触"],
  },
  "A02-007": { sexual: ["可能涉及", "也可能有自愿的性亲密接触"] },
  "A03-001": { structure: ["一对一排他", "一对一排他性"] },
  "A04-029": { cohabitation: ["涉及", "共同生活安排"] },
  "A06-021": { purpose: ["共同活动", "共同滑雪"] },
  "A07-001": { cohabitation: ["涉及", "共享住宅空间"] },
  "A07-006": {
    cohabitation: ["涉及", "持续共享居住空间"],
    duration: ["持续／长期", "持续共享居住空间"],
  },
  "A09-004": { purpose: ["学习与成长", "共同学习"] },
  "A09-008": { purpose: ["学习与成长", "语言学习"] },
  "A10-010": { purpose: ["创业协作", "共同筹划或经营创业活动"] },
  "A11-015": { resources: ["涉及", "租金"] },
};
export function attributesFor(
  entry: Entry,
): Partial<Record<AttributeKey, Claim>> {
  return Object.fromEntries(
    Object.entries(annotations[entry.id] ?? {}).map(([key, [value]]) => [
      key,
      { value, evidenceIds: [`${entry.id}:definition`] },
    ]),
  );
}
export function evidenceFor(entry: Entry): Evidence[] {
  const evidence: Evidence[] = [
    {
      id: `${entry.id}:catalog`,
      kind: "source_fact",
      source: "data/raw/dearwithme_relationship_taxonomy.json",
      locator: entry.id,
      review: "unreviewed",
      quote: entry.label_zh,
    },
  ];
  if (entry.wiki_definition_zh)
    evidence.push({
      id: `${entry.id}:definition`,
      kind: "working_definition",
      source: sourcePath,
      locator: `${entry.id}.wiki_definition_zh`,
      quote: entry.wiki_definition_zh,
      review: "unreviewed",
    });
  return evidence;
}
export function knowledgeFor(entry: Entry) {
  const classificationId = `${entry.id}:classification`;
  const evidence = [
    ...evidenceFor(entry),
    {
      id: classificationId,
      kind: "unverified" as const,
      source: sourcePath,
      locator: `${entry.id}.kind / archetype_family`,
      quote: `${entry.kind} / ${entry.archetype_family}`,
      review: "unreviewed" as const,
    },
  ];
  return RelationshipKnowledgeSchema.parse({
    entryId: entry.id,
    archetypes: prototypeById[entry.archetype_family]
      ? [{ value: entry.archetype_family, evidenceIds: [classificationId] }]
      : [],
    variants: [],
    contexts:
      entry.kind === "activity_scenario"
        ? [{ value: entry.label_zh, evidenceIds: [classificationId] }]
        : [],
    attributes: attributesFor(entry),
    fullDefinition: entry.wiki_definition_zh
      ? {
          value: entry.wiki_definition_zh,
          evidenceIds: [`${entry.id}:definition`],
        }
      : undefined,
    roles: [],
    interactions: [],
    conflicts: [],
    boundaries: [],
    rightsAndResponsibilities: [],
    lifecycle: [],
    links: [],
    evidence,
  });
}
export function annotationErrors() {
  return Object.entries(annotations).flatMap(([id, attrs]) =>
    Object.entries(attrs).flatMap(([key, [, quote]]) =>
      entryById[id]?.wiki_definition_zh?.includes(quote)
        ? []
        : [`${id}.${key}: quote absent: ${quote}`],
    ),
  );
}
export function displayName(entry: Entry) {
  return entry.label_zh.replace(/（[^）]*[A-Za-z][^）]*）/g, "").trim();
}
export function englishName(entry: Entry) {
  return entry.label_zh.match(/（([^）]*[A-Za-z][^）]*)）/)?.[1];
}
export function participantLabel(entry: Entry) {
  return entry.participant_count === "dyadic_or_network_depending_on_context"
    ? "双人或网络 · 依情境"
    : "未知／未指定";
}
export const featuredIds = [
  "A04-001",
  "A01-018",
  "A07-001",
  "A02-007",
  "A10-010",
  "A09-004",
];
export const unlinkedEntries = entries.filter(
  (e) => !prototypeById[e.archetype_family],
);
