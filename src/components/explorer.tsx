"use client";
import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  GitCompareArrows,
  Network,
  Compass,
} from "lucide-react";
import {
  createSearch,
  emptyFilters,
  facetOptionsFor,
  type Filters,
  type IndexItem,
} from "@/lib/index-model";
import type { AttributeKey } from "@/lib/schema";
import { EntryCard } from "./entry-card";

type Category = { id: string; name: string; count: number };
type CoverageStats = {
  total: number;
  complete: number;
  deep: number;
  reviewed: number;
};

export function Explorer({
  items,
  categories,
  coverage,
  kindLabels,
  statusLabels,
  attributeLabels,
}: {
  items: IndexItem[];
  categories: Category[];
  coverage: CoverageStats;
  kindLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  attributeLabels: Record<AttributeKey, string>;
}) {
  const search = useMemo(() => createSearch(items), [items]);
  const facetOptions = useMemo(() => facetOptionsFor(items), [items]);
  const itemById = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items],
  );
  const counts = useMemo(() => {
    const c = { deep: 0, basic: 0, pending: 0, unspecified: 0, network: 0 };
    for (const i of items) {
      c[i.coverage]++;
      if (i.participants === "dyadic_or_network_depending_on_context")
        c.network++;
      else c.unspecified++;
    }
    return c;
  }, [items]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [advanced, setAdvanced] = useState(false);
  const [limit, setLimit] = useState(30);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const deferredFilters = useDeferredValue(filters);
  const results = useMemo(
    () => search(deferredFilters),
    [search, deferredFilters],
  );
  const visible = results.slice(0, limit);
  const written = visible.filter((e) => e.definition);
  const pending = visible.filter((e) => !e.definition);
  function update(patch: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setLimit(30);
  }
  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      setNotice("");
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
      setNotice("");
    } else {
      setNotice("已选两项。请先移除一项，再选择新的关系。");
    }
  }
  const active = Boolean(
    filters.query ||
    filters.category ||
    filters.kind ||
    filters.status ||
    filters.participants ||
    filters.coverage ||
    Object.values(filters.attributes).some(Boolean),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-square" /> THE HUMAN CONNECTION ATLAS{" "}
            <span className="edition">VOL. 01 / 持续生长中</span>
          </div>
          <h1>
            人与人之间，
            <br />
            有不止一种<span>联结。</span>
          </h1>
          <p>
            从一面之缘，到漫长陪伴。
            <br />
            一起探索关系的形状、边界与可能。
          </p>
          <a className="text-link" href="#collection">
            走进关系馆藏 <ArrowDown size={17} />
          </a>
        </div>
        <aside className="hero-note">
          <span className="eyebrow">A LIVING INDEX</span>
          <p className="hero-number">
            479<span>个名称与场景</span>
          </p>
          <div className="note-line" />
          <p className="serif">
            关系可以交叠，
            <br />
            也会慢慢生长。
          </p>
          <p className="hero-note-small">
            这里没有固定的人生分类。
            <br />
            只有理解彼此的更多入口。
          </p>
          <div className="hero-meta">
            <span>17 个探索分类</span>
            <span>20 个拟议原型族</span>
          </div>
        </aside>
      </section>
      <nav className="pathways" aria-label="进入方式">
        <Link href="/explore" className="pathway pathway-primary">
          <span className="pathway-index">01 / 偏好探索</span>
          <Compass size={26} strokeWidth={1.4} />
          <strong>测测你想要什么关系</strong>
          <p>
            从此刻的需求出发，约 6–12
            题。可跳过、修改与否认结论，答案只在本页内存计算。
          </p>
          <span className="pathway-go">
            开始探索 <ArrowRight size={16} />
          </span>
        </Link>
        <Link href="/graph" className="pathway">
          <span className="pathway-index">02 / 关系图谱</span>
          <Network size={26} strokeWidth={1.4} />
          <strong>换个视角，看见结构</strong>
          <p>按目录与 20 个拟议原型族浏览，定位任意词条。</p>
          <span className="pathway-go">
            打开图谱 <ArrowUpRight size={16} />
          </span>
        </Link>
        <Link href="/compare" className="pathway">
          <span className="pathway-index">03 / 关系比较</span>
          <GitCompareArrows size={26} strokeWidth={1.4} />
          <strong>两种关系，差在哪里</strong>
          <p>只在双方都有记录时比较差异，缺失保持未知。</p>
          <span className="pathway-go">
            去比较 <ArrowUpRight size={16} />
          </span>
        </Link>
      </nav>
      <section id="collection" className="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE THE COLLECTION</span>
            <h2>每一种关系，都值得被理解。</h2>
          </div>
          <span className="collection-index">INDEX / 001—{coverage.total}</span>
        </div>
        <div className="search-toolbar">
          <label className="search-field">
            <Search size={21} />
            <input
              type="search"
              aria-label="搜索关系"
              placeholder="搜索关系名称、关键词或 ID…"
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
            />
            {filters.query && (
              <button
                aria-label="清除搜索"
                onClick={() => update({ query: "" })}
              >
                <X size={18} />
              </button>
            )}
          </label>
          <button
            className={`filter-toggle ${advanced ? "active" : ""}`}
            aria-expanded={advanced}
            aria-controls="advanced-filters"
            onClick={() => setAdvanced(!advanced)}
          >
            <SlidersHorizontal size={18} />
            精细筛选{active && <span className="filter-indicator" />}
          </button>
        </div>
        <div className="category-row" aria-label="关系类别">
          <button
            className={!filters.category ? "active" : ""}
            onClick={() => update({ category: "" })}
          >
            全部馆藏 <span>{coverage.total}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              title={c.name}
              className={filters.category === c.id ? "active" : ""}
              onClick={() => update({ category: c.id })}
            >
              {c.name}
              <span>{c.count}</span>
            </button>
          ))}
        </div>
        {advanced && (
          <div className="filters-panel" id="advanced-filters">
            <div className="filter-grid">
              <label>
                内容建设状态
                <select
                  aria-label="内容建设状态"
                  value={filters.coverage}
                  onChange={(e) => update({ coverage: e.target.value })}
                >
                  <option value="">全部内容</option>
                  <option value="complete">
                    基础字段完整（{counts.deep + counts.basic}）
                  </option>
                  <option value="deep">深度卡（{counts.deep}）</option>
                  <option value="pending">继续建设（{counts.pending}）</option>
                </select>
              </label>
              <label>
                概念类型
                <select
                  aria-label="概念类型"
                  value={filters.kind}
                  onChange={(e) => update({ kind: e.target.value })}
                >
                  <option value="">全部类型</option>
                  {Object.entries(kindLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                资料审核状态
                <select
                  aria-label="资料审核状态"
                  value={filters.status}
                  onChange={(e) => update({ status: e.target.value })}
                >
                  <option value="">全部状态</option>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                参与人数（原记录）
                <select
                  aria-label="参与人数（原记录）"
                  value={filters.participants}
                  onChange={(e) => update({ participants: e.target.value })}
                >
                  <option value="">全部记录</option>
                  <option value="unrestricted_or_unspecified">
                    未知／未指定（{counts.unspecified}）
                  </option>
                  <option value="dyadic_or_network_depending_on_context">
                    双人或网络 · 依情境（{counts.network}）
                  </option>
                </select>
              </label>
              {Object.entries(facetOptions).map(([key, values]) => (
                <label key={key}>
                  {attributeLabels[key as AttributeKey]}
                  <select
                    aria-label={attributeLabels[key as AttributeKey]}
                    value={filters.attributes[key as AttributeKey] ?? ""}
                    disabled={values.length === 0}
                    onChange={(e) =>
                      update({
                        attributes: {
                          ...filters.attributes,
                          [key]: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">
                      {values.length ? "不限（含未知）" : "尚无结构化依据"}
                    </option>
                    {values.map((v) => (
                      <option key={v} value={v}>
                        {v} · 草稿
                      </option>
                    ))}
                    <option value="unknown">未知／未记录</option>
                  </select>
                </label>
              ))}
            </div>
            <p className="field-note">
              属性仅摘录已有工作定义中的明确表述，仍未审核；未记录不等于“不涉及”。亲密程度等无依据的筛选暂不启用。
            </p>
          </div>
        )}
        <div className="results-line">
          <p role="status" aria-live="polite">
            {filters.query ? "搜索结果" : "当前馆藏"}{" "}
            <strong>{results.length}</strong> 项
            {active && (
              <button
                className="reset-link"
                onClick={() => {
                  setFilters(emptyFilters);
                  setLimit(30);
                }}
              >
                清除全部筛选 <X size={13} />
              </button>
            )}
          </p>
          <span className="draft-note">
            <span className="badge badge-draft">草稿</span>
            全部内容为工作定义，独立审核 {coverage.reviewed} 张 ·{" "}
            <Link href="/about">编辑原则</Link>
          </span>
        </div>
        {results.length ? (
          <>
            {written.length > 0 && (
              <div className="card-grid">
                {written.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    selected={selected.includes(entry.id)}
                    onToggle={toggle}
                  />
                ))}
              </div>
            )}
            {pending.length > 0 && (
              <>
                <div className="pending-heading">
                  <h3>待建设词条</h3>
                  <p>
                    这些名称已收录、可搜索，但还没有工作定义。名称不代表定义，空白不代表不存在。
                  </p>
                </div>
                <div className="card-grid card-grid-compact">
                  {pending.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      selected={selected.includes(entry.id)}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Search size={30} />
            <h3>这片馆藏，暂时没有匹配项。</h3>
            <p>试试更简短的名称，或放宽筛选。空结果不代表这种关系不存在。</p>
            <button
              className="primary-button"
              onClick={() => {
                setFilters(emptyFilters);
                setLimit(30);
              }}
            >
              重置筛选
            </button>
          </div>
        )}
        {results.length > limit && (
          <div className="load-more">
            <p>
              已浏览 {Math.min(limit, results.length)} / {results.length} 项
            </p>
            <button
              className="outline-button"
              onClick={() => setLimit(limit + 30)}
            >
              继续探索 <ArrowDown size={17} />
            </button>
          </div>
        )}
      </section>
      <section className="closing-note">
        <span className="eyebrow">A NOTE FROM THE MUSEUM</span>
        <p>
          名称是理解的起点，
          <br />
          <em>不是关系的全部。</em>
        </p>
        <Link className="text-link" href="/graph">
          换个视角，看见联结 <ArrowRight size={17} />
        </Link>
      </section>
      {selected.length > 0 && (
        <aside className="compare-tray" aria-label="已选择的比较词条">
          <GitCompareArrows size={21} />
          <div className="tray-items">
            {selected.map((id) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                aria-label={`移除比较：${itemById[id].label}`}
              >
                {itemById[id].label}
                <X size={14} />
              </button>
            ))}
            {selected.length === 1 && <span>再选择一种关系</span>}
          </div>
          {selected.length === 2 ? (
            <Link
              className="primary-button"
              href={`/compare?left=${selected[0]}&right=${selected[1]}`}
            >
              开始比较 <ArrowRight size={16} />
            </Link>
          ) : (
            <span className="tray-count">1 / 2</span>
          )}
          <button
            className="icon-button"
            aria-label="清空比较"
            onClick={() => {
              setSelected([]);
              setNotice("");
            }}
          >
            <X size={18} />
          </button>
          {notice && (
            <p role="status" className="tray-notice">
              {notice}
            </p>
          )}
        </aside>
      )}
    </>
  );
}
