import Link from "next/link";
import { questions, templates } from "@/lib/assessment";
export const metadata = { title: "题库草案与透明规则" };
export default function Method() {
  return (
    <div className="page-wrap method-page">
      <span className="eyebrow">METHOD / v0.1 DRAFT</span>
      <h1 className="page-title">每一步，都有可检查的依据。</h1>
      <p className="page-intro">
        这是编辑设计的关系阅读导航，不是已验证的心理量表。来源文献不为这套问卷背书。
      </p>
      <Link className="outline-button" href="/explore">
        返回偏好探索
      </Link>
      <section className="detail-block">
        <h2>选题与停止</h2>
        <p className="prose">
          先问主要目的，然后依次询问情感、期限、时间、独立空间与沟通方式。活动方向加活动题，科研方向加协作角色题；学习、科研、居住和社区方向加资源题。恋爱方向先确认成年，确认后才加浪漫、身体边界、排他性和居住题。当前路径最多
          12 题，最少 6
          题；可以提前结束并保留未知。修改分支后失效的旧答案立即从计算中移除。
        </p>
        <p className="prose">
          主要方向限定候选池。必要条件逐项检查：模板不支持则排除；模板未定义则标记待确认。已知支持项每项加
          2，软偏好差异每项减 1，主要方向固定加 6；同分按稳定 ID
          排序。这些权重是未经校准的编辑选择，只用于排序，不显示百分比，不推断成功率。用户否认的项从本轮建议移除。
        </p>
      </section>
      <section className="detail-block">
        <h2>可审查的题库（{questions.length} 题，按分支选用）</h2>
        {questions.map((q) => (
          <article className="source-record" key={q.id}>
            <h3>
              {q.id} · {q.title}
            </h3>
            <p>{q.why}</p>
            <ul>
              {q.options.map((o) => (
                <li key={o.value}>
                  <code>{o.value}</code>：{o.label}
                </li>
              ))}
            </ul>
            <p className="field-note">
              全部支持不确定／跳过／不适用。
              {q.hard ? "可标记为必要条件。" : "不作为必要条件。"}
              {q.sensitive ? "仅在成年确认后显示。" : ""}
            </p>
          </article>
        ))}
      </section>
      <section className="detail-block">
        <h2>阅读模板（{templates.length} 项）</h2>
        <p className="prose">
          模板是可协商安排的编辑提议，不能把其接受选项当成词条的普遍事实。百科工作定义与个人答案分别存放。没有任何真实候选人参与计算。
        </p>
        {templates.map((t) => (
          <details className="details-disclosure" key={t.id}>
            <summary>
              {t.title} · {t.id}
            </summary>
            <p>{t.scope}</p>
            <Link href={`/relationships/${t.id}`}>百科定义 ↗</Link>
            {Object.entries(t.signals).map(([id, s]) => (
              <p key={id}>{s.basis}</p>
            ))}
          </details>
        ))}
      </section>
      <section className="detail-block">
        <h2>什么尚不能保证</h2>
        <p className="prose">
          题项理解、中文语义覆盖、跨文化适用、结果对用户是否有用、稳定性与公平性均未完成真人研究。下一步应招募自愿成年参与者开展认知访谈和可用性研究，并预先说明数据处理方案。当前仅使用虚构测试输入，不推断精神健康、性倾向、人格缺陷或违法行为。
        </p>
      </section>
    </div>
  );
}
