import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import {
  attributesFor,
  categoryById,
  displayName,
  englishName,
  kindLabels,
} from "@/lib/catalog";
import type { Entry } from "@/lib/schema";
export function EntryCard({
  entry,
  selected,
  onToggle,
}: {
  entry: Entry;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const tone = Number(entry.category_id.slice(1)) % 5;
  const attrs = Object.values(attributesFor(entry)).slice(0, 2);
  return (
    <article className={`entry-card tone-${tone}`} data-entry-id={entry.id}>
      <div className="card-top">
        <span>{entry.id.replace("-", " / ")}</span>
        <span className="kind-label">
          {kindLabels[entry.kind] ?? entry.kind}
        </span>
      </div>
      <Link
        className="card-link"
        href={`/relationships/${entry.id}`}
        prefetch={false}
      >
        <span className="card-category">
          {categoryById[entry.category_id].name}
        </span>
        <h3>{displayName(entry)}</h3>
        {englishName(entry) && (
          <span className="english-name" lang="en">
            {englishName(entry)}
          </span>
        )}
        <p className={entry.wiki_definition_zh ? "" : "missing-definition"}>
          {entry.wiki_definition_zh ??
            "定义待完善。此处保留原始名称与初步分类，等待进一步研究与资料核验。"}
        </p>
        <span className="card-read">
          阅读词条 <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="card-bottom">
        <div>
          <span
            className={`status-dot ${entry.wiki_definition_zh ? "has-definition" : ""}`}
          />
          {entry.wiki_definition_zh ? "工作定义 · 未审核" : "待完善 · 未审核"}
          {attrs.length > 0 && (
            <span className="attribute-hint">
              {attrs.map((a) => a.value).join(" / ")}
            </span>
          )}
        </div>
        {onToggle && (
          <button
            className="compare-add"
            onClick={() => onToggle(entry.id)}
            aria-label={`${selected ? "移除比较" : "加入比较"}：${entry.label_zh}`}
            aria-pressed={selected}
          >
            {selected ? <Check size={17} /> : <Plus size={17} />}
          </button>
        )}
      </div>
    </article>
  );
}
