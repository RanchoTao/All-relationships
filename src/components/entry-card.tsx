import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { coverageLabels, type IndexItem } from "@/lib/index-model";

export function CoverageBadge({
  coverage,
}: {
  coverage: IndexItem["coverage"];
}) {
  return (
    <span className={`badge badge-${coverage}`}>
      {coverageLabels[coverage]}
    </span>
  );
}

export function EntryCard({
  entry,
  selected,
  onToggle,
}: {
  entry: IndexItem;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const tone = Number(entry.categoryId.slice(1)) % 5;
  const attrs = Object.values(entry.attrs).slice(0, 2);
  const isPending = !entry.definition;
  return (
    <article
      className={`entry-card tone-${tone}${isPending ? " is-pending" : ""}${selected ? " is-selected" : ""}`}
      data-entry-id={entry.id}
    >
      <div className="card-top">
        <span>{entry.id.replace("-", " / ")}</span>
        <span className="kind-label">{entry.kindLabel}</span>
      </div>
      <Link
        className="card-link"
        href={`/relationships/${entry.id}`}
        prefetch={false}
      >
        <span className="card-category">{entry.categoryName}</span>
        <h3>{entry.name}</h3>
        {entry.en && (
          <span className="english-name" lang="en">
            {entry.en}
          </span>
        )}
        {entry.definition && <p>{entry.definition}</p>}
        <span className="card-read">
          {isPending ? "查看收录信息" : "阅读词条"} <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="card-bottom">
        <div className="card-meta">
          {entry.coverage === "pending" && entry.definition ? (
            <span className="badge badge-basic">简短定义</span>
          ) : (
            <CoverageBadge coverage={entry.coverage} />
          )}
          {attrs.length > 0 && (
            <span className="attribute-hint">{attrs.join(" / ")}</span>
          )}
        </div>
        {onToggle && (
          <button
            className="compare-add"
            onClick={() => onToggle(entry.id)}
            aria-label={`${selected ? "移除比较" : "加入比较"}：${entry.label}`}
            aria-pressed={selected}
          >
            {selected ? <Check size={17} /> : <Plus size={17} />}
          </button>
        )}
      </div>
    </article>
  );
}
