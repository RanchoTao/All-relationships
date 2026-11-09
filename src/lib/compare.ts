import {
  attributesFor,
  attributeLabels,
  categoryById,
  kindLabels,
  participantLabel,
  statusLabels,
} from "./catalog";
import type { AttributeKey, Entry } from "./schema";
export interface ComparisonRow {
  label: string;
  left: string | null;
  right: string | null;
  draft?: boolean;
}
export function compareEntries(a: Entry, b: Entry): ComparisonRow[] {
  return [
    {
      label: "一句话工作定义",
      left: a.wiki_definition_zh,
      right: b.wiki_definition_zh,
      draft: true,
    },
    {
      label: "原始类别",
      left: categoryById[a.category_id].name,
      right: categoryById[b.category_id].name,
    },
    {
      label: "初步概念类型",
      left: kindLabels[a.kind],
      right: kindLabels[b.kind],
    },
    {
      label: "定义状态",
      left: statusLabels[a.definition_status],
      right: statusLabels[b.definition_status],
    },
    {
      label: "参与人数",
      left: participantLabel(a) === "未知／未指定" ? null : participantLabel(a),
      right:
        participantLabel(b) === "未知／未指定" ? null : participantLabel(b),
    },
    ...Object.entries(attributeLabels)
      .filter(([key]) => key !== "participants")
      .map(([key, label]) => ({
        label,
        left: attributesFor(a)[key as AttributeKey]?.value ?? null,
        right: attributesFor(b)[key as AttributeKey]?.value ?? null,
        draft: true,
      })),
    {
      label: "独立文献依据",
      left: a.source_refs.length ? a.source_refs.join("；") : null,
      right: b.source_refs.length ? b.source_refs.join("；") : null,
    },
  ];
}
export function compareSummary(rows: ComparisonRow[]) {
  const excluded = ["一句话工作定义", "定义状态", "独立文献依据"];
  const comparable = rows.filter(
    (r) => !excluded.includes(r.label) && r.left !== null && r.right !== null,
  );
  return {
    same: comparable.filter((r) => r.left === r.right).map((r) => r.label),
    different: comparable.filter((r) => r.left !== r.right).map((r) => r.label),
    unknown: rows.filter((r) => r.left === null || r.right === null).length,
  };
}
