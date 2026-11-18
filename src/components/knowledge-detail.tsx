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
import type { LegacyCard, V04Card } from "@/lib/knowledge-schema";
import { dimensions } from "@/lib/assessment";
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
function LegacySections({ card }: { card: LegacyCard }) {
  return (
    <>
      <p className="risk-note">
        旧版内容待重写：保留原稿便于查阅，未通过 v0.4
        内容质量门禁，不计入完成数量。
      </p>
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
    </>
  );
}
function V04Sections({ card }: { card: V04Card }) {
  return (
    <>
      <section className="detail-block knowledge-scenarios">
        <h2>它在生活中的样子 · 虚构情境</h2>
        {card.whatItLooksLike.map((text, i) => (
          <article className="source-record" key={i}>
            <h3>情境 {i + 1}</h3>
            <p className="prose">{text}</p>
          </article>
        ))}
      </section>
      {(
        [
          ["participants", "参与者及角色"],
          ["needs", "主要需求"],
          ["interactions", "互动方式"],
          ["boundaries", "讨论边界"],
          ["commonDealbreakers", "结构性的硬冲突"],
          ["misconceptions", "容易产生的误解"],
        ] as const
      ).map(([key, title]) => (
        <section className="detail-block" key={key}>
          <h2>{title}</h2>
          {card[key].map((text, i) => (
            <p className="prose" key={i}>
              {text}
            </p>
          ))}
        </section>
      ))}
      <section className="detail-block">
        <h2>通常需要说清的议题</h2>
        {card.negotiables.length ? (
          <div className="negotiables-list">
            {card.negotiables.map((item) => (
              <article className="source-record" key={item.topic}>
                <h3>{item.topic}</h3>
                <span className="field-note">
                  议题维度：{dimensions[item.dimension]}
                </span>
                <ul className="prose">
                  {item.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="prose">本风险条目不提供关系安排选项。</p>
        )}
      </section>
      <section className="detail-block">
        <h2>关系如何变化</h2>
        {(
          [
            ["start", "开始"],
            ["evolve", "演变"],
            ["end", "结束"],
          ] as const
        ).map(([key, title]) =>
          card.changes[key] ? (
            <article className="reading-section" key={key}>
              <h3>{title}</h3>
              <p className="prose">{card.changes[key]}</p>
            </article>
          ) : null,
        )}
      </section>
    </>
  );
}
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
          </section>
          {card.schemaVersion === "0.3-legacy" ? (
            <LegacySections card={card} />
          ) : (
            <V04Sections card={card} />
          )}
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
              。
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
          </section>
          <section className="detail-block">
            <h2>相近关系，有何不同？</h2>
            {card.distinctions.map((d) => (
              <div className="source-record" key={d.targetId}>
                <Link href={`/relationships/${d.targetId}`}>
                  {entryById[d.targetId].label_zh} ↗
                </Link>
                <p>{d.text}</p>
              </div>
            ))}
          </section>
          {card.schemaVersion === "0.4" && (
            <section className="detail-block">
              <h2>关联阅读</h2>
              {card.aliasOf && (
                <p className="prose">
                  别名对应：
                  <Link href={`/relationships/${card.aliasOf}`}>
                    {entryById[card.aliasOf].label_zh}
                  </Link>
                </p>
              )}
              <p className="prose">
                相关词条：
                {card.relatedIds.length
                  ? card.relatedIds.map((id) => (
                      <Link
                        className="text-link"
                        key={id}
                        href={`/relationships/${id}`}
                      >
                        {entryById[id].label_zh} ↗{" "}
                      </Link>
                    ))
                  : "暂无记录"}
              </p>
              <p className="prose">
                另见：
                {card.seeAlso.length
                  ? card.seeAlso.map((id) => (
                      <Link
                        className="text-link"
                        key={id}
                        href={`/relationships/${id}`}
                      >
                        {entryById[id].label_zh} ↗{" "}
                      </Link>
                    ))
                  : "暂无记录"}
              </p>
            </section>
          )}
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
                      {s.version} · {s.locator} · {s.accessedAt ?? "2026-11-10"}{" "}
                      查询 ·{" "}
                      {s.access === "abstract_only"
                        ? "仅元数据／摘要"
                        : s.access === "metadata_only"
                          ? "仅元数据"
                          : "已读取相关页面"}
                      ；AI 来源核对，不等于独立人工审核。
                    </p>
                  </article>
                );
              })
            )}
            <p className="field-note">
              未验证假设：
              {card.evidence.unverifiedHypotheses.join("；") || "未登记"}。
              人工审核人：{card.evidence.humanReviewer ?? "尚无"}。
              {card.schemaVersion === "0.4" &&
                card.evidence.independentReview === "reviewed" &&
                `审核日期：${card.evidence.reviewedAt}；理由：${card.evidence.reviewReason}`}
            </p>
            <div className="source-record">
              <strong>可追溯的编辑记录</strong>
              <p>
                <code>data/knowledge/cards/{entry.id}.json</code>
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
              <dd>
                {card.schemaVersion === "0.3-legacy"
                  ? "旧版待重写"
                  : {
                      deep: "深度内容",
                      standard: "标准内容",
                      brief: "简要内容",
                    }[card.depth]}
              </dd>
              <dt>审核</dt>
              <dd>
                {card.evidence.independentReview === "reviewed"
                  ? "已由人工独立审核"
                  : "未经独立审核"}
              </dd>
              <dt>分类</dt>
              <dd>{conceptLabels[card.concept.kind]}</dd>
            </dl>
            {!entry.involuntary_or_harm_risk && (
              <Link className="outline-button" href="/explore">
                探索我的关系偏好
              </Link>
            )}
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
