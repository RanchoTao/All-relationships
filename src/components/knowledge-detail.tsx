import Link from "next/link";
import {
  entryById,
  displayName,
  evidenceFor,
  attributeLabels,
} from "@/lib/catalog";
import {
  conceptLabels,
  contentStatus,
  sourceById,
  type KnowledgeCard,
} from "@/lib/knowledge";
import type { Entry } from "@/lib/schema";
const sections = [
  ["scenarios", "典型情境 · 虚构例子"],
  ["participants", "参与者及角色"],
  ["needs", "主要需求"],
  ["interactions", "互动方式"],
  ["boundaries", "需要协商的边界"],
  ["misconceptions", "容易产生的误解 · 编辑提示"],
  ["conflicts", "可讨论的冲突"],
  ["changes", "关系的可能变化"],
] as const;
export function KnowledgeDetail({
  entry,
  card,
}: {
  entry: Entry;
  card: KnowledgeCard;
}) {
  return (
    <div className="page-wrap">
      <nav className="breadcrumbs" aria-label="面包屑">
        <Link href="/">探索馆藏</Link>
        <span>／ {entry.id}</span>
      </nav>
      <div className="detail-top">
        <div>
          <span className="eyebrow">
            {entry.id} / {conceptLabels[card.concept.kind]}
          </span>
          <h1 className="page-title">{displayName(entry)}</h1>
          <span className="status-badge">{contentStatus(entry.id)}</span>
        </div>
        <Link className="outline-button" href={`/compare?left=${entry.id}`}>
          与另一种关系比较
        </Link>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-block">
            <h2>定义与适用范围</h2>
            <p className="definition-quote">{card.definition}</p>
            <p className="prose">{card.scope}</p>
            <p className="field-note">
              以下正文为编辑工作定义与讨论提示，未经独立审核。例子不代表普遍行为，关系名称不自动产生法律权利或义务。
            </p>
          </section>
          {sections.map(([key, title]) => (
            <section className="detail-block" key={key}>
              <h2>{title}</h2>
              {card[key].map((t, i) => (
                <p className="prose" key={i}>
                  {t}
                </p>
              ))}
            </section>
          ))}
          <section className="detail-block">
            <h2>情感、时间与资源</h2>
            <p className="field-note">
              用于筛选的工作属性：
              {Object.entries(card.facets)
                .map(
                  ([k, v]) =>
                    `${attributeLabels[k as keyof typeof attributeLabels]}：${v}`,
                )
                .join("；") || "未建立筛选属性"}
              。这些是编辑定义范围，不是群体统计。
            </p>
            <dl className="fact-grid">
              {Object.entries({
                emotion: "情感",
                time: "时间",
                economics: "经济",
                material: "物质与空间",
                autonomy: "自主边界",
              }).map(([key, label]) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>
                    {card.properties[key as keyof typeof card.properties]}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="field-note">
              未明确的属性保持未知；不是对所有此类关系的统计概括。
            </p>
          </section>
          <section className="detail-block">
            <h2>相近关系，有何不同？</h2>
            {card.distinctions.map((d) => (
              <div className="source-record" key={d.targetId}>
                <Link href={`/relationships/${d.targetId}`}>
                  {entryById[d.targetId].label_zh} ↗
                </Link>
                <p>{d.text}</p>
                <span className="field-note">
                  编辑提出的概念区分，独立审核待完成。
                </span>
              </div>
            ))}
          </section>
          {card.deepDive.length > 0 && (
            <section className="detail-block">
              <h2>深入阅读</h2>
              {card.deepDive.map((d) => (
                <article className="reading-section" key={d.title}>
                  <h3>{d.title}</h3>
                  <p className="prose">{d.text}</p>
                </article>
              ))}
            </section>
          )}
          <section className="detail-block" id="sources">
            <h2>来源、证据与审核</h2>
            <p className="prose">{card.evidence.note}</p>
            <p className="field-note">
              正文身份：工作定义。文献或规范只支持下列登记命题，不验证整张卡片，也不验证偏好测试。
            </p>
            {card.evidence.sourceIds.length === 0 ? (
              <p className="prose">
                本卡暂无独立外部来源。定义可追溯到本版编辑记录，等待文献补充与人工复核。
              </p>
            ) : (
              card.evidence.sourceIds.map((id) => {
                const s = sourceById[id];
                return (
                  <article className="source-record" key={id}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title} ↗
                    </a>
                    <p>来源支持范围：{s.claim}</p>
                    <p>限制：{s.limit}</p>
                    <p className="field-note">
                      {s.version} · {s.locator} · 2026-11-10 查询 ·{" "}
                      {s.access === "abstract_only"
                        ? "仅元数据／摘要"
                        : "已读取相关页面"}
                      ；AI 来源核对，不等于独立人工审核。
                    </p>
                  </article>
                );
              })
            )}
            <p className="field-note">
              未经验证的假设：本版未登记研究假设；推荐模板另存，不能倒推本卡事实。人工审核人：尚无。
            </p>
            <div className="source-record">
              <strong>可追溯的编辑记录</strong>
              <p>
                <code>data/knowledge/cards.json → {entry.id}</code>
              </p>
              <p>
                {card.version} · {card.batch} · {card.evidence.editedAt} ·{" "}
                {card.evidence.editor}
              </p>
              <p>分类理由：{card.concept.rationale}</p>
            </div>
            <details className="details-disclosure">
              <summary>查看历史 v0.2 记录与旧证据（完整保留）</summary>
              <pre>
                {JSON.stringify(
                  { entry, evidence: evidenceFor(entry) },
                  null,
                  2,
                )}
              </pre>
            </details>
          </section>
        </div>
        <aside className="detail-sidebar">
          <div className="sidebar-box">
            <h2>阅读档案</h2>
            <dl>
              <dt>稳定 ID</dt>
              <dd>{entry.id}</dd>
              <dt>完整度</dt>
              <dd>{card.depth === "deep" ? "深度内容" : "基础字段完整"}</dd>
              <dt>审核</dt>
              <dd>未经独立审核</dd>
              <dt>分类</dt>
              <dd>{conceptLabels[card.concept.kind]}</dd>
            </dl>
            <Link className="outline-button" href="/explore">
              探索我的关系偏好
            </Link>
            <Link className="text-link" href={`/graph?entry=${entry.id}`}>
              在目录图谱中定位 ↗
            </Link>
          </div>
          <div className="sidebar-box">
            <h2>不要把名称变成义务</h2>
            <p className="prose">
              百科描述一种可能的理解；个人偏好是当前自述；双方约定还需要真实协商。三者互不替代。
            </p>
            <Link href="/about">查看内容建设与证据边界</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
