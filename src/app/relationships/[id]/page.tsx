import { knowledgeById } from "@/lib/knowledge";
import { KnowledgeDetail } from "@/components/knowledge-detail";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  GitCompareArrows,
} from "lucide-react";
import {
  entries,
  entryById,
  categoryById,
  prototypeById,
  kindLabels,
  statusLabels,
  knowledgeFor,
  attributeLabels,
  participantLabel,
  englishName,
  displayName,
  evidenceFor,
} from "@/lib/catalog";
import type { AttributeKey } from "@/lib/schema";

export function generateStaticParams() {
  return entries.map((e) => ({ id: e.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: entryById[id]?.label_zh ?? "词条未找到" };
}
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = entryById[id];
  if (!entry) notFound();
  const card = knowledgeById[id];
  if (card) return <KnowledgeDetail entry={entry} card={card} />;
  const category = categoryById[entry.category_id];
  const family = prototypeById[entry.archetype_family];
  const attributes = knowledgeFor(entry).attributes;
  const related = entries
    .filter((e) => e.id !== id && e.category_id === entry.category_id)
    .slice(0, 5);
  return (
    <div className="page-wrap">
      <nav className="breadcrumbs" aria-label="面包屑">
        <Link href="/">探索馆藏</Link>
        <ChevronRight size={12} />
        <span>{category.name}</span>
        <ChevronRight size={12} />
        <span>{id}</span>
      </nav>
      <div className="detail-top">
        <div>
          <span className="eyebrow">
            {id} / {kindLabels[entry.kind]}
          </span>
          <h1 className="page-title">{displayName(entry)}</h1>
          {englishName(entry) && (
            <p className="english-name" lang="en">
              {englishName(entry)}
            </p>
          )}
          <span className="status-badge">
            <span className="status-dot" />
            {statusLabels[entry.definition_status]}
          </span>
        </div>
        <Link className="outline-button" href={`/compare?left=${id}`}>
          <GitCompareArrows size={17} />
          与另一种关系比较
        </Link>
      </div>
      {entry.involuntary_or_harm_risk && (
        <div className="risk-note">
          <strong>风险与保护专题 · 仅供百科描述</strong>
          <p>
            此项涉及非自愿、控制或伤害风险。不作为普通关系模板或协商示例；现有工作定义不构成对任何具体人物的事实认定。
          </p>
        </div>
      )}
      <div className="detail-layout">
        <div>
          <section className="detail-block">
            <h2>
              <span className="section-number">01</span>如何理解这段关系
            </h2>
            {entry.wiki_definition_zh ? (
              <>
                <p className="definition-quote">{entry.wiki_definition_zh}</p>
                <p className="field-note">
                  示例工作定义，来自 v0.2
                  研究草稿。尚无逐条独立文献核验，不代表统一学术定义。
                </p>
              </>
            ) : (
              <>
                <div className="pending-notice">
                  <span className="badge badge-pending">待建设</span>
                  <strong>这个词条还没有工作定义。</strong>
                  <p>
                    目前只收录了名称与初步分类，尚无成熟定义、经核验的一句话概述或独立文献证据。下面保留原始记录，空白处一律显示未知。
                  </p>
                </div>
              </>
            )}
          </section>
          <section className="detail-block">
            <h2>
              <span className="section-number">02</span>分类与属性
            </h2>
            <p className="field-note">
              以下分类来自原有草稿；属性仅摘录其明确表述，不从名称推断。没有记录的内容显示未知。
            </p>
            <dl className="fact-grid">
              <div>
                <dt>原始类别</dt>
                <dd>{category.name}</dd>
              </div>
              <div>
                <dt>概念类型 · 初步</dt>
                <dd>{kindLabels[entry.kind]}</dd>
              </div>
              <div>
                <dt>拟议原型族</dt>
                <dd>
                  {family ? `${family.name} · 提议待审核` : "归属待核对"}
                  <span className="evidence-caption">
                    原记录：{entry.archetype_family}
                  </span>
                </dd>
              </div>
              <div>
                <dt>参与人数 · 原记录</dt>
                <dd>{participantLabel(entry)}</dd>
              </div>
              {Object.entries(attributeLabels)
                .filter(([key]) => key !== "participants")
                .map(([key, label]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>
                      {attributes[key as AttributeKey] ? (
                        <>
                          {attributes[key as AttributeKey]!.value}
                          <a className="evidence-caption" href="#sources">
                            工作定义摘录 · 查看依据 ↗
                          </a>
                        </>
                      ) : (
                        <span className="unknown">未知／未记录</span>
                      )}
                    </dd>
                  </div>
                ))}
              <div>
                <dt>名称与别称</dt>
                <dd>
                  {entry.aliases.length
                    ? entry.aliases.join("、")
                    : "未收录额外别称"}
                  {englishName(entry) && (
                    <span className="evidence-caption">
                      原名括注：{englishName(entry)}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
          <section className="detail-block">
            <h2>
              <span className="section-number">03</span>边界、互动与变化
            </h2>
            <div className="prose">
              <p>
                参与者角色、典型互动、常见冲突和生命周期转变尚未建立逐条证据。当前不填补这些空白，也不将关系名称解释为自动生效的承诺。
              </p>
              {entry.involuntary_or_harm_risk ? (
                <p>
                  此词条仅供描述与风险研究，不提供建立或维持伤害性关系的协议模板。
                </p>
              ) : (
                <p>
                  如当事人自愿讨论关系，可以分别澄清时间安排、共享资源、隐私、沟通方式与退出边界。这是通用讨论提示，不是本词条已经证实的特征，也不是强制义务。
                </p>
              )}
              <p>
                描述性知识与规范性协议独立保存。涉及法律责任的条目需要明确法域与适用条件，当前未作法律效力认定。
              </p>
            </div>
            {entry.review_notes.length > 0 && (
              <div className="source-record">
                <strong>原稿编辑备注</strong>
                {entry.review_notes.map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </div>
            )}
          </section>
          <section className="detail-block" id="sources">
            <h2>
              <span className="section-number">04</span>依据与可追溯记录
            </h2>
            <p className="prose">
              独立文献依据：
              {entry.source_refs.length
                ? ""
                : "尚未逐条收录。原始目录能证明此名称被收录，不能证明定义已经过验证。"}
            </p>
            {entry.source_refs.map((ref) => (
              <p key={ref}>
                <a href={ref} target="_blank" rel="noreferrer">
                  {ref}
                </a>
              </p>
            ))}
            {evidenceFor(entry).map((e) => (
              <div className="source-record" key={e.id}>
                <strong>
                  {e.kind === "source_fact"
                    ? "来源记录 · 名称收录事实"
                    : "工作定义 · 未审核"}
                </strong>
                <p>
                  <code>
                    {e.source} → {e.locator}
                  </code>
                </p>
                <p>{e.quote}</p>
              </div>
            ))}
            <p className="field-note">
              理论推论：未添加。待验证内容：分类、原型归属及工作定义。概览参考链接不自动成为每条词条的证据。
            </p>
            <details className="details-disclosure">
              <summary>查看完整原始草稿记录</summary>
              <pre>{JSON.stringify(entry, null, 2)}</pre>
            </details>
          </section>
        </div>
        <aside className="detail-sidebar">
          <div className="sidebar-box">
            <h2>馆藏档案</h2>
            <dl>
              <dt>稳定 ID</dt>
              <dd>{entry.id}</dd>
              <dt>审核状态</dt>
              <dd>未经独立审核</dd>
              <dt>数据版本</dt>
              <dd>0.2.0-research-draft</dd>
              <dt>词条性质</dt>
              <dd>
                描述性 Wiki{entry.involuntary_or_harm_risk ? " · 风险专题" : ""}
              </dd>
            </dl>
            <Link className="outline-button" href={`/graph?entry=${id}`}>
              在图谱中定位 <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="sidebar-box">
            <h2>同分类，继续探索</h2>
            <p
              className="field-note"
              style={{ marginTop: 0, marginBottom: 18 }}
            >
              仅表示目录相邻，不代表已验证的子类型或同义关系。
            </p>
            <div className="detail-links">
              {related.map((e) => (
                <Link key={e.id} href={`/relationships/${e.id}`}>
                  {e.label_zh}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
          <Link className="text-link" href="/about">
            阅读编辑原则 <ArrowUpRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
